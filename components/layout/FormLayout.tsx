import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

interface FormLayoutProps {
  children: React.ReactNode
  breadcrumbs: {
    label: string
    href?: string
  }[]
}

export default function FormLayout({ children, breadcrumbs }: FormLayoutProps) {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className='border-b bg-muted/30'>
        <div className='mx-auto max-w-6xl px-4 py-4'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href='/rrhh'>RRHH</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {breadcrumbs.map((crumb, index) => (
                <div key={index} className='flex items-center gap-1.5'>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <main className='mx-auto max-w-3xl px-4 py-8'>{children}</main>
    </>
  )
}
