import prisma from '@/lib/prisma'

export async function getCompanies(
  limit?: number,
  sort: 'name' | 'createdAt' = 'createdAt'
) {
  return await prisma.company.findMany({
    orderBy: { [sort]: 'desc' },
    ...(limit ? { take: limit } : {}),
    include: {
      category: true
    }
  })
}

export async function getCompanyBySlug(slug: string) {
  return await prisma.company.findUnique({
    where: {
      slug
    },
    include: {
      staff: {
        orderBy: {
          lastName: 'asc'
        }
      },
      services: true,
      category: true
    }
  })
}
