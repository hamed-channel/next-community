'use server'

import { z } from 'zod'
import { updateUser } from '@/lib/users'

import { revalidatePath } from 'next/cache'
import { auth, clerkClient } from '@clerk/nextjs/server'

import { onboardingSchema } from '@/lib/schemas'

type OnboardingInputs = z.infer<typeof onboardingSchema>
export async function completeOnboardingAction(data: OnboardingInputs) {
  const { userId } = auth()

  if (!userId) {
    return { error: 'Please log in first.' }
  }

  const result = onboardingSchema.safeParse(data)

  if (result.error) {
    return { error: 'Please select a company.' }
  }

  try {
    await clerkClient().users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        companySlug: result.data.companySlug
      }
    })

    const { user } = await updateUser(userId, {
      companySlug: result.data.companySlug
    })

    // trigger welcome workflow

    const slug = user?.companySlug
    revalidatePath(`/companies/${slug}`)
    return { slug }
  } catch (err) {
    return { error: 'There was an error updating the user metadata.' }
  }
}
