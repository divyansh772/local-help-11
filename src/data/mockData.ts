import { ServiceCategory, ServiceItem, Worker, Booking } from '../types';
import { EXPANDED_WORKERS } from './workersData';

export const SERVICE_CATEGORIES: {
  id: ServiceCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
}[] = [
  {
    id: 'cleaning',
    name: 'Home Cleaning',
    icon: 'Sparkles',
    description: 'Deep cleaning, sofa shampoo, kitchen & bathroom sanitation',
    color: 'emerald',
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: 'Wrench',
    description: 'Leak repairs, tap fixing, drain unclogging & pipe setups',
    color: 'blue',
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'Zap',
    description: 'Wiring, MCB repairs, fans, lighting fixtures & switchboards',
    color: 'amber',
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    icon: 'Hammer',
    description: 'Furniture assembly, locks, door repairs & drill mounting',
    color: 'orange',
  },
];

export const SERVICE_ITEMS: ServiceItem[] = [
  // Cleaning
  {
    id: 'clean-1',
    category: 'cleaning',
    name: 'Full Home Deep Cleaning (2-3 BHK)',
    description: 'Comprehensive mechanized scrubbing, balcony wash, window track clean, and full floor disinfection.',
    basePrice: 1499,
    durationMinutes: 180,
    popular: true,
    iconName: 'Home',
  },
  {
    id: 'clean-2',
    category: 'cleaning',
    name: 'Intense Bathroom Descaling & Clean',
    description: 'Acid-free tile scrubbing, hard-water stain removal, chrome fittings polish, and steam sanitation.',
    basePrice: 499,
    durationMinutes: 60,
    popular: true,
    iconName: 'Sparkles',
  },
  {
    id: 'clean-3',
    category: 'cleaning',
    name: 'Kitchen Chimney & Counter Degreasing',
    description: 'Deep removal of tough oil sludge, filter mesh degreasing, backsplash restoration.',
    basePrice: 599,
    durationMinutes: 90,
    iconName: 'Flame',
  },
  {
    id: 'clean-4',
    category: 'cleaning',
    name: 'Fabric Sofa & Carpet Wet Shampoo',
    description: 'Industrial injection-extraction vacuuming that eliminates allergens, dust mites, and pet stains.',
    basePrice: 699,
    durationMinutes: 75,
    iconName: 'Armchair',
  },

  // Plumbing
  {
    id: 'plumb-1',
    category: 'plumbing',
    name: 'Tap / Mixer Repair & Installation',
    description: 'Fixing continuous dripping, washer replacements, mixer spindle changes, or brand-new tap fitment.',
    basePrice: 249,
    durationMinutes: 45,
    popular: true,
    iconName: 'Droplet',
  },
  {
    id: 'plumb-2',
    category: 'plumbing',
    name: 'Drain Blockage & Sink Pipe Clearing',
    description: 'Heavy-duty mechanical snake unclogging for kitchen sinks, wash basins, and shower drains.',
    basePrice: 399,
    durationMinutes: 50,
    popular: true,
    iconName: 'Filter',
  },
  {
    id: 'plumb-3',
    category: 'plumbing',
    name: 'Concealed Pipe Leakage Detection',
    description: 'Diagnostic pressure testing, acoustic joint inspection, and precision patch repair without wall damage.',
    basePrice: 799,
    durationMinutes: 90,
    iconName: 'Activity',
  },
  {
    id: 'plumb-4',
    category: 'plumbing',
    name: 'Toilet Flush Cistern & Jet Spray Fix',
    description: 'Overhaul of ball-cock valves, siphon flapper repair, leak-proof brass jet spray installation.',
    basePrice: 349,
    durationMinutes: 40,
    iconName: 'CircleAlert',
  },

  // Electrical
  {
    id: 'elec-1',
    category: 'electrical',
    name: 'Ceiling Fan & Exhaust Installation',
    description: 'Blade balancing, hook installation, regulator pairing, and noise reduction lubrication.',
    basePrice: 249,
    durationMinutes: 40,
    popular: true,
    iconName: 'Wind',
  },
  {
    id: 'elec-2',
    category: 'electrical',
    name: 'MCB Tripping Diagnostic & Fuse Fix',
    description: 'Short circuit isolation, insulation breakdown resistance test, and safe breaker replacement.',
    basePrice: 399,
    durationMinutes: 60,
    popular: true,
    iconName: 'ShieldAlert',
  },
  {
    id: 'elec-3',
    category: 'electrical',
    name: 'Decorative Lights & Chandelier Mounting',
    description: 'Precision laser-aligned wall bracket drilling, hidden cabling, and high-wattage dimmer setup.',
    basePrice: 499,
    durationMinutes: 80,
    iconName: 'Lightbulb',
  },
  {
    id: 'elec-4',
    category: 'electrical',
    name: 'Switchboard Overhaul & Socket Repair',
    description: 'Replacing burnt modular plates, installing 16A heavy appliance points for AC/Fridge.',
    basePrice: 199,
    durationMinutes: 45,
    iconName: 'Power',
  },

  // Carpentry
  {
    id: 'carp-1',
    category: 'carpentry',
    name: 'Flatpack / IKEA Furniture Assembly',
    description: 'Assembly of wardrobes, beds, dining sets, and desks with high-torque alignment tools.',
    basePrice: 499,
    durationMinutes: 90,
    popular: true,
    iconName: 'Package',
  },
  {
    id: 'carp-2',
    category: 'carpentry',
    name: 'Door Lock & Smart Keypad Fitting',
    description: 'Mortise lock installation, cylinder replacement, door realignment to stop scraping.',
    basePrice: 399,
    durationMinutes: 50,
    iconName: 'Lock',
  },
  {
    id: 'carp-3',
    category: 'carpentry',
    name: 'Wall Mounting, Curtains & Drill Work',
    description: 'Heavy TV brackets, floating shelves, mirrors, and curtain rods mounted on concrete or drywall.',
    basePrice: 199,
    durationMinutes: 30,
    iconName: 'Grid',
  },
];

export const WORKERS: Worker[] = EXPANDED_WORKERS;

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'UBX-89201',
    workerId: 'w-plumb-norm-1',
    workerName: 'Santosh Kumar (Santosh Mistri)',
    workerInitials: 'SK',
    workerBadgeColor: 'bg-blue-600',
    workerCategory: 'plumbing',
    serviceName: 'Tap / Mixer Repair & Installation',
    date: 'Today, 2:00 PM',
    timeSlot: '2:00 PM - 3:00 PM',
    status: 'confirmed',
    otp: '4892',
    address: {
      flatNumber: 'Flat 402, Tower B',
      street: 'Cyber City Road, DLF Phase 2',
      city: 'Delhi NCR',
      pincode: '122002',
      instructions: 'Ring buzzer #402, 4th floor on the right',
    },
    pricing: {
      basePrice: 249,
      partsAddonPrice: 80,
      safetyFee: 49,
      discount: 50,
      total: 328,
    },
    createdAt: '2026-09-21T09:15:00.000Z',
  },
  {
    id: 'UBX-84190',
    workerId: 'w-clean-1',
    workerName: 'Rajesh Sharma',
    workerInitials: 'RS',
    workerBadgeColor: 'bg-emerald-700',
    workerCategory: 'cleaning',
    serviceName: 'Full Home Deep Cleaning (2-3 BHK)',
    date: 'Sep 18, 2026',
    timeSlot: '10:00 AM - 1:00 PM',
    status: 'completed',
    otp: '9120',
    address: {
      flatNumber: 'Penthouse 1201',
      street: 'Palm Meadows, Golf Course Ext',
      city: 'Delhi NCR',
      pincode: '122018',
    },
    pricing: {
      basePrice: 1499,
      partsAddonPrice: 0,
      safetyFee: 49,
      discount: 150,
      total: 1398,
    },
    createdAt: '2026-09-18T08:00:00.000Z',
    rated: true,
    ratingGiven: 5,
  },
];
