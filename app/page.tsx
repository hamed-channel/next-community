import CompanyItem from '@/components/company-item'
import { getCompanies } from '@/lib/companies'
import Link from 'next/link'

export default async function Home() {
  const companies = await getCompanies()

  return (
    <section className='pb-24 pt-40'>
      <div className='container'>
        <div>
          <h1 className='font-serif text-3xl'>New companies</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Recently joined companies
          </p>

          <ul className='4xl:grid-cols-3 mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:max-2xl:grid-cols-3'>
            {companies.map(company => (
              <li key={company.id}>
                <CompanyItem company={company} />
              </li>
            ))}
          </ul>

          <Link
            href='/companies'
            className='mt-8 inline-flex items-center gap-2 transition-colors hover:text-fuchsia-500'
          >
            View all companies
            <span aria-hidden='true'>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
