import { getCompanies } from '@/lib/companies'

import Companies from '@/components/companies'
import { getCategories } from '@/lib/categories'

export default async function CompaniesPage() {
  const companies = await getCompanies()
  const categories = await getCategories()

  if (!companies || companies.length === 0) {
    return null
  }

  return (
    <section className='pb-24 pt-32 sm:pt-40'>
      <div className='container'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='title'>Companies</h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Companies in our community
            </p>
          </div>
        </div>

        <Companies companies={companies} categories={categories} />
      </div>
    </section>
  )
}
