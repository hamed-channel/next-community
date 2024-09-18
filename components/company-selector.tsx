'use client'

import * as React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Company } from '@prisma/client'

interface CompanySelectorProps {
  companies: Company[]
  selectedCompany: string
  setSelectedCompany: (companyId: string) => void
}

export function CompanySelector({
  companies,
  selectedCompany,
  setSelectedCompany
}: CompanySelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
        >
          {selectedCompany
            ? companies.find(company => company.slug === selectedCompany)?.name
            : 'Select company...'}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='p-0'>
        <Command>
          <CommandInput placeholder='Search framework...' className='h-9' />
          <CommandList>
            <CommandEmpty>No company found.</CommandEmpty>
            <CommandGroup>
              {companies.map(company => (
                <CommandItem
                  key={company.id}
                  value={company.slug}
                  onSelect={currentValue => {
                    setSelectedCompany(currentValue)
                    setOpen(false)
                  }}
                >
                  {company.name}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedCompany === company.slug
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
