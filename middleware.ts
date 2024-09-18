import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/profile'])
const isOnboardingRoute = createRouteMatcher(['/onboarding'])

export default clerkMiddleware((auth, req: NextRequest) => {
  const { userId, sessionClaims } = auth()

  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    if (isOnboardingRoute(req)) {
      return NextResponse.next()
    }

    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  if (
    userId &&
    isOnboardingRoute(req) &&
    sessionClaims?.metadata?.onboardingComplete
  ) {
    const home = new URL('/', req.url)
    return NextResponse.redirect(home)
  }

  if (isProtectedRoute(req)) auth().protect()

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
