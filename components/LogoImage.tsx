'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function LogoImage() {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <span
        className="font-display font-bold text-8xl text-green-base/20 select-none pointer-events-none"
        aria-hidden="true"
      >
        ALT
      </span>
    )
  }

  return (
    <Image
      src="/ALT - Logo-02.png"
      alt="Asamblea Las Torres"
      width={280}
      height={280}
      className="object-contain drop-shadow-xl"
      priority
      onError={() => setError(true)}
    />
  )
}
