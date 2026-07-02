export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {children}
    </div>
  )
}
