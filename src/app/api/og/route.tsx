import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : '99 Purity Peptides'
      
    const description = searchParams.has('description')
      ? searchParams.get('description')?.slice(0, 150)
      : 'Research-grade excellence. Dedicated to purity.'

    // We use the absolute public R2 url so the image generator can ALWAYS fetch the logo
    const logoUrl = 'https://pub-82f90d490a8048aa9629f0ae3ea6f567.r2.dev/Logo/99pp-Logo.png'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'linear-gradient(to bottom right, #050505, #12353c)',
            fontFamily: 'sans-serif',
            padding: '80px',
            borderTop: '16px solid #1e5661'
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logoUrl}
              alt="99 Purity Peptides"
              style={{ height: '70px', objectFit: 'contain' }}
            />
          </div>

          {/* Content block */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          >
            <h1
              style={{
                fontSize: '84px',
                fontWeight: 800,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {title}
            </h1>
            
            {description && (
              <p
                style={{
                  fontSize: '36px',
                  color: '#94a3b8',
                  margin: 0,
                  lineHeight: 1.4,
                  maxWidth: '90%',
                  fontWeight: 400,
                }}
              >
                {description}
              </p>
            )}
          </div>
          
          {/* Footer / Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '12px 32px',
                borderRadius: '100px',
                color: '#e2e8f0',
                fontSize: '24px',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              99puritypeptides.com
            </div>
            
            {/* Decorative dots */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#2DD4BF' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(45, 212, 191, 0.4)' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(45, 212, 191, 0.15)' }}></div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
