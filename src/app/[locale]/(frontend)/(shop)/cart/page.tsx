import React from 'react'
import { CartClient } from './CartClient'

export const metadata = {
  title: 'Your Cart | 99 Purity Peptides',
}

export default function CartPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="pt-20">
        <CartClient />
      </div>
    </div>
  )
}
