import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function Home() {
  const { userId } = await auth()

  // Always redirect to either sign-in or channels
  if (!userId) {
    redirect('/sign-in')
  }

  redirect('/channels')
}