import React from 'react'

/**
 * HaikeiHeroBackground
 * Lightweight, layered SVG generative backdrop inspired by Haikei.app
 * Features smooth organic wave contours, micro-grid textures, and subtle mint/emerald ambient layers.
 */
export function HaikeiHeroBackground({ className = '' }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Ambient Gradient Blobs */}
      <div className="absolute -top-32 right-1/4 w-[520px] h-[520px] bg-gradient-to-br from-mint-200/40 to-emerald-200/25 rounded-full blur-3xl transform-gpu" />
      <div className="absolute top-1/3 -left-20 w-[420px] h-[420px] bg-gradient-to-tr from-mint-100/50 to-emerald-100/30 rounded-full blur-3xl transform-gpu" />

      {/* Primary Layered Haikei Organic Wave SVG */}
      <svg
        className="absolute top-0 right-0 w-full h-full opacity-65 preserve-3d"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="haikei-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.32" />
            <stop offset="65%" stopColor="#E7F8EF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FAFCFA" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="haikei-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#D1FAE5" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <pattern id="haikei-dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#059669" fillOpacity="0.08" />
          </pattern>
        </defs>

        {/* Subtle geometric dot grid pattern */}
        <rect width="1440" height="900" fill="url(#haikei-dot-grid)" />

        {/* Back organic blob curve */}
        <path
          d="M780,0 C920,80 1080,120 1200,80 C1320,40 1400,10 1440,0 L1440,540 C1380,560 1250,520 1140,490 C1030,460 940,440 850,470 C760,500 680,600 580,580 C480,560 410,420 380,310 C350,200 480,110 590,70 C700,30 740,0 780,0 Z"
          fill="url(#haikei-grad-1)"
        />

        {/* Foreground flowing contour wave */}
        <path
          d="M960,0 C1080,60 1240,110 1350,90 C1400,80 1430,40 1440,20 L1440,420 C1360,460 1240,410 1120,380 C1000,350 880,360 810,410 C740,460 690,520 620,510 C550,500 500,430 490,360 C480,290 530,220 610,160 C690,100 840,40 960,0 Z"
          fill="url(#haikei-grad-2)"
        />

        {/* Fine topographical accent lines */}
        <path
          d="M500,180 C680,110 890,70 1090,120 C1250,160 1380,130 1440,90"
          stroke="#059669"
          strokeOpacity="0.14"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <path
          d="M420,340 C560,370 720,480 880,450 C1040,420 1220,470 1440,400"
          stroke="#059669"
          strokeOpacity="0.12"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  )
}

export default HaikeiHeroBackground
