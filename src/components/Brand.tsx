const BOLT_PATH = 'M13 3L4 14H12L11 21L20 10H12L13 3Z';
export const ZYNTEQ_GOLD = '#F5C518';
export const ZYNTEQ_NAVY = '#0A0E1A';

export function ZynteqBolt({
  size = 20,
  tile = false,
  tileSize,
}: {
  size?: number;
  tile?: boolean;
  tileSize?: number;
}) {
  if (!tile) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={BOLT_PATH}
          fill={ZYNTEQ_GOLD}
          fillOpacity="0.3"
          stroke={ZYNTEQ_GOLD}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  const t = tileSize ?? Math.round(size * 2);
  return (
    <span
      aria-hidden="true"
      style={{
        width: t,
        height: t,
        borderRadius: Math.round(t * 0.28),
        background: ZYNTEQ_NAVY,
        border: '1px solid rgba(245,197,24,0.35)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d={BOLT_PATH}
          fill={ZYNTEQ_GOLD}
          fillOpacity="0.3"
          stroke={ZYNTEQ_GOLD}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * ClinicOS product lockup endorsed by Zynteq — mirrors zynteq.in
 * ("Zynteq" wordmark + gold dot) for one consistent identity.
 */
export function ClinicOSLockup({
  theme = 'dark',
  compact = false,
  subline = true,
}: {
  theme?: 'dark' | 'light';
  compact?: boolean;
  subline?: boolean;
}) {
  const wordColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const subColor = theme === 'dark' ? '#8FA89E' : '#93A0AE';
  if (compact) {
    return <ZynteqBolt size={20} tile tileSize={40} />;
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <ZynteqBolt size={20} tile tileSize={40} />
      <span>
        <span
          className="font-display"
          style={{ display: 'block', fontSize: 19, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.01em', color: wordColor }}
        >
          ClinicOS
        </span>
        {subline && (
          <span
            style={{
              display: 'block',
              fontSize: 10,
              fontFamily: "'IBM Plex Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: subColor,
              marginTop: 5,
            }}
          >
            by Zynteq<span style={{ color: ZYNTEQ_GOLD }}>.</span>
          </span>
        )}
      </span>
    </span>
  );
}
