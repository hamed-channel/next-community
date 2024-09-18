import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import { getCompanyBySlug } from '@/lib/companies'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Member from '@/components/member'

export default async function Company({
  params: { slug }
}: {
  params: { slug: string }
}) {
  const company = await getCompanyBySlug(slug)

  if (!company) {
    return (
      <section className='pb-24 pt-32 sm:pt-40'>
        <div className='container'>
          <h1 className='text-3xl font-bold'>Company not found</h1>
          <p className='text-muted-foreground'>
            The company you are looking for does not exist.
          </p>

          <div className='mt-8'>
            <Link
              href='/companies'
              className='inline-flex items-center gap-2 transition-colors hover:text-fuchsia-500'
            >
              <span aria-hidden='true'>←</span>
              Back to Companies
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='pb-24 pt-32 sm:pt-40'>
      <div className='container'>
        <div className='-mt-4'>
          <Link
            href='/companies'
            className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-fuchsia-500'
          >
            <span aria-hidden='true'>←</span>
            All companies
          </Link>
        </div>

        <section className='mt-4 flex flex-col items-start justify-between gap-x-10 gap-y-12 sm:flex-row'>
          {/* About */}
          <div>
            <h2 className='title text-3xl sm:text-4xl'>{company.name}</h2>
            <p className='text-sm text-muted-foreground'>{company.tagline}</p>
            <p className='mt-6 max-w-lg text-muted-foreground'>
              {company.description}
            </p>

            {/* Services */}
            {company.services.length > 0 && (
              <div className='mt-10'>
                <h3 className='font-medium'>Services we offer: </h3>
                <ul className='mt-4 flex list-inside list-disc flex-col gap-2'>
                  {company.services.map(service => (
                    <li
                      key={service.id}
                      className='text-sm text-muted-foreground marker:text-fuchsia-500'
                    >
                      {service.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Contact */}
          <Card className='max-sm:w-full sm:min-w-96'>
            <CardHeader>
              <h3 className='font-semibold'>Get in touch</h3>
            </CardHeader>

            <CardContent>
              <div className='flex flex-col gap-2'>
                <a
                  href={`mailto:${company.email}`}
                  className='flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground'
                >
                  <Mail
                    className='h-5 w-5 text-fuchsia-500'
                    aria-hidden='true'
                  />
                  {company.email}
                </a>
                <a
                  href={`tel:${company.phone}`}
                  className='flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground'
                >
                  <Phone
                    className='h-5 w-5 text-fuchsia-500'
                    aria-hidden='true'
                  />
                  {company.phone}
                </a>
              </div>
            </CardContent>

            <CardFooter>
              {company.website && (
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href={company.website}
                  className='flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-fuchsia-500'
                >
                  Visit our website
                  <span aria-hidden='true'>→</span>
                </a>
              )}
            </CardFooter>
          </Card>
        </section>

        {/* Members */}
        {company.staff.length > 0 && (
          <div className='mt-12 sm:mt-16'>
            <div>
              <div className='mx-auto max-w-2xl lg:mx-0'>
                <h2 className='text-xl font-semibold tracking-tight sm:text-2xl'>
                  Our team
                </h2>
                <p className='mt-6 max-w-lg text-muted-foreground'>
                  We're a dynamic group of individuals who are passionate about
                  what we do and dedicated to delivering the best results for
                  our clients.
                </p>
              </div>
              <ul
                role='list'
                className='mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-14 sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6'
              >
                {company.staff.map(member => (
                  <Member key={member.id} member={member} />
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
