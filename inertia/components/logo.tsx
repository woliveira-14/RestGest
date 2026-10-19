import { Link } from '@adonisjs/inertia/react'

export default function Logo({ size = 26 }: { size?: number }) {
  return (
    <Link
      route="home"
      aria-label="RestGest"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 9, color: 'var(--ink)' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="160" height="160" rx="36" fill="currentColor" />
        <g stroke="var(--card)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
          {/* Fork */}
          <path d="M52 34v30a12 12 0 0 0 12 12 12 12 0 0 0 12-12V34" />
          <path d="M64 34v30M52 76v50" fill="none" />
          {/* Knife */}
          <path d="M108 34c10 14 10 34 0 48v44" />
        </g>
      </svg>
      <span style={{ fontWeight: 650, letterSpacing: '-0.02em', fontSize: 16 }}>RestGest</span>
    </Link>
  )
}
