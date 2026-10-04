export function UserIcon({ className = 'w-5 h-5 text-slate-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function IdCardIcon({ className = 'w-5 h-5 text-slate-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <circle cx="8" cy="10" r="2" />
      <path d="M6 16h4" />
      <path d="M14 8h4" />
      <path d="M14 12h4" />
      <path d="M14 16h2" />
    </svg>
  );
}

export function MailIcon({ className = 'w-5 h-5 text-slate-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function MapPinIcon({ className = 'w-5 h-5 text-slate-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function GraduationCapIcon({ className = 'w-5 h-5 text-slate-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}

export function InfoIcon({ className = 'w-5 h-5 text-[#8A64FF]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function CheckIcon({ className = 'w-5 h-5 text-black' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ArrowRightIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function CalendarIcon({ className = 'w-4 h-4 text-lime-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function CodeIcon({ className = 'w-5 h-5 text-cyan-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function PaletteIcon({ className = 'w-5 h-5 text-purple-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

export function TrendingIcon({ className = 'w-5 h-5 text-emerald-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function CpuIcon({ className = 'w-5 h-5 text-amber-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

export function CompassIcon({ className = 'w-5 h-5 text-sky-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export function UsersIcon({ className = 'w-5 h-5 text-indigo-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function PlusIcon({ className = 'w-5 h-5 text-slate-300' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function FileTextIcon({ className = 'w-6 h-6 text-lime-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function ExternalLinkIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function ShieldCheckIcon({ className = 'w-6 h-6 text-lime-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function WaveIcon({ className = 'w-10 h-3 text-cyan-400' }) {
  return (
    <svg className={className} viewBox="0 0 60 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M2 6c6-6 12-6 18 0s12 6 18 0 12-6 18 0" />
      <path d="M2 12c6-6 12-6 18 0s12 6 18 0 12-6 18 0" opacity="0.6" />
    </svg>
  );
}

export function SingleWave({ className = 'w-10 h-2.5 text-[#b0cf03]' }) {
  return (
    <svg className={className} viewBox="0 0 40 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M2 6c4-4 8-4 12 0s8 4 12 0 8-4 12 0" />
    </svg>
  );
}

export function StepDoubleWave({ className = 'w-6 h-4 text-[#6d48e5]' }) {
  return (
    <svg className={className} viewBox="150 263 24 16" fill="none" stroke="currentColor" strokeWidth="2.03" strokeLinecap="round">
      <path d="M150.923 266.831C153.231 264.062 156 264.062 158.308 266.831C160.615 269.6 163.385 269.6 165.692 266.831C168 264.062 170.769 264.062 173.077 266.831" />
      <path d="M150.923 272.369C153.231 269.6 156 269.6 158.308 272.369C160.615 275.139 163.385 275.139 165.692 272.369C168 269.6 170.769 269.6 173.077 272.369" />
    </svg>
  );
}

export function DotMatrix({ className = 'text-[#6d48e5]', rows = 3, cols = 3, dotRadius = 3, gap = 6 }) {
  const dots = [];
  const dotDiameter = dotRadius * 2;
  const width = cols * dotDiameter + (cols - 1) * gap;
  const height = rows * dotDiameter + (rows - 1) * gap;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * (dotDiameter + gap) + dotRadius;
      const cy = r * (dotDiameter + gap) + dotRadius;
      dots.push(<circle key={`${r}-${c}`} cx={cx} cy={cy} r={dotRadius} fill="currentColor" />);
    }
  }

  return (
    <svg className={className} width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      {dots}
    </svg>
  );
}

export function CornerBracket({ className = 'w-[34px] h-[18px] text-[#741cf3]' }) {
  return (
    <svg className={className} viewBox="0 0 34 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M2 16V2h30" />
    </svg>
  );
}

export function AsideBottomRightMotif({ className = 'w-24 h-12' }) {
  return (
    <svg className={className} viewBox="0 0 96 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 2 rows x 4 cols of purple dots in #6D48E5 */}
      <circle cx="27" cy="10" r="3" fill="#6D48E5" />
      <circle cx="43" cy="10" r="3" fill="#6D48E5" />
      <circle cx="59" cy="10" r="3" fill="#6D48E5" />
      <circle cx="75" cy="10" r="3" fill="#6D48E5" />

      <circle cx="27" cy="22" r="3" fill="#6D48E5" />
      <circle cx="43" cy="22" r="3" fill="#6D48E5" />
      <circle cx="59" cy="22" r="3" fill="#6D48E5" />
      <circle cx="75" cy="22" r="3" fill="#6D48E5" />

      {/* Yellow/Lime Wave in #B0CF03 from Figma */}
      <path
        d="M1 38c5.333-5.333 11.733-5.333 17.067 0 5.333 5.333 11.733 5.333 17.066 0 5.334-5.333 11.734-5.333 17.067 0 5.333 5.333 11.733 5.333 17.067 0 5.333-5.333 11.733-5.333 17.066 0 3.2 3.2 6.4 3.2 8.534 1.067"
        stroke="#B0CF03"
        strokeWidth="2.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BuildingLibraryIcon({ className = 'w-5 h-5 text-slate-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function AcademicBadgeIcon({ className = 'w-5 h-5 text-slate-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function GearIcon({ className = 'w-4 h-4 text-slate-400' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

export function Step2SingleWave({ className = 'w-7 h-3 text-[#741cf3]' }) {
  return (
    <svg className={className} viewBox="0 0 32 14" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
      <path d="M2 9c3.5-6 7-6 10.5 0s7 6 10.5 0 7-6 9-2" />
    </svg>
  );
}

export function Step2LeftWaves({ className = 'w-16 h-12', allPurple = false }) {
  return (
    <svg className={className} viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 3 parallel waves */}
      <path d="M2 10c7-6 15-6 22 0s15 6 22 0 15-6 20-2" stroke="#741cf3" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M2 24c7-6 15-6 22 0s15 6 22 0 15-6 20-2" stroke={allPurple ? '#741cf3' : '#06b6d4'} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M2 38c7-6 15-6 22 0s15 6 22 0 15-6 20-2" stroke="#741cf3" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export function Step2RightMotif({ className = 'w-20' }) {
  return (
    <div className={`flex flex-col items-center gap-3.5 ${className}`}>
      {/* 3 rows x 5 cols of purple dots */}
      <div className="grid grid-cols-5 gap-3.5 opacity-60">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#818cf8]" />
        ))}
      </div>
      {/* Triple wave: cyan, purple, cyan */}
      <svg className="w-16 h-10" viewBox="0 0 68 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 8c7-6 15-6 22 0s15 6 22 0 15-6 20-2" stroke="#06b6d4" strokeWidth="2.35" strokeLinecap="round" />
        <path d="M2 20c7-6 15-6 22 0s15 6 22 0 15-6 20-2" stroke="#818cf8" strokeWidth="2.35" strokeLinecap="round" />
        <path d="M2 32c7-6 15-6 22 0s15 6 22 0 15-6 20-2" stroke="#06b6d4" strokeWidth="2.35" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Step3DotsMatrix({ className = '' }) {
  return (
    <div className={`grid grid-cols-4 gap-3.5 opacity-60 ${className}`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#818cf8]" />
      ))}
    </div>
  );
}

export function Step3RightWaves({ className = 'w-16 h-10' }) {
  return (
    <svg className={className} viewBox="0 0 68 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 8c7-6 15-6 22 0s15 6 22 0 15-6 20-2" stroke="#818cf8" strokeWidth="2.35" strokeLinecap="round" />
      <path d="M2 20c7-6 15-6 22 0s15 6 22 0 15-6 20-2" stroke="#818cf8" strokeWidth="2.35" strokeLinecap="round" />
      <path d="M2 32c7-6 15-6 22 0s15 6 22 0 15-6 20-2" stroke="#818cf8" strokeWidth="2.35" strokeLinecap="round" />
    </svg>
  );
}

export function StepOfficialDocIcon({ className = 'w-6 h-6 text-[#8A64FF]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}

export function LinkIcon({ className = 'w-4 h-4 text-[#8795b8]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function BookOpenIcon({ className = 'w-5 h-5 text-white' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function ScaleIcon({ className = 'w-5 h-5 text-white' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

export function DocumentHubIcon({ className = 'w-5 h-5 text-white' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="M2 10h20" />
    </svg>
  );
}




