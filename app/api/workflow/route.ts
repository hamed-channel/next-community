import { serve } from '@upstash/qstash/nextjs'

interface InitialData {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}

export const POST = serve<InitialData>(async context => {
  const { user } = context.requestPayload
  const { id, email, firstName, lastName } = user

  // Step 1: Send welcome email
  await context.run('send-welcome-email', async () => {
    console.log(`Welcome, ${firstName}! sending email to ${email}`)
  })

  // Step 2: Wait for 3 days (in seconds)
  await context.sleep('sleep-until-follow-up', 3 * 24 * 60 * 60)

  // Step 3: Send a follow-up email
  await context.run('send-follow-up-email', async () => {
    console.log(`Follow-up email sent to ${email}`)
  })
})
