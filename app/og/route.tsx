import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Wassim Ben Salem'
  const subtitle = searchParams.get('subtitle') ?? 'AI Systems Engineer'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#0A0A0A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Dot grid background simulation */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, #1A1A1A 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, transparent 40%, #0A0A0A 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: '#71717A',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            wassimbensalem.com
          </p>
          <h1
            style={{
              fontSize: title.length > 40 ? '42px' : '56px',
              fontWeight: 700,
              color: '#FAFAFA',
              letterSpacing: '-0.03em',
              margin: 0,
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: '#A1A1AA',
              margin: 0,
              marginTop: '8px',
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
