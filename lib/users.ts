import prisma from '@/lib/prisma'
import { User } from '@prisma/client'

export async function getUsers(limit?: number) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        lastName: 'asc'
      },
      ...(limit ? { take: limit } : {})
    })
    return { users }
  } catch (error) {
    return { error }
  }
}

export async function createUser(data: User) {
  try {
    const user = await prisma.user.create({ data })
    return { user }
  } catch (error) {
    return { error }
  }
}

export async function getUserById({
  id,
  clerkUserId
}: {
  id?: string
  clerkUserId?: string
}) {
  try {
    if (!id && !clerkUserId) {
      throw new Error('id or clerkUserId is required')
    }

    const query = id ? { id } : { clerkUserId }

    const user = await prisma.user.findUnique({ where: query })
    return { user }
  } catch (error) {
    return { error }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    return { user }
  } catch (error) {
    return { error }
  }
}

export async function updateUser(id: string, data: Partial<User>) {
  try {
    const user = await prisma.user.update({
      where: { clerkUserId: id },
      data
    })
    return { user }
  } catch (error) {
    return { error }
  }
}

export async function deleteUser(id: string) {
  try {
    const user = await prisma.user.delete({
      where: { clerkUserId: id }
    })
    return { user }
  } catch (error) {
    return { error }
  }
}

export function combineName(user: User) {
  const { firstName, lastName } = user
  return `${firstName} ${lastName}`
}
