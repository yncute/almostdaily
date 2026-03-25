// Force dynamic rendering — prevents ISR caching from serving one user's session to another
export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
