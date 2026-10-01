import type { ReactNode } from 'react'
import type { Destination, Palette } from '../types'

const lisbon = (p: Palette): ReactNode => (
  <>
    <defs>
      <pattern id="azulejo" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill={p.accent} />
        <circle cx="20" cy="20" r="13" fill="none" stroke={p.mid} strokeWidth="2" />
        <path d="M20 8 L32 20 L20 32 L8 20Z" fill={p.mid} />
        <circle cx="20" cy="20" r="3.5" fill={p.sun} />
      </pattern>
    </defs>
    <path d="M0 330 Q100 280 200 315 T400 290 V500 H0Z" fill={p.far} />
    {[
      [18, 318, 40, 52],
      [62, 306, 36, 64],
      [102, 326, 46, 44],
      [152, 300, 38, 70],
      [194, 322, 50, 48],
      [248, 308, 36, 62],
      [288, 328, 44, 42],
      [336, 302, 48, 68],
    ].map(([x, y, w, h], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h + 40} fill={p.mid} />
        <path d={`M${x - 3} ${y} L${x + w / 2} ${y - 14} L${x + w + 3} ${y}Z`} fill={p.near} />
        <rect x={x + 8} y={y + 12} width="7" height="10" fill={p.accent} opacity=".8" />
        <rect x={x + w - 15} y={y + 12} width="7" height="10" fill={p.accent} opacity=".8" />
      </g>
    ))}
    <path d="M0 405 Q120 372 240 398 T400 384 V500 H0Z" fill={p.near} />
    <rect y="436" width="400" height="64" fill="url(#azulejo)" />
  </>
)

const tokyo = (p: Palette): ReactNode => (
  <>
    {[
      [0, 380, 46, 120],
      [40, 350, 40, 150],
      [76, 395, 50, 105],
      [270, 360, 44, 140],
      [312, 330, 38, 170],
      [348, 375, 52, 125],
    ].map(([x, y, w, h], i) => (
      <rect key={i} x={x} y={y} width={w} height={h} fill={i % 2 ? p.mid : p.far} />
    ))}
    <g stroke={p.near} strokeWidth="5" fill="none" strokeLinecap="square">
      <path d="M200 130 L150 440 M200 130 L250 440" />
      <path d="M177 290 H223 M167 345 H233 M186 235 H214 M158 400 H242" />
      <path d="M177 290 L233 345 M223 290 L167 345" strokeWidth="3" />
    </g>
    <rect x="197" y="92" width="6" height="46" fill={p.near} />
    <rect y="440" width="400" height="60" fill={p.near} />
    <rect x="30" y="462" width="340" height="4" fill={p.sun} opacity=".7" />
  </>
)

const newYork = (p: Palette): ReactNode => (
  <>
    {[
      [10, 300, 44, 200],
      [50, 340, 38, 160],
      [84, 280, 40, 220],
      [280, 310, 40, 190],
      [318, 260, 34, 240],
      [350, 330, 50, 170],
    ].map(([x, y, w, h], i) => (
      <rect key={i} x={x} y={y} width={w} height={h} fill={i % 2 ? p.mid : p.far} />
    ))}
    <g fill={p.near}>
      <rect x="160" y="330" width="80" height="170" />
      <rect x="170" y="290" width="60" height="40" />
      <rect x="180" y="255" width="40" height="36" />
      <rect x="190" y="228" width="20" height="28" />
      <rect x="198" y="170" width="4" height="60" />
      <rect x="120" y="360" width="40" height="140" />
      <rect x="240" y="370" width="40" height="130" />
    </g>
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={172 + (i % 4) * 16} y={342 + Math.floor(i / 4) * 26} width="6" height="10" fill={p.sun} opacity=".85" />
    ))}
    <rect y="452" width="400" height="48" fill={p.mid} />
    <path d="M0 470 Q50 462 100 470 T200 470 T300 470 T400 470" stroke={p.accent} strokeWidth="2" fill="none" opacity=".6" />
  </>
)

const capeTown = (p: Palette): ReactNode => (
  <>
    <path d="M0 400 L70 330 L130 262 L310 262 L360 320 L400 360 V500 H0Z" fill={p.mid} />
    <path d="M130 262 L200 300 L310 262Z" fill={p.near} opacity=".35" />
    <g fill={p.accent}>
      <ellipse cx="150" cy="262" rx="60" ry="14" />
      <ellipse cx="230" cy="256" rx="70" ry="16" />
      <ellipse cx="300" cy="266" rx="50" ry="12" />
    </g>
    <path d="M0 430 Q100 405 200 428 T400 410 V500 H0Z" fill={p.near} />
    <g stroke={p.accent} strokeWidth="2" fill="none" opacity=".7">
      <path d="M0 462 Q25 452 50 462 T100 462 T150 462 T200 462 T250 462 T300 462 T350 462 T400 462" />
      <path d="M0 482 Q25 472 50 482 T100 482 T150 482 T200 482 T250 482 T300 482 T350 482 T400 482" />
    </g>
  </>
)

const generic = (p: Palette): ReactNode => (
  <>
    <path d="M0 365 Q90 285 180 345 T400 320 V500 H0Z" fill={p.far} />
    <path d="M0 420 Q95 355 205 410 T400 390 V500 H0Z" fill={p.mid} />
    <g fill={p.near} opacity=".92">
      <rect x="38" y="320" width="48" height="180" />
      <rect x="104" y="350" width="62" height="150" />
      <rect x="185" y="300" width="54" height="200" />
      <rect x="258" y="340" width="70" height="160" />
      <rect x="346" y="315" width="38" height="185" />
    </g>
    <path d="M0 450 Q80 430 160 450 T320 448 T400 450 V500 H0Z" fill={p.accent} opacity=".16" />
  </>
)

const ART: Partial<Record<Destination['id'], (p: Palette) => ReactNode>> = {
  lisbon,
  tokyo,
  'new-york': newYork,
  'cape-town': capeTown,
}

export default function DestinationArt({ destination, className = '' }: { destination: Destination; className?: string }) {
  const p = destination.palette
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`Illustration of ${destination.name}`}
    >
      <rect width="400" height="500" fill={p.sky} />
      <circle cx="268" cy="176" r="74" fill={p.sun} />
      {ART[destination.id]?.(p) ?? generic(p)}
    </svg>
  )
}
