import heroCrossroadsEditorial from '../assets/images/hero_crossroads_editorial_1795020541815.jpg';
import pencilStudioMacro from '../assets/images/pencil_studio_macro_1795020543932.jpg';
import appleRocketInnovation from '../assets/images/apple_rocket_innovation_1795020542297.jpg';
import executiveDeskMemory from '../assets/images/executive_desk_memory_1795020543473.jpg';
import modernOfficeAudit from '../assets/images/modern_office_audit_1795020543342.jpg';
import paperclipLuxuryProduct from '../assets/images/paperclip_luxury_product_1795020544152.jpg';
import empathyWindowPortrait from '../assets/images/empathy_window_portrait_1795020544834.jpg';
import boardroomStrategyDecline from '../assets/images/boardroom_strategy_decline_1795020549488.jpg';

export const PHOTO_ASSETS = {
  crossroads: {
    src: heroCrossroadsEditorial,
    alt: 'A person standing at a sleek sunlit urban architectural crossroads facing branching pathways',
    caption: 'Crossroads · Perspectives & Choices',
  },
  broken_pencil: {
    src: pencilStudioMacro,
    alt: 'Studio macro photograph of a snapped graphite pencil beside a brushed-metal sharpener',
    caption: 'Sharp Edge · Failure & Reinvention',
  },
  apple_rocket: {
    src: appleRocketInnovation,
    alt: 'Minimalist studio composition of an apple resting beside a brushed-aluminum scale rocket',
    caption: 'Gravity to Orbit · Innovation Pair',
  },
  memory_scene: {
    src: executiveDeskMemory,
    alt: 'Overhead wooden desk with closed laptop, reading glasses, notebook, watch, espresso cup, brass compass, and succulent',
    caption: 'Executive Desk · Visual Memory Drill',
  },
  workplace_detective: {
    src: modernOfficeAudit,
    alt: 'Open-plan modern corporate workspace featuring whiteboard diagrams, open filing cabinet, power cords, and blocked emergency exit',
    caption: 'Workplace Audit · Spot the Violations',
  },
  paperclip: {
    src: paperclipLuxuryProduct,
    alt: 'Minimalist matte-blue metallic paperclip displayed on a smooth limestone plinth',
    caption: 'ConnectPro · Product Reinvention',
  },
  emotion_scene: {
    src: empathyWindowPortrait,
    alt: 'Thoughtful professional seated beside a rain-streaked floor-to-ceiling office glass window',
    caption: 'Human Lens · Empathy & Reasoning',
  },
  boardroom_decline: {
    src: boardroomStrategyDecline,
    alt: 'Dusk corporate boardroom displaying a glowing red downward sales trajectory alongside a rising competitor line',
    caption: 'Boardroom Strategy · Turnaround Analysis',
  },
} as const;

export type PhotoAssetKey = keyof typeof PHOTO_ASSETS;
