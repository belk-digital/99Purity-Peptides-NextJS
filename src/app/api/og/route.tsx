import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Dynamic params
    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : '99 Purity Peptides'
      
    const description = searchParams.has('description')
      ? searchParams.get('description')?.slice(0, 150)
      : 'Research-grade excellence. Dedicated to purity.'

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
    const logoUrl = `${serverUrl}/99%20Images/99pp-Logo.png`
    const bgUrl = 'https://pub-82f90d490a8048aa9629f0ae3ea6f567.r2.dev/Logo/vial-ice-closeup.webp'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#000000',
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            fontFamily: 'sans-serif',
            padding: '80px',
            position: 'relative',
          }}
        >
          {/* Dark Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(5, 5, 5, 0.85)',
              zIndex: 1,
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              zIndex: 2,
              width: '100%',
              height: '100%',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={logoUrl}
                alt="99 Purity Peptides"
                style={{ width: 'auto', height: '60px', objectFit: 'contain' }}
              />
            </div>

            {/* Content block */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginTop: 'auto',
                marginBottom: 'auto',
              }}
            >
              <h1
                style={{
                  fontSize: '72px',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h1>
              
              {description && (
                <p
                  style={{
                    fontSize: '32px',
                    color: '#9CA3AF',
                    margin: 0,
                    lineHeight: 1.4,
                    maxWidth: '85%',
                    fontWeight: 500,
                  }}
                >
                  {description}
                </p>
              )}
            </div>
            
            {/* Footer / Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'rgba(30, 86, 97, 0.2)',
                  border: '1px solid rgba(30, 86, 97, 0.4)',
                  padding: '8px 24px',
                  borderRadius: '100px',
                  color: '#2DD4BF',
                  fontSize: '20px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                99puritypeptides.com
              </div>
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
