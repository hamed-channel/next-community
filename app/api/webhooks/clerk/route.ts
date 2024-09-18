import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { Client } from '@upstash/qstash'
import { revalidatePath } from 'next/cache'
import { WebhookEvent } from '@clerk/nextjs/server'

import { User } from '@prisma/client'
import { updateUser, createUser } from '@/lib/users'

const qstashClient = new Client({ token: process.env.QSTASH_TOKEN as string })

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    if (!id || !email_addresses || !email_addresses.length) {
      return new Response('Error occurred -- missing data', {
        status: 400
      })
    }

    const email = email_addresses[0].email_address

    const user = {
      clerkUserId: id,
      firstName: first_name,
      lastName: last_name,
      email: email,
      ...(image_url ? { imageUrl: image_url } : {})
    }

    try {
      const { user: userFromDB, error } = await createUser(user as User)
      if (error) throw error
      revalidatePath(`/`)
    } catch (error) {
      return new Response('Error occurred', {
        status: 400
      })
    }

    // Trigger a workflow
    try {
      await qstashClient.publishJSON({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/workflow`,
        body: {
          user: {
            id: id,
            email: email,
            firstName: first_name,
            lastName: last_name
          }
        }
      })
    } catch (error) {
      console.error('Error triggering workflow:', error)
    }
  }

  if (eventType === 'user.updated') {
    const { id, first_name, last_name, image_url } = evt.data

    if (!id) {
      return new Response('Error occurred -- missing data', {
        status: 400
      })
    }

    const data = {
      ...(first_name ? { firstName: first_name } : {}),
      ...(last_name ? { lastName: last_name } : {}),
      ...(image_url ? { imageUrl: image_url } : {})
    }

    try {
      await updateUser(id, data)
      revalidatePath(`/`)
    } catch (error) {
      return new Response('Error occurred', {
        status: 400
      })
    }
  }

  // TODO: implement the user:deleted event

  return new Response('', { status: 200 })
}
