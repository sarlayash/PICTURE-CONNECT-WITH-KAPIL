import { MasterPillarId, MasterTrackId } from './masterUniverseTypes';
import { CareerCategoryId } from './careerSkillsData';

export interface ColorThemeSpec {
  name: string;
  topBar: string; // thin top gradient accent line
  text: string;
  textDarkLanding: string;
  softSurface: string;
  softBorder: string;
  activeButton: string;
  activeTab: string;
  progressBar: string;
  ringHover: string;
  landingCardHover: string;
  landingCardSelected: string;
  iconBg: string;
}

export const COLOR_THEMES: Record<
  | 'blue'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'cyan'
  | 'indigo'
  | 'teal'
  | 'fuchsia'
  | 'orange'
  | 'sky',
  ColorThemeSpec
> = {
  blue: {
    name: 'Sapphire',
    topBar: 'from-blue-600 via-sky-500 to-indigo-500',
    text: 'text-blue-700 dark:text-blue-400',
    textDarkLanding: 'text-sky-400',
    softSurface: 'bg-blue-50/70 dark:bg-blue-950/30',
    softBorder: 'border-blue-200 dark:border-blue-800/80',
    activeButton: 'bg-blue-700 hover:bg-blue-800 text-white border-blue-700',
    activeTab: 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300',
    progressBar: 'bg-gradient-to-r from-blue-600 to-sky-500',
    ringHover: 'hover:border-blue-500 dark:hover:border-blue-400',
    landingCardHover: 'hover:border-sky-400/70 hover:bg-[#0E2046]',
    landingCardSelected: 'border-sky-400 bg-[#0F234D] ring-1 ring-sky-400/35',
    iconBg: 'bg-blue-600/15 text-blue-700 dark:text-blue-300',
  },
  violet: {
    name: 'Royal Violet',
    topBar: 'from-violet-600 via-purple-500 to-indigo-500',
    text: 'text-violet-700 dark:text-violet-400',
    textDarkLanding: 'text-violet-400',
    softSurface: 'bg-violet-50/70 dark:bg-violet-950/30',
    softBorder: 'border-violet-200 dark:border-violet-800/80',
    activeButton: 'bg-violet-700 hover:bg-violet-800 text-white border-violet-700',
    activeTab: 'border-violet-600 text-violet-700 dark:border-violet-400 dark:text-violet-300',
    progressBar: 'bg-gradient-to-r from-violet-600 to-purple-500',
    ringHover: 'hover:border-violet-500 dark:hover:border-violet-400',
    landingCardHover: 'hover:border-violet-400/70 hover:bg-[#161742]',
    landingCardSelected: 'border-violet-400 bg-[#1A1B4D] ring-1 ring-violet-400/35',
    iconBg: 'bg-violet-600/15 text-violet-700 dark:text-violet-300',
  },
  emerald: {
    name: 'Emerald',
    topBar: 'from-emerald-600 via-teal-500 to-green-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    textDarkLanding: 'text-emerald-400',
    softSurface: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    softBorder: 'border-emerald-200 dark:border-emerald-800/80',
    activeButton: 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700',
    activeTab: 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300',
    progressBar: 'bg-gradient-to-r from-emerald-600 to-teal-500',
    ringHover: 'hover:border-emerald-500 dark:hover:border-emerald-400',
    landingCardHover: 'hover:border-emerald-400/70 hover:bg-[#092434]',
    landingCardSelected: 'border-emerald-400 bg-[#0B2B3C] ring-1 ring-emerald-400/35',
    iconBg: 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300',
  },
  amber: {
    name: 'Warm Gold',
    topBar: 'from-amber-500 via-yellow-500 to-orange-500',
    text: 'text-amber-700 dark:text-amber-400',
    textDarkLanding: 'text-amber-400',
    softSurface: 'bg-amber-50/75 dark:bg-amber-950/30',
    softBorder: 'border-amber-200 dark:border-amber-800/80',
    activeButton: 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600',
    activeTab: 'border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300',
    progressBar: 'bg-gradient-to-r from-amber-500 to-orange-500',
    ringHover: 'hover:border-amber-500 dark:hover:border-amber-400',
    landingCardHover: 'hover:border-amber-400/70 hover:bg-[#231D30]',
    landingCardSelected: 'border-amber-400 bg-[#2A2236] ring-1 ring-amber-400/35',
    iconBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  },
  rose: {
    name: 'Crimson Rose',
    topBar: 'from-rose-600 via-pink-500 to-red-500',
    text: 'text-rose-700 dark:text-rose-400',
    textDarkLanding: 'text-rose-400',
    softSurface: 'bg-rose-50/70 dark:bg-rose-950/30',
    softBorder: 'border-rose-200 dark:border-rose-800/80',
    activeButton: 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600',
    activeTab: 'border-rose-600 text-rose-700 dark:border-rose-400 dark:text-rose-300',
    progressBar: 'bg-gradient-to-r from-rose-600 to-pink-500',
    ringHover: 'hover:border-rose-500 dark:hover:border-rose-400',
    landingCardHover: 'hover:border-rose-400/70 hover:bg-[#241335]',
    landingCardSelected: 'border-rose-400 bg-[#2B163D] ring-1 ring-rose-400/35',
    iconBg: 'bg-rose-600/15 text-rose-700 dark:text-rose-300',
  },
  cyan: {
    name: 'Ocean Cyan',
    topBar: 'from-cyan-600 via-sky-500 to-teal-500',
    text: 'text-cyan-700 dark:text-cyan-400',
    textDarkLanding: 'text-cyan-400',
    softSurface: 'bg-cyan-50/70 dark:bg-cyan-950/30',
    softBorder: 'border-cyan-200 dark:border-cyan-800/80',
    activeButton: 'bg-cyan-700 hover:bg-cyan-800 text-white border-cyan-700',
    activeTab: 'border-cyan-600 text-cyan-700 dark:border-cyan-400 dark:text-cyan-300',
    progressBar: 'bg-gradient-to-r from-cyan-600 to-sky-500',
    ringHover: 'hover:border-cyan-500 dark:hover:border-cyan-400',
    landingCardHover: 'hover:border-cyan-400/70 hover:bg-[#09213E]',
    landingCardSelected: 'border-cyan-400 bg-[#0B2849] ring-1 ring-cyan-400/35',
    iconBg: 'bg-cyan-600/15 text-cyan-700 dark:text-cyan-300',
  },
  indigo: {
    name: 'Deep Indigo',
    topBar: 'from-indigo-600 via-blue-600 to-violet-600',
    text: 'text-indigo-700 dark:text-indigo-400',
    textDarkLanding: 'text-indigo-400',
    softSurface: 'bg-indigo-50/70 dark:bg-indigo-950/30',
    softBorder: 'border-indigo-200 dark:border-indigo-800/80',
    activeButton: 'bg-indigo-700 hover:bg-indigo-800 text-white border-indigo-700',
    activeTab: 'border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300',
    progressBar: 'bg-gradient-to-r from-indigo-600 to-violet-500',
    ringHover: 'hover:border-indigo-500 dark:hover:border-indigo-400',
    landingCardHover: 'hover:border-indigo-400/70 hover:bg-[#121948]',
    landingCardSelected: 'border-indigo-400 bg-[#172057] ring-1 ring-indigo-400/35',
    iconBg: 'bg-indigo-600/15 text-indigo-700 dark:text-indigo-300',
  },
  teal: {
    name: 'Coastal Teal',
    topBar: 'from-teal-600 via-emerald-500 to-cyan-500',
    text: 'text-teal-700 dark:text-teal-400',
    textDarkLanding: 'text-teal-400',
    softSurface: 'bg-teal-50/70 dark:bg-teal-950/30',
    softBorder: 'border-teal-200 dark:border-teal-800/80',
    activeButton: 'bg-teal-700 hover:bg-teal-800 text-white border-teal-700',
    activeTab: 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300',
    progressBar: 'bg-gradient-to-r from-teal-600 to-cyan-500',
    ringHover: 'hover:border-teal-500 dark:hover:border-teal-400',
    landingCardHover: 'hover:border-teal-400/70 hover:bg-[#08243A]',
    landingCardSelected: 'border-teal-400 bg-[#0A2C44] ring-1 ring-teal-400/35',
    iconBg: 'bg-teal-600/15 text-teal-700 dark:text-teal-300',
  },
  fuchsia: {
    name: 'Orchid Fuchsia',
    topBar: 'from-fuchsia-600 via-purple-500 to-pink-500',
    text: 'text-fuchsia-700 dark:text-fuchsia-400',
    textDarkLanding: 'text-fuchsia-400',
    softSurface: 'bg-fuchsia-50/70 dark:bg-fuchsia-950/30',
    softBorder: 'border-fuchsia-200 dark:border-fuchsia-800/80',
    activeButton: 'bg-fuchsia-700 hover:bg-fuchsia-800 text-white border-fuchsia-700',
    activeTab: 'border-fuchsia-600 text-fuchsia-700 dark:border-fuchsia-400 dark:text-fuchsia-300',
    progressBar: 'bg-gradient-to-r from-fuchsia-600 to-pink-500',
    ringHover: 'hover:border-fuchsia-500 dark:hover:border-fuchsia-400',
    landingCardHover: 'hover:border-fuchsia-400/70 hover:bg-[#23143F]',
    landingCardSelected: 'border-fuchsia-400 bg-[#2B184C] ring-1 ring-fuchsia-400/35',
    iconBg: 'bg-fuchsia-600/15 text-fuchsia-700 dark:text-fuchsia-300',
  },
  orange: {
    name: 'Sunset Orange',
    topBar: 'from-orange-500 via-amber-500 to-rose-500',
    text: 'text-orange-700 dark:text-orange-400',
    textDarkLanding: 'text-orange-400',
    softSurface: 'bg-orange-50/75 dark:bg-orange-950/30',
    softBorder: 'border-orange-200 dark:border-orange-800/80',
    activeButton: 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600',
    activeTab: 'border-orange-600 text-orange-700 dark:border-orange-400 dark:text-orange-300',
    progressBar: 'bg-gradient-to-r from-orange-500 to-amber-500',
    ringHover: 'hover:border-orange-500 dark:hover:border-orange-400',
    landingCardHover: 'hover:border-orange-400/70 hover:bg-[#261A2E]',
    landingCardSelected: 'border-orange-400 bg-[#302038] ring-1 ring-orange-400/35',
    iconBg: 'bg-orange-600/15 text-orange-700 dark:text-orange-300',
  },
  sky: {
    name: 'Sky Azure',
    topBar: 'from-sky-500 via-blue-500 to-cyan-500',
    text: 'text-sky-700 dark:text-sky-400',
    textDarkLanding: 'text-sky-400',
    softSurface: 'bg-sky-50/70 dark:bg-sky-950/30',
    softBorder: 'border-sky-200 dark:border-sky-800/80',
    activeButton: 'bg-sky-700 hover:bg-sky-800 text-white border-sky-700',
    activeTab: 'border-sky-600 text-sky-700 dark:border-sky-400 dark:text-sky-300',
    progressBar: 'bg-gradient-to-r from-sky-500 to-blue-600',
    ringHover: 'hover:border-sky-500 dark:hover:border-sky-400',
    landingCardHover: 'hover:border-sky-400/70 hover:bg-[#0A2242]',
    landingCardSelected: 'border-sky-400 bg-[#0D294F] ring-1 ring-sky-400/35',
    iconBg: 'bg-sky-600/15 text-sky-700 dark:text-sky-300',
  },
};

export type ThemeColorKey = keyof typeof COLOR_THEMES;

/** Distinct color identity for each of Levels 1–10 */
export const LEVEL_COLOR_KEYS: Record<number, ThemeColorKey> = {
  1: 'blue',
  2: 'violet',
  3: 'emerald',
  4: 'amber',
  5: 'rose',
  6: 'cyan',
  7: 'indigo',
  8: 'teal',
  9: 'fuchsia',
  10: 'orange',
};

export function getLevelTheme(level: number): ColorThemeSpec {
  return COLOR_THEMES[LEVEL_COLOR_KEYS[level] ?? 'blue'];
}

/** Distinct color identity for each of the 9 Academy Categories */
export const CATEGORY_COLOR_KEYS: Record<string, ThemeColorKey> = {
  'picture-connect': 'blue',
  'shopping-negotiation': 'emerald',
  indianism: 'sky',
  'interview-skills': 'violet',
  'gd-skills': 'rose',
  'aptitude-grammar': 'amber',
  'coding-dsa': 'indigo',
  'data-cloud': 'teal',
  'and-more': 'orange',
};

export function getCategoryTheme(categoryId: string): ColorThemeSpec {
  return COLOR_THEMES[CATEGORY_COLOR_KEYS[categoryId] ?? 'blue'];
}

/** Distinct color identity for each Primary Navigation Section */
export const NAV_SECTION_COLOR_KEYS: Record<string, ThemeColorKey> = {
  journey: 'blue',
  levels: 'indigo',
  wheel: 'fuchsia',
  shopping: 'emerald',
  career: 'cyan',
  universe: 'violet',
  advanced: 'rose',
  final: 'amber',
  achievements: 'orange',
};

export function getNavSectionTheme(viewId: string): ColorThemeSpec {
  return COLOR_THEMES[NAV_SECTION_COLOR_KEYS[viewId] ?? 'blue'];
}

/** Distinct color identity for each Career MCQ Category */
export const CAREER_COLOR_KEYS: Record<CareerCategoryId, ThemeColorKey> = {
  indianism: 'sky',
  interview: 'violet',
  gd: 'emerald',
};

export function getCareerTheme(catId: CareerCategoryId): ColorThemeSpec {
  return COLOR_THEMES[CAREER_COLOR_KEYS[catId] ?? 'sky'];
}

/** Distinct color identity for each Master Universe Pillar & 12 Tracks */
export const PILLAR_COLOR_KEYS: Record<MasterPillarId, ThemeColorKey> = {
  aptitude_grammar: 'amber',
  coding_dsa: 'violet',
  data_cloud: 'emerald',
};

export const TRACK_COLOR_KEYS: Record<MasterTrackId, ThemeColorKey> = {
  aptitude: 'amber',
  grammar: 'blue',
  parts_of_speech: 'teal',
  parts_of_grammar: 'indigo',
  c_lang: 'cyan',
  cpp_lang: 'violet',
  java_lang: 'rose',
  dsa: 'fuchsia',
  excel: 'emerald',
  power_bi: 'orange',
  dbms: 'sky',
  cloud: 'indigo',
};

export function getPillarTheme(pillarId: MasterPillarId): ColorThemeSpec {
  return COLOR_THEMES[PILLAR_COLOR_KEYS[pillarId] ?? 'blue'];
}

export function getTrackTheme(trackId: MasterTrackId): ColorThemeSpec {
  return COLOR_THEMES[TRACK_COLOR_KEYS[trackId] ?? 'blue'];
}

/** Distinct color identity for each Spin Wheel Deck */
export const WHEEL_DECK_COLOR_KEYS: Record<string, ThemeColorKey> = {
  challenges: 'rose',
  mashup: 'violet',
  ceo_pitch: 'amber',
};

export function getWheelDeckTheme(deckId: string): ColorThemeSpec {
  return COLOR_THEMES[WHEEL_DECK_COLOR_KEYS[deckId] ?? 'violet'];
}
