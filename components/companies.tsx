'use client'

import { useState } from 'react'
import { Category, Company } from '@prisma/client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { Checkbox } from '@/components/ui/checkbox'
import CompanyItem from '@/components/company-item'

import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons'

interface CompaniesProps {
  companies: (Company & {
    category: Category
  })[]
  categories: Category[]
}

export default function Companies({ companies, categories }: CompaniesProps) {
  const [sort, setSort] = useState('')
  const sorted = companies.sort((a, b) => {
    if (sort === 'asc') {
      return a.name.localeCompare(b.name)
    } else if (sort === 'desc') {
      return b.name.localeCompare(a.name)
    } else {
      return 0
    }
  })

  const [query, setQuery] = useState('')
  const filtered = sorted.filter(company =>
    company.name.toLowerCase().includes(query.toLowerCase())
  )

  const [selectedTags, setSelectedTags] = useState<Category[]>([])
  const filteredByTags = filtered.filter(company =>
    selectedTags.length === 0
      ? true
      : selectedTags.some(tag => company.category.id === tag.id)
  )

  const isFiltered = query.length > 0 || selectedTags.length > 0
  function resetFilter() {
    setQuery('')
    setSelectedTags([])
  }

  return (
    <div className='mt-10'>
      <div className='flex items-center justify-between gap-10'>
        <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center'>
          <Input
            placeholder='Search companies...'
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            className='h-8 w-full sm:w-[250px] lg:w-[300px]'
          />

          <div className='flex items-center justify-between gap-3'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 border-dashed'
                >
                  <PlusCircledIcon className='mr-2 h-4 w-4' />
                  Category
                  {selectedTags?.length > 0 && (
                    <>
                      <Separator orientation='vertical' className='mx-2 h-4' />
                      <Badge
                        variant='secondary'
                        className='rounded-sm px-1 font-normal lg:hidden'
                      >
                        {selectedTags.length}
                      </Badge>
                      <div className='hidden space-x-1 lg:flex'>
                        {selectedTags.length > 2 ? (
                          <Badge
                            variant='secondary'
                            className='rounded-sm px-1 font-normal'
                          >
                            {selectedTags.length} selected
                          </Badge>
                        ) : (
                          selectedTags.map(tag => (
                            <Badge
                              variant='secondary'
                              key={tag.id}
                              className='rounded-sm px-1 font-normal'
                            >
                              {tag.name}
                            </Badge>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align='start'>
                <div className='flex flex-col gap-2'>
                  {categories.map(tag => (
                    <div className='flex items-center space-x-2' key={tag.id}>
                      <Checkbox
                        id={tag.id}
                        checked={selectedTags.some(t => t.id === tag.id)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setSelectedTags([...selectedTags, tag])
                          } else {
                            setSelectedTags(
                              selectedTags.filter(t => t.id !== tag.id)
                            )
                          }
                        }}
                      />
                      <label
                        htmlFor={tag.id}
                        className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        {tag.name}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {isFiltered && (
              <Button
                size='sm'
                variant='secondary'
                onClick={resetFilter}
                className='h-8 px-2 lg:px-3'
              >
                Reset
                <Cross2Icon className='ml-2 h-4 w-4' />
              </Button>
            )}

            {/* sort */}
            <div className='sm:hidden'>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className='h-8 w-[120px]'>
                  <SelectValue placeholder='Sort' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort</SelectLabel>
                    <SelectItem value='asc' className='text-xs'>
                      Sort A to Z
                    </SelectItem>
                    <SelectItem value='desc' className='text-xs'>
                      Sort Z to A
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* sort */}
        <div className='hidden sm:block'>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='h-8 w-[120px]'>
              <SelectValue placeholder='Sort' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort</SelectLabel>
                <SelectItem value='asc' className='text-xs'>
                  Sort A to Z
                </SelectItem>
                <SelectItem value='desc' className='text-xs'>
                  Sort Z to A
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ul className='mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {filteredByTags.map(company => (
          <li key={company.id}>
            <CompanyItem company={company} />
          </li>
        ))}
      </ul>
    </div>
  )
}
