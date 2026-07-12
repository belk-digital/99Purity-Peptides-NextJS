import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    let title = searchParams.has('title')
      ? searchParams.get('title') || '99 Purity Peptides'
      : '99 Purity Peptides'
      
    // Strip redundant brand name to keep text short and clean
    if (title.includes(' | 99PurityPeptides')) {
      title = title.replace(' | 99PurityPeptides', '')
    }
    title = title.slice(0, 90)
      
    let description = searchParams.has('description')
      ? searchParams.get('description')?.slice(0, 120) // Shorter limit for description
      : 'Research-grade excellence. Dedicated to purity.'

    // Always use the public R2 bucket so it 100% renders in local and production
    const logoUrl = 'https://pub-82f90d490a8048aa9629f0ae3ea6f567.r2.dev/Logo/99pp-Logo.png'
    
    // We must use a PNG or JPG because OG image generator does not support WebP.
    // I converted the requested og-image.webp to og-image.png so it works natively here!
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
    const bgUrl = `${serverUrl}/99%20Images/og-image.png`

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#050505',
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            fontFamily: 'sans-serif',
            padding: '80px',
            position: 'relative'
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
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
            {/* Logo - Made bigger */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={logoUrl}
                alt="99 Purity Peptides"
                style={{ height: '95px', objectFit: 'contain' }}
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
                  fontSize: '76px',
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
                    color: '#e2e8f0',
                    margin: 0,
                    lineHeight: 1.4,
                    maxWidth: '90%',
                    fontWeight: 500,
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
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '12px 32px',
                  borderRadius: '100px',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
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
