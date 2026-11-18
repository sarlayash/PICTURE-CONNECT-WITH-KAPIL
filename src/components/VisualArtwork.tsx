import React from 'react';
import {
  ArtworkId,
  BOARDROOM_CLUES,
  WORKPLACE_MISTAKES,
} from '../data/workshopData';

interface VisualArtworkProps {
  id: ArtworkId;
  className?: string;
  memoryHardMode?: boolean;
  discoveredMistakes?: string[];
  onSelectMistake?: (mistakeId: string) => void;
  discoveredClues?: string[];
  onSelectClue?: (clueId: string) => void;
}

export const VisualArtwork: React.FC<VisualArtworkProps> = ({
  id,
  className = 'w-full h-full',
  memoryHardMode = false,
  discoveredMistakes = [],
  onSelectMistake,
  discoveredClues = [],
  onSelectClue,
}) => {
  if (id === 'workplace_detective') {
    return (
      <div className={`relative select-none overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 ${className}`}>
        <svg viewBox="0 0 900 520" className="w-full h-full block" role="img" aria-label="Complicated workplace scene with 10 deliberate mistakes">
          <defs>
            <linearGradient id="officeWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="officeFloor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          {/* Wall & Floor */}
          <rect x="0" y="0" width="900" height="330" fill="url(#officeWall)" />
          <rect x="0" y="330" width="900" height="190" fill="url(#officeFloor)" />
          <line x1="0" y1="330" x2="900" y2="330" stroke="#94A3B8" strokeWidth="2" />

          {/* Whiteboard (#5 Communication Failure) */}
          <rect x="335" y="45" width="230" height="125" rx="6" fill="#FFFFFF" stroke="#475569" strokeWidth="4" />
          <text x="352" y="74" fontSize="14" fontWeight="700" fill="#1E293B" fontFamily="sans-serif">PROJECT LAUNCH</text>
          <line x1="350" y1="88" x2="455" y2="88" stroke="#DC2626" strokeWidth="2.5" />
          <text x="352" y="92" fontSize="13" fill="#475569" fontFamily="sans-serif">Due: Tuesday 9 AM</text>
          <text x="352" y="116" fontSize="13" fontWeight="700" fill="#DC2626" fontFamily="sans-serif">OR FRIDAY? (Who owns?!)</text>
          <text x="352" y="142" fontSize="12" fill="#64748B" fontFamily="sans-serif">No sign-off · Conflicting specs</text>

          {/* Wall Clock (#7 Time Management) */}
          <circle cx="635" cy="95" r="38" fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" />
          <line x1="635" y1="95" x2="635" y2="68" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="635" y1="95" x2="656" y2="108" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="598" y="142" width="76" height="22" rx="3" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1.5" />
          <text x="636" y="157" textAnchor="middle" fontSize="10" fontWeight="700" fill="#B91C1C">3 OVERDUE</text>

          {/* Blocked Fire Exit (#2 Safety Violation) */}
          <rect x="745" y="75" width="115" height="255" fill="#E2E8F0" stroke="#475569" strokeWidth="4" />
          <rect x="768" y="42" width="70" height="22" rx="3" fill="#15803D" />
          <text x="803" y="57" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">FIRE EXIT</text>
          {/* Boxes stacked blocking exit */}
          <rect x="740" y="245" width="70" height="85" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <rect x="785" y="185" width="65" height="62" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
          <rect x="752" y="140" width="54" height="48" fill="#B45309" stroke="#78350F" strokeWidth="2" />

          {/* Left Desk + Overflowing Trash (#10 Etiquette) */}
          <rect x="45" y="235" width="290" height="18" rx="3" fill="#334155" />
          <rect x="60" y="253" width="14" height="110" fill="#475569" />
          <rect x="305" y="253" width="14" height="110" fill="#475569" />
          {/* Overflowing bin & lunch box */}
          <path d="M55 280 L98 280 L92 352 L61 352 Z" fill="#64748B" />
          <circle cx="72" cy="272" r="10" fill="#FDE68A" />
          <circle cx="88" cy="268" r="9" fill="#FCA5A5" />
          <rect x="108" y="212" width="44" height="23" rx="3" fill="#F59E0B" stroke="#92400E" strokeWidth="1.5" />

          {/* Monitor 1 with Password Sticky Note (#3 Security) & Headphone person (#6 Communication) */}
          <rect x="245" y="155" width="95" height="68" rx="5" fill="#0F172A" stroke="#334155" strokeWidth="3" />
          <rect x="284" y="223" width="16" height="12" fill="#475569" />
          {/* Sticky note on monitor */}
          <rect x="310" y="168" width="42" height="36" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" transform="rotate(6 331 186)" />
          <text x="331" y="186" textAnchor="middle" fontSize="8" fontWeight="700" fill="#713F12">PW:1234</text>

          {/* Person with headphones ignoring ringing phone (#6) */}
          <circle cx="205" cy="182" r="22" fill="#FDBA74" />
          <path d="M180 180 C180 155, 230 155, 230 180" fill="none" stroke="#1E293B" strokeWidth="6" />
          <rect x="174" y="174" width="10" height="18" rx="4" fill="#1D4ED8" />
          <rect x="226" y="174" width="10" height="18" rx="4" fill="#1D4ED8" />
          <path d="M175 235 Q205 204 235 235" fill="#1D4ED8" />
          {/* Ringing phone ignored */}
          <rect x="155" y="214" width="22" height="14" rx="2" fill="#DC2626" />
          <text x="166" y="206" textAnchor="middle" fontSize="10" fontWeight="700" fill="#DC2626">RING!</text>

          {/* Spilled Coffee on Live Power Strip (#1 Safety) */}
          <rect x="112" y="388" width="120" height="22" rx="4" fill="#1E293B" />
          <circle cx="135" cy="399" r="4" fill="#EF4444" />
          <circle cx="158" cy="399" r="4" fill="#EF4444" />
          <circle cx="181" cy="399" r="4" fill="#EF4444" />
          <path d="M90 398 Q125 375 162 400 Q140 425 96 414 Z" fill="#78350F" opacity="0.72" />
          <path d="M74 374 L92 374 L89 398 L77 398 Z" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />

          {/* Center Conference Table + Feet on Table (#9 Etiquette) + Social Media Laptop (#8 Time) */}
          <rect x="370" y="310" width="245" height="20" rx="4" fill="#475569" />
          <rect x="395" y="330" width="14" height="90" fill="#334155" />
          <rect x="575" y="330" width="14" height="90" fill="#334155" />
          {/* Shoes propped on table */}
          <ellipse cx="410" cy="302" rx="18" ry="9" fill="#1E293B" />
          <ellipse cx="436" cy="302" rx="18" ry="9" fill="#1E293B" />
          {/* Social Media Screen */}
          <rect x="485" y="255" width="84" height="54" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <rect x="492" y="262" width="70" height="38" fill="#EFF6FF" />
          <text x="527" y="285" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2563EB">14 REELS</text>

          {/* Open File Cabinet + Unknown USB (#4 Security) */}
          <rect x="630" y="265" width="85" height="135" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
          <rect x="615" y="285" width="82" height="34" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
          <rect x="626" y="276" width="52" height="14" fill="#FCA5A5" />
          <text x="652" y="286" textAnchor="middle" fontSize="8" fontWeight="700" fill="#7F1D1D">HR PRIVATE</text>
          <rect x="665" y="340" width="32" height="12" rx="2" fill="#DC2626" />
          <text x="681" y="365" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7F1D1D">UNKNOWN USB</text>
        </svg>

        {/* Interactive Clickable Hotspots */}
        {WORKPLACE_MISTAKES.map((mistake) => {
          const found = discoveredMistakes.includes(mistake.id);
          return (
            <button
              key={mistake.id}
              type="button"
              onClick={() => onSelectMistake?.(mistake.id)}
              title={`Inspect spot ${mistake.number}`}
              style={{ left: `${mistake.xPercent}%`, top: `${mistake.yPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full font-mono text-xs font-semibold flex items-center justify-center transition-transform duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer ${
                found
                  ? 'bg-emerald-600 text-white shadow-md scale-110 ring-2 ring-white'
                  : 'bg-white/95 text-slate-900 border-2 border-amber-500 shadow hover:scale-110'
              }`}
            >
              {found ? '✓' : mistake.number}
            </button>
          );
        })}
      </div>
    );
  }

  if (id === 'boardroom_decline') {
    return (
      <div className={`relative select-none overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 ${className}`}>
        <svg viewBox="0 0 900 500" className="w-full h-full block" role="img" aria-label="Corporate boardroom showing 40 percent sales decline across five visual clues">
          <rect x="0" y="0" width="900" height="500" fill="#F8FAFC" />
          <rect x="0" y="340" width="900" height="160" fill="#E2E8F0" />

          {/* Main Central Sales Decline Board */}
          <rect x="245" y="45" width="410" height="230" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
          <text x="275" y="82" fontSize="16" fontWeight="700" fill="#0F172A">QUARTERLY REVENUE DIAGNOSTIC</text>
          <text x="275" y="104" fontSize="12" fill="#DC2626" fontWeight="700">-40% SUDDEN SALES DECLINE</text>
          {/* Grid lines */}
          <line x1="275" y1="230" x2="625" y2="230" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="275" y1="180" x2="625" y2="180" stroke="#F1F5F9" strokeWidth="1.5" />
          <line x1="275" y1="130" x2="625" y2="130" stroke="#F1F5F9" strokeWidth="1.5" />
          {/* Declining Company Curve */}
          <path d="M285 135 L365 142 L440 165 L520 205 L605 224" fill="none" stroke="#DC2626" strokeWidth="4.5" strokeLinecap="round" />
          {/* Rising Rival Curve */}
          <path d="M285 215 L365 198 L440 170 L520 140 L605 112" fill="none" stroke="#1D4ED8" strokeWidth="3.5" strokeDasharray="7 5" strokeLinecap="round" />

          {/* Zone 1: Customers (Top Left) */}
          <rect x="45" y="75" width="165" height="150" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <text x="128" y="102" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">CUSTOMERS</text>
          <rect x="75" y="120" width="105" height="58" rx="6" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
          <text x="128" y="146" textAnchor="middle" fontSize="18" fontWeight="700" fill="#DC2626">38% CSAT</text>
          <text x="128" y="166" textAnchor="middle" fontSize="10" fill="#991B1B">240 Open Tickets</text>

          {/* Zone 2: Employees (Bottom Left) */}
          <circle cx="290" cy="360" r="22" fill="#94A3B8" />
          <path d="M262 415 Q290 385 318 415" fill="#475569" />
          <circle cx="355" cy="360" r="22" fill="#CBD5E1" />
          <path d="M327 415 Q355 385 383 415" fill="#64748B" />
          <line x1="316" y1="358" x2="328" y2="358" stroke="#DC2626" strokeWidth="3" />
          <text x="322" y="445" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">SILOED TEAM</text>

          {/* Zone 3: Product Quality (Center Table Cracked Gear & Returns) */}
          <rect x="415" y="315" width="145" height="90" rx="6" fill="#D97706" opacity="0.2" stroke="#D97706" strokeWidth="2" />
          <circle cx="485" cy="355" r="26" fill="#FFFFFF" stroke="#B45309" strokeWidth="3" />
          <path d="M475 335 L490 356 L478 372" fill="none" stroke="#DC2626" strokeWidth="3" />
          <text x="488" y="424" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400E">RETURNED BATCH</text>

          {/* Zone 4: Marketing (Top Right) */}
          <rect x="685" y="65" width="175" height="145" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <text x="772" y="92" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">MARKETING</text>
          <rect x="710" y="108" width="125" height="72" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeDasharray="4 4" />
          <text x="772" y="142" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748B">STALE CAMPAIGN</text>
          <text x="772" y="160" textAnchor="middle" fontSize="10" fill="#94A3B8">0% Digital Reach</text>

          {/* Zone 5: Competition (Bottom Right) */}
          <rect x="680" y="265" width="180" height="150" rx="8" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="2" />
          <text x="770" y="294" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1E3A8A">COMPETITION</text>
          <path d="M770 315 L796 365 L744 365 Z" fill="#1D4ED8" />
          <text x="770" y="392" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E40AF">FAST RIVAL LAUNCH</text>
        </svg>

        {BOARDROOM_CLUES.map((clue) => {
          const inspected = discoveredClues.includes(clue.id);
          return (
            <button
              key={clue.id}
              type="button"
              onClick={() => onSelectClue?.(clue.id)}
              style={{ left: `${clue.xPercent}%`, top: `${clue.yPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap ${
                inspected
                  ? 'bg-blue-700 text-white ring-2 ring-white'
                  : 'bg-white text-slate-900 border border-slate-300 hover:border-blue-600'
              }`}
            >
              {clue.dimension}
            </button>
          );
        })}
      </div>
    );
  }

  if (id === 'memory_scene') {
    return (
      <svg viewBox="0 0 800 440" className={`w-full h-full block rounded-xl border border-slate-200 dark:border-slate-800 ${className}`} role="img" aria-label="Study desk memory observation scene">
        {/* Desk Surface */}
        <rect x="0" y="0" width="800" height="440" fill="#F8FAFC" />
        <rect x="0" y="260" width="800" height="180" fill="#E2E8F0" />
        <line x1="0" y1="260" x2="800" y2="260" stroke="#94A3B8" strokeWidth="2" />

        {/* 1. Wall Clock at 10:10 */}
        <circle cx="130" cy="115" r="56" fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" />
        <line x1="130" y1="115" x2="105" y2="96" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        <line x1="130" y1="115" x2="155" y2="92" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="130" cy="115" r="4" fill="#DC2626" />

        {/* 2. Coffee Mug with Spoon */}
        <rect x="95" y="285" width="58" height="62" rx="8" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
        <path d="M153 300 C172 300, 172 332, 153 332" fill="none" stroke="#334155" strokeWidth="4" />
        <line x1="132" y1="262" x2="118" y2="295" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />

        {/* 3. Open Spiral Notebook */}
        <rect x="235" y="275" width="180" height="115" rx="4" fill="#FFFFFF" stroke="#475569" strokeWidth="2.5" />
        <line x1="325" y1="275" x2="325" y2="390" stroke="#CBD5E1" strokeWidth="2" />
        <line x1="252" y1="305" x2="308" y2="305" stroke="#94A3B8" strokeWidth="2" />
        <line x1="252" y1="325" x2="308" y2="325" stroke="#94A3B8" strokeWidth="2" />
        <line x1="342" y1="305" x2="396" y2="305" stroke="#94A3B8" strokeWidth="2" />

        {/* 4. Broken Pencil */}
        <g transform="translate(275, 405) rotate(-6)">
          <rect x="0" y="0" width="75" height="10" fill="#F59E0B" />
          <polygon points="75,0 90,5 75,10" fill="#FDE68A" />
        </g>
        <g transform="translate(382, 400) rotate(12)">
          <rect x="0" y="0" width="44" height="10" fill="#F59E0B" />
          <rect x="44" y="0" width="12" height="10" fill="#FB7185" />
        </g>

        {/* 5. Red Sticky Note */}
        <rect x="255" y="95" width="90" height="82" fill="#FECACA" stroke="#EF4444" strokeWidth="2" />
        <text x="300" y="132" textAnchor="middle" fontSize="12" fontWeight="700" fill="#991B1B">CALL CLIENT</text>
        <text x="300" y="150" textAnchor="middle" fontSize="10" fill="#B91C1C">URGENT</text>

        {/* 6. Reading Glasses */}
        <circle cx="485" cy="315" r="18" fill="none" stroke="#1E293B" strokeWidth="3" />
        <circle cx="533" cy="315" r="18" fill="none" stroke="#1E293B" strokeWidth="3" />
        <line x1="503" y1="315" x2="515" y2="315" stroke="#1E293B" strokeWidth="3" />

        {/* 7. Desk Compass */}
        <circle cx="485" cy="378" r="24" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="3" />
        <polygon points="485,359 491,378 485,397 479,378" fill="#DC2626" />

        {/* 8. Closed Laptop (No Charger Cable!) */}
        <rect x="575" y="280" width="155" height="92" rx="8" fill="#334155" stroke="#0F172A" strokeWidth="3" />
        <circle cx="652" cy="326" r="10" fill="#64748B" />
        <rect x="730" y="346" width="14" height="8" fill="#DC2626" />

        {/* Hard Mode Extra Objects */}
        {memoryHardMode && (
          <g>
            {/* 9. ID Lanyard */}
            <rect x="405" y="75" width="38" height="58" rx="4" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="2" />
            <path d="M412 75 L424 35 L436 75" fill="none" stroke="#1D4ED8" strokeWidth="3" />

            {/* 10. Potted Succulent */}
            <rect x="655" y="195" width="54" height="44" rx="4" fill="#B45309" />
            <ellipse cx="682" cy="182" rx="26" ry="18" fill="#059669" />

            {/* 11. Brass Key */}
            <circle cx="205" cy="335" r="11" fill="none" stroke="#D97706" strokeWidth="4" />
            <line x1="216" y1="335" x2="236" y2="335" stroke="#D97706" strokeWidth="4" />

            {/* 12. Lonely Bottle Cap (Bottle Missing!) */}
            <rect x="540" y="395" width="24" height="10" rx="2" fill="#0284C7" />

            {/* 13. Boarding Pass */}
            <rect x="505" y="90" width="115" height="52" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
            <text x="562" y="114" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400E">FLIGHT 402</text>
            <text x="562" y="130" textAnchor="middle" fontSize="9" fill="#B45309">JDH → DEL</text>
          </g>
        )}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 420 280" className={`w-full h-full block rounded-xl ${className}`} role="img" aria-label={id.replace(/_/g, ' ')}>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>
      <rect width="420" height="280" rx="14" fill={`url(#bg-${id})`} />
      {renderPictureScene(id)}
    </svg>
  );
};

function renderPictureScene(id: ArtworkId) {
  switch (id) {
    case 'bridge':
      return (
        <g>
          <rect x="0" y="200" width="420" height="80" fill="#DBEAFE" />
          <path d="M0 220 Q105 205 210 220 Q315 235 420 220" fill="none" stroke="#60A5FA" strokeWidth="3" />
          <rect x="20" y="155" width="380" height="16" rx="4" fill="#1E293B" />
          <path d="M55 155 Q210 55 365 155" fill="none" stroke="#1D4ED8" strokeWidth="6" />
          <rect x="115" y="88" width="14" height="112" fill="#334155" />
          <rect x="291" y="88" width="14" height="112" fill="#334155" />
          <line x1="155" y1="106" x2="155" y2="155" stroke="#1D4ED8" strokeWidth="2.5" />
          <line x1="210" y1="102" x2="210" y2="155" stroke="#1D4ED8" strokeWidth="2.5" />
          <line x1="265" y1="106" x2="265" y2="155" stroke="#1D4ED8" strokeWidth="2.5" />
        </g>
      );
    case 'broken_pencil':
      return (
        <g>
          <g transform="translate(75, 138) rotate(-14)">
            <rect x="0" y="0" width="125" height="22" rx="2" fill="#F59E0B" />
            <polygon points="125,0 156,11 125,22" fill="#FDE68A" />
            <polygon points="145,7 156,11 145,15" fill="#1E293B" />
          </g>
          <g transform="translate(228, 122) rotate(18)">
            <rect x="0" y="0" width="105" height="22" rx="2" fill="#F59E0B" />
            <rect x="105" y="0" width="22" height="22" rx="3" fill="#F43F5E" />
            <rect x="97" y="0" width="8" height="22" fill="#94A3B8" />
          </g>
          <path d="M204 128 L216 146 L202 158" fill="none" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'traffic_signal':
      return (
        <g>
          <rect x="198" y="196" width="24" height="84" fill="#475569" />
          <rect x="165" y="34" width="90" height="172" rx="16" fill="#0F172A" />
          <circle cx="210" cy="70" r="20" fill="#EF4444" />
          <circle cx="210" cy="120" r="20" fill="#F59E0B" />
          <circle cx="210" cy="170" r="20" fill="#10B981" />
        </g>
      );
    case 'mirror':
      return (
        <g>
          <ellipse cx="210" cy="140" rx="76" ry="98" fill="#1E293B" />
          <ellipse cx="210" cy="140" rx="64" ry="86" fill="#DBEAFE" />
          <line x1="175" y1="88" x2="225" y2="140" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
          <line x1="185" y1="125" x2="215" y2="155" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
          <circle cx="210" cy="122" r="20" fill="#1D4ED8" opacity="0.28" />
          <path d="M174 195 Q210 152 246 195" fill="#1D4ED8" opacity="0.28" />
        </g>
      );
    case 'ladder':
      return (
        <g>
          <rect x="270" y="35" width="120" height="245" fill="#CBD5E1" />
          <line x1="150" y1="260" x2="245" y2="45" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />
          <line x1="205" y1="260" x2="300" y2="45" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />
          {[0, 1, 2, 3, 4].map((step) => {
            const y = 230 - step * 40;
            const xOffset = step * 17.5;
            return (
              <line
                key={step}
                x1={162 + xOffset}
                y1={y}
                x2={218 + xOffset}
                y2={y}
                stroke="#D97706"
                strokeWidth="7"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      );
    case 'tree':
      return (
        <g>
          <rect x="0" y="218" width="420" height="62" fill="#CBD5E1" />
          <path d="M196 220 L196 135 L224 135 L224 220 Z" fill="#78350F" />
          <path d="M196 220 Q160 245 125 256 M210 220 Q210 250 212 264 M224 220 Q260 245 295 256" fill="none" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
          <circle cx="210" cy="96" r="54" fill="#059669" />
          <circle cx="164" cy="122" r="40" fill="#10B981" />
          <circle cx="256" cy="122" r="40" fill="#047857" />
        </g>
      );
    case 'crossroads':
      return (
        <g>
          <rect width="420" height="145" fill="#DBEAFE" />
          <rect y="145" width="420" height="135" fill="#CBD5E1" />
          {/* Forking paths */}
          <path d="M210 280 L210 185 L70 145" fill="none" stroke="#334155" strokeWidth="36" strokeLinejoin="round" />
          <path d="M210 185 L350 145" fill="none" stroke="#475569" strokeWidth="32" strokeLinejoin="round" />
          {/* Signpost */}
          <rect x="206" y="74" width="8" height="90" fill="#1E293B" />
          <polygon points="150,82 212,82 212,102 150,102 138,92" fill="#1D4ED8" />
          <polygon points="208,108 272,108 284,118 272,128 208,128" fill="#D97706" />
          {/* Person standing */}
          <circle cx="210" cy="190" r="12" fill="#0F172A" />
          <rect x="200" y="204" width="20" height="36" rx="6" fill="#1D4ED8" />
        </g>
      );
    case 'apple':
      return (
        <g>
          <path d="M210 72 Q226 42 254 48 Q236 74 210 72 Z" fill="#10B981" />
          <path d="M210 76 L210 52" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
          <path d="M210 85 C155 72, 130 135, 148 185 C164 226, 198 228, 210 218 C222 228, 256 226, 272 185 C290 135, 265 72, 210 85 Z" fill="#DC2626" />
          <path d="M168 118 Q160 146 168 170" fill="none" stroke="#FCA5A5" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case 'rocket':
      return (
        <g>
          <rect width="420" height="280" rx="14" fill="#0F172A" />
          <circle cx="80" cy="60" r="3" fill="#F8FAFC" />
          <circle cx="340" cy="85" r="2.5" fill="#F8FAFC" />
          <circle cx="310" cy="210" r="3" fill="#F8FAFC" />
          <path d="M210 42 C245 88, 248 158, 232 195 L188 195 C172 158, 175 88, 210 42 Z" fill="#F8FAFC" />
          <circle cx="210" cy="116" r="18" fill="#1D4ED8" />
          <polygon points="188,165 156,204 188,195" fill="#DC2626" />
          <polygon points="232,165 264,204 232,195" fill="#DC2626" />
          <polygon points="196,195 210,242 224,195" fill="#F59E0B" />
        </g>
      );
    case 'hourglass':
      return (
        <g>
          <rect x="145" y="42" width="130" height="14" rx="4" fill="#1E293B" />
          <rect x="145" y="224" width="130" height="14" rx="4" fill="#1E293B" />
          <path d="M162 56 L258 56 L218 140 L258 224 L162 224 L202 140 Z" fill="#FFFFFF" stroke="#334155" strokeWidth="4" />
          <polygon points="180,220 240,220 210,175" fill="#D97706" />
          <polygon points="185,84 235,84 210,124" fill="#F59E0B" />
          <line x1="210" y1="138" x2="210" y2="180" stroke="#D97706" strokeWidth="3" />
        </g>
      );
    case 'exam':
      return (
        <g>
          <rect x="115" y="34" width="190" height="212" rx="8" fill="#FFFFFF" stroke="#475569" strokeWidth="3" />
          <text x="142" y="72" fontSize="18" fontWeight="700" fill="#1E293B">EXAMINATION</text>
          <line x1="142" y1="96" x2="278" y2="96" stroke="#CBD5E1" strokeWidth="4" />
          <line x1="142" y1="122" x2="278" y2="122" stroke="#CBD5E1" strokeWidth="4" />
          <line x1="142" y1="148" x2="238" y2="148" stroke="#CBD5E1" strokeWidth="4" />
          <circle cx="255" cy="195" r="24" fill="none" stroke="#DC2626" strokeWidth="4" />
          <text x="255" y="201" textAnchor="middle" fontSize="15" fontWeight="700" fill="#DC2626">A+</text>
        </g>
      );
    case 'interview':
      return (
        <g>
          <rect x="65" y="180" width="290" height="18" rx="4" fill="#334155" />
          <circle cx="145" cy="115" r="26" fill="#1D4ED8" />
          <path d="M105 180 Q145 142 185 180" fill="#1D4ED8" />
          <circle cx="275" cy="115" r="26" fill="#0F172A" />
          <path d="M235 180 Q275 142 315 180" fill="#0F172A" />
          <rect x="188" y="156" width="44" height="24" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
        </g>
      );
    case 'umbrella':
      return (
        <g>
          <path d="M95 148 C95 70, 325 70, 325 148 Z" fill="#1D4ED8" />
          <path d="M155 148 C155 75, 265 75, 265 148 Z" fill="#3B82F6" />
          <line x1="210" y1="74" x2="210" y2="215" stroke="#1E293B" strokeWidth="6" />
          <path d="M210 215 C210 242, 242 242, 242 218" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case 'camera':
      return (
        <g>
          <rect x="88" y="84" width="244" height="145" rx="18" fill="#1E293B" />
          <rect x="165" y="60" width="90" height="28" rx="6" fill="#334155" />
          <circle cx="210" cy="156" r="48" fill="#0F172A" stroke="#94A3B8" strokeWidth="6" />
          <circle cx="210" cy="156" r="28" fill="#1D4ED8" />
          <circle cx="222" cy="144" r="8" fill="#DBEAFE" />
          <circle cx="295" cy="108" r="8" fill="#EF4444" />
        </g>
      );
    case 'business':
      return (
        <g>
          <rect x="75" y="45" width="270" height="190" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
          <rect x="112" y="155" width="34" height="52" rx="4" fill="#94A3B8" />
          <rect x="166" y="128" width="34" height="79" rx="4" fill="#60A5FA" />
          <rect x="220" y="96" width="34" height="111" rx="4" fill="#1D4ED8" />
          <rect x="274" y="70" width="34" height="137" rx="4" fill="#059669" />
          <path d="M128 135 L183 110 L237 82 L291 58" fill="none" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case 'puzzle':
      return (
        <g>
          <rect x="120" y="65" width="88" height="88" rx="8" fill="#1D4ED8" />
          <circle cx="208" cy="109" r="18" fill="#1D4ED8" />
          <rect x="212" y="116" width="88" height="88" rx="8" fill="#D97706" />
          <circle cx="212" cy="160" r="18" fill="#F8FAFC" />
        </g>
      );
    case 'teamwork':
      return (
        <g>
          <circle cx="135" cy="115" r="24" fill="#1D4ED8" />
          <circle cx="210" cy="95" r="28" fill="#0F172A" />
          <circle cx="285" cy="115" r="24" fill="#059669" />
          <path d="M98 195 Q135 150 172 195" fill="#1D4ED8" />
          <path d="M162 200 Q210 135 258 200" fill="#0F172A" />
          <path d="M248 195 Q285 150 322 195" fill="#059669" />
        </g>
      );
    case 'stethoscope':
      return (
        <g>
          <path d="M145 55 L145 115 C145 162, 245 162, 245 115 L245 55" fill="none" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />
          <path d="M195 150 L195 205 C195 235, 275 235, 275 190" fill="none" stroke="#1D4ED8" strokeWidth="8" strokeLinecap="round" />
          <circle cx="275" cy="175" r="24" fill="#94A3B8" stroke="#1E293B" strokeWidth="5" />
          <circle cx="275" cy="175" r="10" fill="#FFFFFF" />
        </g>
      );
    case 'compass':
      return (
        <g>
          <circle cx="210" cy="145" r="82" fill="#FFFFFF" stroke="#1E293B" strokeWidth="8" />
          <circle cx="210" cy="145" r="68" fill="#EFF6FF" />
          <polygon points="210,85 228,145 210,145" fill="#DC2626" />
          <polygon points="210,85 192,145 210,145" fill="#EF4444" />
          <polygon points="210,205 228,145 210,145" fill="#1E293B" />
          <polygon points="210,205 192,145 210,145" fill="#475569" />
          <circle cx="210" cy="145" r="7" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
        </g>
      );
    case 'calculator':
      return (
        <g>
          <rect x="135" y="34" width="150" height="212" rx="14" fill="#1E293B" />
          <rect x="155" y="54" width="110" height="44" rx="6" fill="#DBEAFE" />
          <text x="255" y="84" textAnchor="end" fontSize="22" fontWeight="700" fill="#0F172A" fontFamily="monospace">1,040</text>
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={155 + col * 38}
                y={114 + row * 38}
                width="30"
                height="28"
                rx="5"
                fill={col === 2 && row === 2 ? '#D97706' : '#475569'}
              />
            ))
          )}
        </g>
      );
    case 'keyboard':
      return (
        <g>
          <rect x="55" y="85" width="310" height="118" rx="12" fill="#1E293B" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={74 + col * 35}
                y={104 + row * 28}
                width="26"
                height="20"
                rx="3"
                fill="#E2E8F0"
              />
            ))
          )}
          <rect x="125" y="186" width="170" height="10" rx="3" fill="#60A5FA" />
        </g>
      );
    case 'paperclip':
      return (
        <g>
          <path
            d="M150 185 L265 70 C285 50, 315 80, 295 100 L170 225 C140 255, 95 210, 125 180 L235 70"
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    case 'emotion_scene':
      return (
        <g>
          <rect width="420" height="280" rx="14" fill="#E2E8F0" />
          <rect x="40" y="34" width="120" height="165" rx="6" fill="#DBEAFE" stroke="#64748B" strokeWidth="4" />
          <line x1="100" y1="34" x2="100" y2="199" stroke="#64748B" strokeWidth="3" />
          <line x1="40" y1="115" x2="160" y2="115" stroke="#64748B" strokeWidth="3" />
          {/* Seated person looking thoughtfully */}
          <rect x="195" y="190" width="160" height="16" rx="4" fill="#334155" />
          <circle cx="275" cy="110" r="28" fill="#FDBA74" />
          <path d="M235 190 Q275 135 315 190" fill="#1E293B" />
          <path d="M265 120 Q275 124 284 118" fill="none" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />
          <rect x="208" y="168" width="44" height="22" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
        </g>
      );
    case 'challenge_stop':
      return (
        <g>
          <rect x="204" y="158" width="12" height="110" fill="#475569" />
          <polygon
            points="178,46 242,46 286,90 286,154 242,198 178,198 134,154 134,90"
            fill="#DC2626"
            stroke="#FFFFFF"
            strokeWidth="6"
          />
          <text x="210" y="132" textAnchor="middle" fontSize="34" fontWeight="700" fill="#FFFFFF">STOP</text>
        </g>
      );
    case 'challenge_growth':
      return (
        <g>
          <rect x="40" y="196" width="340" height="58" rx="6" fill="#64748B" />
          <path d="M210 196 L195 215 L220 230" fill="none" stroke="#1E293B" strokeWidth="4" />
          <path d="M210 205 Q210 135 210 90" fill="none" stroke="#059669" strokeWidth="8" strokeLinecap="round" />
          <path d="M210 138 Q162 118 158 84 Q198 86 210 138 Z" fill="#10B981" />
          <path d="M210 112 Q258 92 262 58 Q222 60 210 112 Z" fill="#059669" />
        </g>
      );
    case 'challenge_iceberg':
      return (
        <g>
          <rect width="420" height="120" rx="14" fill="#DBEAFE" />
          <rect y="120" width="420" height="160" fill="#1E3A8A" />
          <line x1="0" y1="120" x2="420" y2="120" stroke="#93C5FD" strokeWidth="4" />
          <polygon points="210,42 258,120 162,120" fill="#FFFFFF" />
          <polygon points="162,120 258,120 296,210 215,256 128,200" fill="#60A5FA" opacity="0.72" />
          <text x="340" y="90" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1E3A8A">10% VISIBLE</text>
          <text x="340" y="185" textAnchor="middle" fontSize="13" fontWeight="700" fill="#DBEAFE">90% UNSEEN</text>
        </g>
      );
    case 'challenge_ripple':
      return (
        <g>
          <rect width="420" height="280" rx="14" fill="#EFF6FF" />
          <ellipse cx="210" cy="165" rx="145" ry="58" fill="none" stroke="#93C5FD" strokeWidth="4" />
          <ellipse cx="210" cy="165" rx="100" ry="38" fill="none" stroke="#3B82F6" strokeWidth="4" />
          <ellipse cx="210" cy="165" rx="52" ry="20" fill="none" stroke="#1D4ED8" strokeWidth="4" />
          <path d="M210 56 C225 88, 228 110, 210 118 C192 110, 195 88, 210 56 Z" fill="#1D4ED8" />
        </g>
      );
    case 'challenge_choices':
      return (
        <g>
          <rect x="65" y="65" width="84" height="165" rx="6" fill="#475569" />
          <rect x="168" y="55" width="84" height="175" rx="6" fill="#1D4ED8" />
          <rect x="271" y="65" width="84" height="165" rx="6" fill="#D97706" />
          <circle cx="135" cy="150" r="5" fill="#F8FAFC" />
          <circle cx="238" cy="145" r="5" fill="#F8FAFC" />
          <circle cx="341" cy="150" r="5" fill="#F8FAFC" />
        </g>
      );
    case 'challenge_missing_piece':
      return (
        <g>
          <rect x="115" y="55" width="90" height="84" rx="8" fill="#1E293B" />
          <rect x="215" y="55" width="90" height="84" rx="8" fill="#334155" />
          <rect x="115" y="148" width="90" height="84" rx="8" fill="#475569" />
          <rect x="225" y="156" width="82" height="74" rx="8" fill="none" stroke="#D97706" strokeWidth="4" strokeDasharray="8 6" />
          <text x="266" y="202" textAnchor="middle" fontSize="28" fontWeight="700" fill="#D97706">?</text>
        </g>
      );
    case 'notebook':
      return (
        <g>
          <rect x="115" y="42" width="190" height="196" rx="10" fill="#1D4ED8" />
          <rect x="135" y="42" width="170" height="196" rx="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
          <line x1="162" y1="88" x2="275" y2="88" stroke="#CBD5E1" strokeWidth="4" />
          <line x1="162" y1="120" x2="275" y2="120" stroke="#CBD5E1" strokeWidth="4" />
          <line x1="162" y1="152" x2="245" y2="152" stroke="#CBD5E1" strokeWidth="4" />
        </g>
      );
    case 'mountain_peak':
      return (
        <g>
          <rect width="420" height="280" rx="14" fill="#DBEAFE" />
          <polygon points="65,240 210,55 355,240" fill="#334155" />
          <polygon points="164,114 210,55 256,114 232,124 210,106 188,124" fill="#FFFFFF" />
          <line x1="210" y1="55" x2="210" y2="28" stroke="#DC2626" strokeWidth="4" />
          <polygon points="210,28 242,38 210,48" fill="#DC2626" />
        </g>
      );
    case 'lighthouse':
    default:
      return (
        <g>
          <rect width="420" height="280" rx="14" fill="#0F172A" />
          <polygon points="180,238 195,90 225,90 240,238" fill="#F8FAFC" />
          <rect x="192" y="135" width="36" height="28" fill="#DC2626" />
          <rect x="192" y="64" width="36" height="26" fill="#F59E0B" />
          <polygon points="228,74 395,35 395,112" fill="#FEF08A" opacity="0.45" />
        </g>
      );
  }
}
