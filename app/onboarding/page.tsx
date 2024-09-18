import { getCompanies } from '@/lib/companies'
import OnboardingForm from '@/components/onboarding-form'

export default async function OnboardingPage() {
  const companies = await getCompanies()

  return (
    <section className='pb-24 pt-32 sm:pt-40'>
      <div className='container'>
        <OnboardingForm companies={companies} />
      </div>
    </section>
  )
}
