import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link className='flex items-center gap-2' href='/'>
      <Image
        src='/svg/logo.svg'
        alt='Construx logo green'
        width={48}
        height={48}
        priority
      />
      <span className='text-xl font-bold text-emerald-500'>Construx</span>
    </Link>
  )
}

export default Logo
