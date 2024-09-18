'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboardingAction } from '@/lib/actions'
import { onboardingSchema } from '@/lib/schemas'
import { toast } from 'sonner'
import { CompanySelector } from '@/components/company-selector'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Company } from '@prisma/client'

type Inputs = z.infer<typeof onboardingSchema>

interface OnboardingFormProps {
  companies: Company[]
}

export default function OnboardingForm({ companies }: OnboardingFormProps) {
  const { user } = useUser()
  const router = useRouter()

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      companySlug: ''
    }
  })

  register('companySlug')
  const selectedCompany = getValues('companySlug')
  function setSelectedCompany(companySlug: string) {
    setValue('companySlug', companySlug, { shouldValidate: true })
  }

  const processForm: SubmitHandler<Inputs> = async data => {
    const result = await completeOnboardingAction(data)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    if (result?.slug) {
      await user?.reload()
      router.push(`/companies/${result.slug}`)

      toast.success('Welcome to the community!')
    }
  }

  return (
    <form onSubmit={handleSubmit(processForm)}>
      <Card className='max-w-lg'>
        <CardHeader>
          <CardTitle>Onboarding to iServe</CardTitle>
          <CardDescription>Select the company you work for</CardDescription>
        </CardHeader>

        <CardContent>
          <CompanySelector
            companies={companies}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
          />

          {errors.companySlug?.message && (
            <p className='mt-2 px-1 text-xs text-red-400'>
              {errors.companySlug.message}
            </p>
          )}
        </CardContent>

        <CardFooter>
          <Button
            size='sm'
            type='submit'
            variant='secondary'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
