import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className='pb-24 pt-32 sm:pt-40'>
      <div className='container flex max-w-5xl items-center justify-center'>
        <SignUp />
      </div>
    </section>
  )
}
