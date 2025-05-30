import { Loader } from 'lucide-react'

export const AuthSkeleton = () => {
  return (
    <div>
      <Loader className='animate-spin text-muted-foreground opacity-75' />
    </div>
  )
}
