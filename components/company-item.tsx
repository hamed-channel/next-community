import Link from 'next/link'
import { Company } from '@prisma/client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { Mail, Phone, SquareArrowOutUpRight } from 'lucide-react'

interface CompanyItemProps {
  company: Company
}

export default function CompanyItem({ company }: CompanyItemProps) {
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader>
        <Link href={`/companies/${company.slug}`} className='group'>
          <CardTitle>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <h3 className='title text-xl'>{company.name}</h3>
              </div>
              <div>
                <SquareArrowOutUpRight className='h-4 w-4 group-hover:text-fuchsia-500' />
              </div>
            </div>
          </CardTitle>
          <CardDescription className='text-xs font-light'>
            {company.tagline}
          </CardDescription>
        </Link>
      </CardHeader>
      <CardContent>
        <p className='line-clamp-4 text-sm text-muted-foreground'>
          {company.description}
        </p>
      </CardContent>
      <CardFooter className='mt-auto'>
        <div className='mt-3 flex w-full flex-col gap-1.5'>
          <a
            href={`mailto:${company.email}`}
            className='inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground'
          >
            <Mail className='h-5 w-5 text-fuchsia-500' aria-hidden='true' />
            {company.email}
          </a>

          <a
            href={`tel:${company.phone}`}
            className='inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground'
          >
            <Phone className='h-5 w-5 text-fuchsia-500' aria-hidden='true' />
            {company.phone}
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
