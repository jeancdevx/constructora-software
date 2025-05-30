interface AreaFormLayoutProps {
  children: React.ReactNode
}

export default function RRHHAreaIdLayout({ children }: AreaFormLayoutProps) {
  return <main className='mx-auto max-w-3xl px-4 py-8'>{children}</main>
}
