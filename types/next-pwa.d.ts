declare module 'next-pwa' {
  import { NextConfig } from 'next'

  type PWAConfig = {
    dest: string
    register: boolean
    skipWaiting: boolean
    disable?: boolean
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig
  export = withPWA
} 