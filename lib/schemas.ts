import { z } from 'zod'

export const onboardingSchema = z.object({
  companySlug: z.string().min(1, 'Please select a company.')
})
