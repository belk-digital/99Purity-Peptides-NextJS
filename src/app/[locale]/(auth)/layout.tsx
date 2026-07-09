export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'),
  title: '99 Purity Peptides',
  description: 'Premium Peptides for Peak Performance',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {children}
    </div>
  )
}
