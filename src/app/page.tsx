import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-[var(--bg-clr)] flex-col gap-5'>
      <h1 className="text-5xl font-bold sec-ff capitalize text-[var(--txt-clr)] text-center">
        welcome to Tredia admin dashboard
      </h1>

      <Link
        className='text-lg text-[var(--acc-clr)] hover:underline pry-ff'
        href='/login'> Login </Link>
    </main>
  )
}