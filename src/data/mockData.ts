import type { 
  Incident, 
  Traveller, 
  Booking, 
  PolicyDocument, 
  EvidenceSnippet, 
  RecoveryPlan, 
  AuditLogEntry,
  AgentStep,
  ModelMetricRow,
  ClassPerformance,
  ConfusionMatrixData
} from '../types';

export const INITIAL_TRAVELLERS: Traveller[] = [
  {
    id: 'TRV-101',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@techcorp-india.com',
    phone: '+91 98112 40912',
    tier: 'Corporate Platinum',
    baseCity: 'New Delhi',
    emergencyContact: 'Sunita Sharma (+91 98112 40915)',
    budgetLimitINR: 25000,
    preferences: {
      seat: 'Aisle, forward cabin',
      meal: 'Vegetarian Hindu meal (AVML)',
      hotelRoom: 'Quiet high-floor, king bed',
      transitFlexibility: 'Prioritises direct connections over cost'
    },
    insuranceActive: true
  },
  {
    id: 'TRV-102',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@finconsult.in',
    phone: '+91 98450 11283',
    tier: 'Leisure Gold',
    baseCity: 'Bengaluru',
    emergencyContact: 'K. Iyer (+91 98450 11290)',
    budgetLimitINR: 18000,
    preferences: {
      seat: 'Window seat',
      meal: 'South Indian vegetarian',
      hotelRoom: 'Sea view if available',
      transitFlexibility: 'Accepts up to 3-hour layovers'
    },
    insuranceActive: true
  },
  {
    id: 'TRV-103',
    name: 'Vikram Malhotra',
    email: 'v.malhotra@apexholdings.co.in',
    phone: '+91 99201 55674',
    tier: 'Executive CXO',
    baseCity: 'Mumbai',
    emergencyContact: 'Executive Desk (+91 22 6600 4400)',
    budgetLimitINR: 40000,
    preferences: {
      seat: 'Business Class 1A or 1F',
      meal: 'Diabetic meal',
      hotelRoom: 'Executive suite with desk and late checkout',
      transitFlexibility: 'Zero tolerance for multi-leg diversions'
    },
    insuranceActive: true
  },
  {
    id: 'TRV-104',
    name: 'Priya Patel',
    email: 'priya.patel@gujaratlogistics.org',
    phone: '+91 97244 88319',
    tier: 'Leisure Silver',
    baseCity: 'Ahmedabad',
    emergencyContact: 'Hasmukh Patel (+91 97244 88320)',
    budgetLimitINR: 15000,
    preferences: {
      seat: 'Window or aisle',
      meal: 'Jain vegetarian',
      hotelRoom: 'Twin beds, non-smoking',
      transitFlexibility: 'Flexible with road transit under 4 hours'
    },
    insuranceActive: true
  },
  {
    id: 'TRV-105',
    name: 'Rajesh Verma',
    email: 'rajesh.verma@indusinfra.com',
    phone: '+91 98230 67120',
    tier: 'Corporate Gold',
    baseCity: 'Pune',
    emergencyContact: 'Meena Verma (+91 98230 67125)',
    budgetLimitINR: 20000,
    preferences: {
      seat: 'Aisle seat',
      meal: 'Standard non-vegetarian',
      hotelRoom: 'Business single room near transit hub',
      transitFlexibility: 'Accepts premium rail alternative'
    },
    insuranceActive: false
  },
  {
    id: 'TRV-106',
    name: 'Sneha Nair',
    email: 'sneha.nair@biogen-india.net',
    phone: '+91 94471 22894',
    tier: 'Solo Traveller',
    baseCity: 'Kochi',
    emergencyContact: 'P. Nair (+91 94471 22899)',
    budgetLimitINR: 12000,
    preferences: {
      seat: 'Any forward row',
      meal: 'Vegetarian',
      hotelRoom: 'Safe boutique single room',
      transitFlexibility: 'Prefers daytime travel'
    },
    insuranceActive: true
  },
  {
    id: 'TRV-107',
    name: 'Aditya Joshi',
    email: 'aditya.joshi@hyderabadtech.io',
    phone: '+91 98490 33412',
    tier: 'Corporate Platinum',
    baseCity: 'Hyderabad',
    emergencyContact: 'Swati Joshi (+91 98490 33418)',
    budgetLimitINR: 30000,
    preferences: {
      seat: 'Extra legroom seat (Row 1 or 12)',
      meal: 'Asian vegetarian',
      hotelRoom: 'Club room with lounge access',
      transitFlexibility: 'Accepts re-routing via BOM or BLR'
    },
    insuranceActive: true
  },
  {
    id: 'TRV-108',
    name: 'Kavita Sen',
    email: 'kavita.sen@kolkataheritage.in',
    phone: '+91 98301 77451',
    tier: 'Family Vacation',
    baseCity: 'Kolkata',
    emergencyContact: 'A. Sen (+91 98301 77455)',
    budgetLimitINR: 22000,
    preferences: {
      seat: 'Adjacent seats for family of two',
      meal: 'Fish meal or Bengali vegetarian',
      hotelRoom: 'Interconnected family suite',
      transitFlexibility: 'Requires step-free access for elderly parent'
    },
    insuranceActive: true
  },
  {
    id: 'TRV-109',
    name: 'Arvind Swaminathan',
    email: 'arvind.s@chennaiauto.com',
    phone: '+91 98402 99812',
    tier: 'Business Traveller',
    baseCity: 'Chennai',
    emergencyContact: 'Radha Swaminathan (+91 98402 99815)',
    budgetLimitINR: 22000,
    preferences: {
      seat: 'Aisle seat',
      meal: 'South Indian vegetarian',
      hotelRoom: 'High-speed Wi-Fi, quiet courtyard view',
      transitFlexibility: 'Cannot delay arrival past 19:00 IST'
    },
    insuranceActive: true
  },
  {
    id: 'TRV-110',
    name: 'Meera Kulkarni',
    email: 'meera.k@artarchive.org',
    phone: '+91 98200 44510',
    tier: 'Cultural Tour',
    baseCity: 'Mumbai',
    emergencyContact: 'N. Kulkarni (+91 98200 44512)',
    budgetLimitINR: 14000,
    preferences: {
      seat: 'Window seat',
      meal: 'Strict vegetarian',
      hotelRoom: 'Heritage property ground floor',
      transitFlexibility: 'Prefers scheduled private cab over bus'
    },
    insuranceActive: false
  },
  {
    id: 'TRV-111',
    name: 'Suresh Menon',
    email: 'suresh.menon@malabarspices.co.in',
    phone: '+91 94951 88204',
    tier: 'Corporate Gold',
    baseCity: 'Kozhikode',
    emergencyContact: 'G. Menon (+91 94951 88209)',
    budgetLimitINR: 18000,
    preferences: {
      seat: 'Aisle seat',
      meal: 'Standard meal',
      hotelRoom: 'Standard air-conditioned business room',
      transitFlexibility: 'Accepts express train if flights cancelled'
    },
    insuranceActive: true
  },
  {
    id: 'TRV-112',
    name: 'Deepa Dasgupta',
    email: 'deepa.d@capitalpartners.in',
    phone: '+91 98105 61234',
    tier: 'Executive Luxury',
    baseCity: 'New Delhi',
    emergencyContact: 'Partner Desk (+91 11 4100 8899)',
    budgetLimitINR: 35000,
    preferences: {
      seat: 'First row Business / Premium Economy',
      meal: 'Fruit platter & sparkling water',
      hotelRoom: '5-star property, 24-hr room service',
      transitFlexibility: 'Same-day turnaround required'
    },
    insuranceActive: true
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  // Incident 1: Cyclonic Storm Goa (TRV-101, TRV-102, TRV-103, TRV-104)
  {
    id: 'BKG-201',
    travellerId: 'TRV-101',
    type: 'Flight',
    reference: '6E-241',
    supplier: 'IndiGo Airlines',
    serviceName: 'DEL to GOI (Dabolim)',
    departureOrCheckIn: '2026-10-10 14:10 IST',
    arrivalOrCheckOut: '2026-10-10 16:45 IST',
    location: 'Goa (GOI)',
    costINR: 8450,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0841',
    disruptionNote: 'Airport coastal alert. Severe crosswinds and runway suspension expected.'
  },
  {
    id: 'BKG-202',
    travellerId: 'TRV-101',
    type: 'Hotel',
    reference: 'TAJ-GOA-901',
    supplier: 'Taj Hotels & Resorts',
    serviceName: 'Taj Exotica Resort & Spa Benaulim (3 Nights)',
    departureOrCheckIn: '2026-10-10',
    arrivalOrCheckOut: '2026-10-13',
    location: 'South Goa',
    costINR: 36000,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0841',
    disruptionNote: 'Beachfront red alert. Resort beach access and outdoor dining suspended.'
  },
  {
    id: 'BKG-203',
    travellerId: 'TRV-102',
    type: 'Flight',
    reference: 'AI-804',
    supplier: 'Air India',
    serviceName: 'BLR to GOX (Mopa North Goa)',
    departureOrCheckIn: '2026-10-10 15:30 IST',
    arrivalOrCheckOut: '2026-10-10 16:50 IST',
    location: 'Goa (GOX)',
    costINR: 6200,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0841',
    disruptionNote: 'Flight on hold due to storm trajectory and squalls.'
  },
  {
    id: 'BKG-204',
    travellerId: 'TRV-102',
    type: 'Hotel',
    reference: 'ALILA-204',
    supplier: 'Alila Diwa Goa',
    serviceName: 'Alila Diwa Resort Majorda (2 Nights)',
    departureOrCheckIn: '2026-10-10',
    arrivalOrCheckOut: '2026-10-12',
    location: 'South Goa',
    costINR: 24000,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0841',
    disruptionNote: 'Inbound guest check-in impacted by coastal cyclone warning.'
  },
  {
    id: 'BKG-205',
    travellerId: 'TRV-103',
    type: 'Flight',
    reference: 'QP-1302',
    supplier: 'Akasa Air',
    serviceName: 'BOM to GOI (Dabolim)',
    departureOrCheckIn: '2026-10-10 13:00 IST',
    arrivalOrCheckOut: '2026-10-10 14:15 IST',
    location: 'Goa (GOI)',
    costINR: 11200,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0841',
    disruptionNote: 'Turbulence diversion and arrival slot cancelled.'
  },
  {
    id: 'BKG-206',
    travellerId: 'TRV-103',
    type: 'Transfer',
    reference: 'TRF-GOA-33',
    supplier: 'Goa Chauffeur Services',
    serviceName: 'Dabolim to ITC Grand Goa Luxury SUV',
    departureOrCheckIn: '2026-10-10 14:30 IST',
    arrivalOrCheckOut: '2026-10-10 15:45 IST',
    location: 'South Goa',
    costINR: 3200,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0841',
    disruptionNote: 'Coastal road NH66 experiencing waterlogging and tree falls.'
  },
  {
    id: 'BKG-207',
    travellerId: 'TRV-104',
    type: 'Flight',
    reference: '6E-512',
    supplier: 'IndiGo Airlines',
    serviceName: 'AMD to GOI (via BOM)',
    departureOrCheckIn: '2026-10-10 11:30 IST',
    arrivalOrCheckOut: '2026-10-10 15:50 IST',
    location: 'Goa (GOI)',
    costINR: 7800,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0841',
    disruptionNote: 'Connecting leg Mumbai-Goa grounded due to cyclone warning.'
  },

  // Incident 2: Runway Resurfacing Mumbai (TRV-105, TRV-106, TRV-107)
  {
    id: 'BKG-208',
    travellerId: 'TRV-105',
    type: 'Flight',
    reference: 'AI-630',
    supplier: 'Air India',
    serviceName: 'BOM to DEL',
    departureOrCheckIn: '2026-10-10 17:00 IST',
    arrivalOrCheckOut: '2026-10-10 19:15 IST',
    location: 'Mumbai (BOM)',
    costINR: 9200,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0842',
    disruptionNote: 'Runway maintenance NOTAM A1492/26 cancellation.'
  },
  {
    id: 'BKG-209',
    travellerId: 'TRV-105',
    type: 'Hotel',
    reference: 'LEELA-DEL-12',
    supplier: 'The Leela Palaces',
    serviceName: 'The Leela Ambience Gurugram (1 Night)',
    departureOrCheckIn: '2026-10-10',
    arrivalOrCheckOut: '2026-10-11',
    location: 'Delhi NCR',
    costINR: 14500,
    status: 'On Schedule',
    impactedByIncidentId: 'INC-2026-0842',
    disruptionNote: 'Late arrival risk due to Mumbai outbound flight suspension.'
  },
  {
    id: 'BKG-210',
    travellerId: 'TRV-106',
    type: 'Flight',
    reference: '6E-719',
    supplier: 'IndiGo Airlines',
    serviceName: 'BOM to COK (Kochi)',
    departureOrCheckIn: '2026-10-10 16:15 IST',
    arrivalOrCheckOut: '2026-10-10 18:20 IST',
    location: 'Mumbai (BOM)',
    costINR: 6400,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0842',
    disruptionNote: 'Departure slot revoked during runway closure window.'
  },
  {
    id: 'BKG-211',
    travellerId: 'TRV-107',
    type: 'Flight',
    reference: 'UK-851',
    supplier: 'Air India / Vistara',
    serviceName: 'HYD to BOM',
    departureOrCheckIn: '2026-10-10 15:45 IST',
    arrivalOrCheckOut: '2026-10-10 17:15 IST',
    location: 'Mumbai (BOM)',
    costINR: 7100,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0842',
    disruptionNote: 'Arrival hold expected to exceed fuel reserves, diverted.'
  },
  {
    id: 'BKG-212',
    travellerId: 'TRV-107',
    type: 'Hotel',
    reference: 'TRIDENT-BOM-88',
    supplier: 'The Oberoi Group',
    serviceName: 'Trident Nariman Point Mumbai (2 Nights)',
    departureOrCheckIn: '2026-10-10',
    arrivalOrCheckOut: '2026-10-12',
    location: 'Mumbai South',
    costINR: 28000,
    status: 'On Schedule',
    impactedByIncidentId: 'INC-2026-0842',
    disruptionNote: 'Pending confirmation of guest transit from Hyderabad.'
  },

  // Incident 3: Heritage Property Inspection Jaipur (TRV-108, TRV-110)
  {
    id: 'BKG-213',
    travellerId: 'TRV-108',
    type: 'Hotel',
    reference: 'RAMBAGH-108',
    supplier: 'Taj Hotels & Resorts',
    serviceName: 'Rambagh Palace Jaipur Heritage Suite (2 Nights)',
    departureOrCheckIn: '2026-10-10',
    arrivalOrCheckOut: '2026-10-12',
    location: 'Jaipur',
    costINR: 52000,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0843',
    disruptionNote: 'Heritage east wing temporarily closed for structural load safety inspection.'
  },
  {
    id: 'BKG-214',
    travellerId: 'TRV-108',
    type: 'Activity',
    reference: 'ACT-JAI-04',
    supplier: 'Rajasthan Tourism Dev Corp',
    serviceName: 'Amer Fort Private Heritage Walk & Sound-Light',
    departureOrCheckIn: '2026-10-11 16:00 IST',
    arrivalOrCheckOut: '2026-10-11 20:00 IST',
    location: 'Jaipur',
    costINR: 4500,
    status: 'On Schedule'
  },
  {
    id: 'BKG-215',
    travellerId: 'TRV-110',
    type: 'Hotel',
    reference: 'LEELA-JAI-44',
    supplier: 'The Leela Palaces',
    serviceName: 'The Leela Palace Jaipur Royal Pavilion (2 Nights)',
    departureOrCheckIn: '2026-10-10',
    arrivalOrCheckOut: '2026-10-12',
    location: 'Jaipur',
    costINR: 38000,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0843',
    disruptionNote: 'Pavilion wing rooms sealed by municipal preservation squad.'
  },
  {
    id: 'BKG-216',
    travellerId: 'TRV-110',
    type: 'Flight',
    reference: '6E-431',
    supplier: 'IndiGo Airlines',
    serviceName: 'BOM to JAI',
    departureOrCheckIn: '2026-10-10 10:15 IST',
    arrivalOrCheckOut: '2026-10-10 12:00 IST',
    location: 'Jaipur (JAI)',
    costINR: 5600,
    status: 'On Schedule'
  },

  // Incident 4: Kerala Flood & Road Inundation (TRV-109, TRV-111)
  {
    id: 'BKG-217',
    travellerId: 'TRV-109',
    type: 'Transfer',
    reference: 'CAB-COK-MUN',
    supplier: 'Kerala Backwater Chauffeurs',
    serviceName: 'Kochi Airport to Munnar Hill Station Private Cab',
    departureOrCheckIn: '2026-10-10 13:00 IST',
    arrivalOrCheckOut: '2026-10-10 17:30 IST',
    location: 'Munnar Ghat Road',
    costINR: 4200,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0844',
    disruptionNote: 'Gap Road stretch blocked due to landslide debris and rising stream water.'
  },
  {
    id: 'BKG-218',
    travellerId: 'TRV-109',
    type: 'Hotel',
    reference: 'WIND-MUN-01',
    supplier: 'Windermere Estate',
    serviceName: 'Windermere Estate Munnar Plantation Room (2 Nights)',
    departureOrCheckIn: '2026-10-10',
    arrivalOrCheckOut: '2026-10-12',
    location: 'Munnar',
    costINR: 26000,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0844',
    disruptionNote: 'Property inaccessible via NH-85 until route clearance by PWD.'
  },
  {
    id: 'BKG-219',
    travellerId: 'TRV-111',
    type: 'Hotel',
    reference: 'KUMARAKOM-88',
    supplier: 'Kumarakom Lake Resort',
    serviceName: 'Luxury Pavilion Room with Private Pool (2 Nights)',
    departureOrCheckIn: '2026-10-10',
    arrivalOrCheckOut: '2026-10-12',
    location: 'Alappuzha / Kumarakom',
    costINR: 44000,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0844',
    disruptionNote: 'Lake water level warning; boat jetties suspended by district collector.'
  },
  {
    id: 'BKG-220',
    travellerId: 'TRV-111',
    type: 'Activity',
    reference: 'KERALA-HB-02',
    supplier: 'Alleppey Tourism Syndicate',
    serviceName: 'Private Houseboat Cruise & Traditional Sadhya',
    departureOrCheckIn: '2026-10-11 11:00 IST',
    arrivalOrCheckOut: '2026-10-11 17:00 IST',
    location: 'Alappuzha',
    costINR: 12000,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0844',
    disruptionNote: 'Inland water navigation halted under monsoon disaster protocol.'
  },

  // Incident 5: Delhi T3 Ground Strike (TRV-112)
  {
    id: 'BKG-221',
    travellerId: 'TRV-112',
    type: 'Flight',
    reference: 'AI-102',
    supplier: 'Air India',
    serviceName: 'DEL to BLR',
    departureOrCheckIn: '2026-10-10 18:30 IST',
    arrivalOrCheckOut: '2026-10-10 21:15 IST',
    location: 'Delhi (DEL) T3',
    costINR: 10400,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0845',
    disruptionNote: 'Ground refuelling and baggage tractor operators flash stoppage.'
  },
  {
    id: 'BKG-222',
    travellerId: 'TRV-112',
    type: 'Hotel',
    reference: 'TAJ-BLR-501',
    supplier: 'Taj Hotels & Resorts',
    serviceName: 'Taj West End Bengaluru Garden Villa (1 Night)',
    departureOrCheckIn: '2026-10-10',
    arrivalOrCheckOut: '2026-10-11',
    location: 'Bengaluru',
    costINR: 22500,
    status: 'On Schedule',
    impactedByIncidentId: 'INC-2026-0845',
    disruptionNote: 'Check-in on track pending departure from Delhi T3.'
  },

  // Non-disrupted stable baseline bookings for portfolio depth
  {
    id: 'BKG-223',
    travellerId: 'TRV-101',
    type: 'Flight',
    reference: '6E-554',
    supplier: 'IndiGo Airlines',
    serviceName: 'GOI to DEL Return Leg',
    departureOrCheckIn: '2026-10-13 18:00 IST',
    arrivalOrCheckOut: '2026-10-13 20:35 IST',
    location: 'Goa to Delhi',
    costINR: 7900,
    status: 'On Schedule'
  },
  {
    id: 'BKG-224',
    travellerId: 'TRV-104',
    type: 'Hotel',
    reference: 'GOA-MAR-12',
    supplier: 'Marriott International',
    serviceName: 'Goa Marriott Resort & Spa Miramar (2 Nights)',
    departureOrCheckIn: '2026-10-10',
    arrivalOrCheckOut: '2026-10-12',
    location: 'Panaji / North Goa',
    costINR: 21000,
    status: 'Disrupted',
    impactedByIncidentId: 'INC-2026-0841',
    disruptionNote: 'Guest unable to land due to flight diversions.'
  },
  {
    id: 'BKG-225',
    travellerId: 'TRV-107',
    type: 'Activity',
    reference: 'ACT-BOM-09',
    supplier: 'Mumbai Art Initiative',
    serviceName: 'Kala Ghoda Art & Architectural Guided Walk',
    departureOrCheckIn: '2026-10-11 09:30 IST',
    arrivalOrCheckOut: '2026-10-11 12:30 IST',
    location: 'Mumbai South',
    costINR: 2800,
    status: 'On Schedule'
  }
];

export const INITIAL_POLICY_DOCUMENTS: PolicyDocument[] = [
  {
    id: 'POL-INDIGO-01',
    title: 'IndiGo Passenger Disruption Charter (DGCA CAR Sec 3)',
    supplier: 'IndiGo Airlines (InterGlobe Aviation Ltd)',
    category: 'Airlines',
    effectiveDate: '2026-01-15',
    version: 'v4.2-2026',
    summary: 'Rules governing flight cancellations, severe weather diversions, re-accommodation and passenger amenities in compliance with DGCA CAR Section 3, Series M, Part IV.',
    sections: [
      {
        title: 'Section 4.1: Natural Disasters and Severe Weather Force Majeure',
        code: 'DGCA-CAR-M-IV-4.1',
        content: 'When flights are cancelled or diverted due to meteorological events beyond carrier control (cyclone, tropical depression, coastal gale warnings), passenger shall be offered either (a) full refund without cancellation penalty fees, or (b) free rebooking on the next available IndiGo flight within a 7-day window from the original travel date without fare differential.'
      },
      {
        title: 'Section 5.3: Connecting Flight Misconnections & Split Sectors',
        code: 'DGCA-CAR-M-IV-5.3',
        content: 'If an involuntary disruption on the first operating sector causes a misconnection on an itinerary booked under a single PNR, carrier is liable to provide immediate rerouting or hotel accommodation if onward connection exceeds 6 hours during night transit.'
      },
      {
        title: 'Section 8.2: Airport Disruption Refreshments & Communication',
        code: 'DGCA-CAR-M-IV-8.2',
        content: 'For delays exceeding 2 hours at the boarding gate, airline operations must provide light refreshments and complimentary hot beverages. Travellers holding corporate PNRs are eligible for lounge day passes where capacity permits.'
      }
    ]
  },
  {
    id: 'POL-AIRINDIA-01',
    title: 'Air India Operational Irregularity & Force Majeure Guidelines',
    supplier: 'Air India Ltd',
    category: 'Airlines',
    effectiveDate: '2026-02-01',
    version: 'v5.0-TATA',
    summary: 'Standard operating procedure for involuntary route disruptions, airport slot cancellations, and interline re-protection agreements.',
    sections: [
      {
        title: 'Section 3.2: Runway Maintenance & Involuntary Slot Cancellation',
        code: 'AI-SOP-OPS-3.2',
        content: 'In the event of civil aviation authority or airport operator NOTAM closures (e.g. runway resurfacing, ATC emergency halts), passengers are eligible for one complimentary date change without change fee or fare difference within +/- 3 days of original travel.'
      },
      {
        title: 'Section 6.4: Inter-Metro Alternate Rerouting Protocol',
        code: 'AI-SOP-OPS-6.4',
        content: 'When direct metro services (BOM-DEL or DEL-BLR) are restricted, operations desk is authorised to re-route via adjacent operational hubs (HYD, BLR, PNQ) or partner carriers under standard interline settlement agreements at zero surcharge.'
      },
      {
        title: 'Section 9.1: Premium & Executive Tier Protection Guarantee',
        code: 'AI-SOP-OPS-9.1',
        content: 'Maharaja Club Platinum and Corporate CXO passengers must receive priority waitlist clearing on subsequent scheduled services and guaranteed business cabin transfer where available.'
      }
    ]
  },
  {
    id: 'POL-TAJ-01',
    title: 'Taj Hotels & IHCL Severe Weather & Natural Disruption Waiver Protocol',
    supplier: 'The Indian Hotels Company Limited (IHCL)',
    category: 'Hotels',
    effectiveDate: '2025-11-20',
    version: 'v3.8',
    summary: 'Property guidelines for force majeure weather warnings, state disaster red alerts, and emergency guest relocations across Taj, Vivanta, and SeleQtions.',
    sections: [
      {
        title: 'Clause 2.1: District Collector / IMD Red Alert Penalty Waiver',
        code: 'IHCL-FM-2.1',
        content: 'Upon issuance of an official IMD Red Alert or District Collector emergency directive for coastal or hilly zones, all cancellation and retention charges are fully waived for direct and travel-agency bookings. Advance deposits will be converted to a 100% credit shell valid for 180 days or refunded upon request.'
      },
      {
        title: 'Clause 4.3: Intra-Group Sister Property Re-accommodation',
        code: 'IHCL-FM-4.3',
        content: 'If an IHCL property experiences infrastructure limits (beach closure, flooding, access cuts), guest reservations may be transferred to any sister IHCL hotel within the same state at room parity with zero surcharge for equivalent category.'
      },
      {
        title: 'Clause 7.2: Heritage & Coastal Room Safety Relocation',
        code: 'IHCL-FM-7.2',
        content: 'Guests occupying ground-level or beachfront villas during coastal cyclones shall be transferred to inland masonry main-building suites without tariff adjustment.'
      }
    ]
  },
  {
    id: 'POL-MMT-01',
    title: 'MakeMyTrip Agent B2B Force Majeure Standard Operating Procedure',
    supplier: 'MakeMyTrip Ltd (B2B Partner Operations)',
    category: 'Aggregator',
    effectiveDate: '2026-03-10',
    version: 'v6.1',
    summary: 'Operational mandate for partner travel agencies processing dynamic multi-supplier disruptions in the Indian domestic travel network.',
    sections: [
      {
        title: 'Standard Rule 1.4: Cross-Supplier Cascade Cancellation Clause',
        code: 'MMT-B2B-1.4',
        content: 'When the primary transport booking (flight or rail) is verified as cancelled due to an acknowledged force majeure incident, all tied non-refundable ground services (local transfers, pre-booked resort day passes) qualify for automatic zero-penalty waiver under the Cascade Protection Protocol.'
      },
      {
        title: 'Standard Rule 3.2: Immediate Alternative Thresholds and Budgets',
        code: 'MMT-B2B-3.2',
        content: 'Operations agents are pre-authorized to spend up to 25% above original total itinerary value to secure same-day alternative transport and lodging for stranded corporate travellers without secondary supervisor sign-off.'
      },
      {
        title: 'Standard Rule 5.1: Multi-Modal Transit Substitution',
        code: 'MMT-B2B-5.1',
        content: 'In sectors under 450 km where air corridors are grounded, operations staff may provision premium railway (Vande Bharat / Tejas Executive) or authorized private chauffeur transit, crediting the airfare differential to the corporate ledger.'
      }
    ]
  },
  {
    id: 'POL-IRCTC-01',
    title: 'IRCTC Executive & Premium Express Rescheduling and Full Refund Rules',
    supplier: 'Indian Railway Catering and Tourism Corporation Ltd',
    category: 'Railways',
    effectiveDate: '2026-01-01',
    version: 'v2026-R1',
    summary: 'Refund and tatkal emergency quotas for Vande Bharat, Tejas, and Rajdhani Express services during civil aviation disruptions.',
    sections: [
      {
        title: 'Rule 14-A: Transit Disruption Emergency Quota Allocation',
        code: 'IRCTC-EQ-14A',
        content: 'Recognised corporate travel agency desks may access Railway Emergency Quota (EQ) up to 4 hours prior to train departure for passengers stranded by certified airline cancellations, subject to berth availability in Executive Chair Car (EC) or 1st AC.'
      },
      {
        title: 'Rule 18-C: Automatic TDR Full Refund on Train Delays or Diversions',
        code: 'IRCTC-TDR-18C',
        content: 'If an express train is delayed by over 3 hours at boarding point due to route inundation, passenger is entitled to 100% fare refund upon filing Ticket Deposit Receipt (TDR) before actual departure, with zero clerkage fee.'
      },
      {
        title: 'Rule 22-B: Multi-Leg Connecting Ticket Protection',
        code: 'IRCTC-CONN-22B',
        content: 'Passengers holding linked PNRs where a preceding train or flight delay causes misconnection on the onward train receive full refund on the second ticket without cancellation deduction.'
      }
    ]
  },
  {
    id: 'POL-OBEROI-01',
    title: 'The Oberoi Group Structural Disruption & Alternative Booking Policy',
    supplier: 'EIH Limited (The Oberoi Group)',
    category: 'Hotels',
    effectiveDate: '2025-10-15',
    version: 'v2.9',
    summary: 'Protocols for partial hotel closures, heritage preservation inspections, and luxury sister-brand relocation agreements.',
    sections: [
      {
        title: 'Policy Art. 3: Statutory Inspection or Temporary Wing Closure',
        code: 'OBEROI-SOP-03',
        content: 'In case of civil authority inspections, structural preservation halts, or safety audits affecting guest accommodation wings, the hotel shall upgrade the guest to an unaffected higher category suite at zero fee or relocate the guest to an affiliated luxury partner property with complimentary private chauffeur transfers.'
      },
      {
        title: 'Policy Art. 5: Guest Goodwill Credit & Dining Compensations',
        code: 'OBEROI-SOP-05',
        content: 'Any involuntary room re-allocation entitles each registered guest to a complimentary fine-dining dinner experience and an INR 5,000 hotel spa/services credit per night of stay.'
      },
      {
        title: 'Policy Art. 8: Guaranteed Seamless B2B Ledger Settlement',
        code: 'OBEROI-SOP-08',
        content: 'All tariff adjustments between originally booked heritage suites and replacement luxury pavilions will be reconciled on the agency master credit account within 48 banking hours.'
      }
    ]
  },
  {
    id: 'POL-SPICEJET-01',
    title: 'SpiceJet Flight Delay, Cancellation & Route Divergence Protocol',
    supplier: 'SpiceJet Ltd',
    category: 'Airlines',
    effectiveDate: '2026-02-15',
    version: 'v3.4',
    summary: 'Guidelines for secondary hub diversions, coastal airport weather buffers, and passenger re-routing options.',
    sections: [
      {
        title: 'Section 2.4: Severe Weather Flight Cancellation and Re-booking',
        code: 'SG-DISRUPT-2.4',
        content: 'Passengers whose flights are cancelled due to adverse weather advisories may opt for full refund without fee or rebooking on any subsequent SpiceJet flight within 5 days on the same sector or adjacent co-terminals (e.g., GOI vs GOX).'
      },
      {
        title: 'Section 4.2: Diverted Aircraft Passenger Transportation',
        code: 'SG-DISRUPT-4.2',
        content: 'If an aircraft is diverted to an alternate airport (e.g. diverted to BLR or HYD), airline will either operate ferry continuation upon weather clearance or arrange air-conditioned coach transportation to the final destination point.'
      },
      {
        title: 'Section 7.1: Connecting Flight Delay Over 3 Hours',
        code: 'SG-DISRUPT-7.1',
        content: 'If a delayed feeder flight results in missed onward connection exceeding 3 hours, passenger is provided hot meals and priority re-booking on the earliest departure.'
      }
    ]
  },
  {
    id: 'POL-VISTARA-01',
    title: 'Vistara / Air India Integration Emergency Re-accommodation Protocol',
    supplier: 'Tata SIA Airlines / Air India Group',
    category: 'Airlines',
    effectiveDate: '2026-03-01',
    version: 'v4.0-MERGER',
    summary: 'Unified disruption handling across legacy UK and AI flights during joint operation transition.',
    sections: [
      {
        title: 'Section 1.1: Cross-Inventory Seat Protection',
        code: 'TATA-CROSS-1.1',
        content: 'Disrupted passengers booked on either UK or AI flight codes are authorized for mutual cross-inventory rebooking at zero differential, retaining original cabin class and baggage privileges across both fleets.'
      },
      {
        title: 'Section 3.5: Terminal 3 Delhi Ground Irregularities Management',
        code: 'TATA-DEL-3.5',
        content: 'In instances of ground staff shortages, ramp handling delays, or tanker strikes at DEL Terminal 3, passengers delayed beyond 90 minutes may switch to earlier departing code-share flights without change fee at express transfer counters.'
      },
      {
        title: 'Section 5.8: High-Priority Corporate Itinerary Rescue',
        code: 'TATA-CORP-5.8',
        content: 'Corporate Platinum and Gold accounts whose flights are stranded must be offered telephonic consultation by dedicated ops desk within 20 minutes of flight cancellation notice.'
      }
    ]
  }
];

export const INITIAL_EVIDENCE_SNIPPETS: EvidenceSnippet[] = [
  // For Incident 1 (Cyclonic Storm Goa)
  {
    id: 'SNIP-01',
    citationIndex: 1,
    documentId: 'POL-INDIGO-01',
    documentTitle: 'IndiGo Passenger Disruption Charter (DGCA CAR Sec 3)',
    supplier: 'IndiGo Airlines',
    section: 'Section 4.1: Natural Disasters and Severe Weather Force Majeure',
    relevanceScore: 0.98,
    excerpt: 'When flights are cancelled or diverted due to meteorological events beyond carrier control (cyclone, tropical depression, coastal gale warnings), passenger shall be offered either (a) full refund without cancellation penalty fees, or (b) free rebooking on the next available IndiGo flight within a 7-day window without fare differential.',
    regulationCode: 'DGCA-CAR-M-IV-4.1'
  },
  {
    id: 'SNIP-02',
    citationIndex: 2,
    documentId: 'POL-TAJ-01',
    documentTitle: 'Taj Hotels & IHCL Severe Weather & Natural Disruption Waiver Protocol',
    supplier: 'The Indian Hotels Company Limited',
    section: 'Clause 2.1: District Collector / IMD Red Alert Penalty Waiver',
    relevanceScore: 0.96,
    excerpt: 'Upon issuance of an official IMD Red Alert or District Collector emergency directive for coastal or hilly zones, all cancellation and retention charges are fully waived for direct and travel-agency bookings. Advance deposits will be converted to a 100% credit shell valid for 180 days or refunded upon request.',
    regulationCode: 'IHCL-FM-2.1'
  },
  {
    id: 'SNIP-03',
    citationIndex: 3,
    documentId: 'POL-MMT-01',
    documentTitle: 'MakeMyTrip Agent B2B Force Majeure Standard Operating Procedure',
    supplier: 'MakeMyTrip Ltd',
    section: 'Standard Rule 1.4: Cross-Supplier Cascade Cancellation Clause',
    relevanceScore: 0.93,
    excerpt: 'When the primary transport booking is verified as cancelled due to an acknowledged force majeure incident, all tied non-refundable ground services (local transfers, pre-booked resort day passes) qualify for automatic zero-penalty waiver under the Cascade Protection Protocol.',
    regulationCode: 'MMT-B2B-1.4'
  },
  {
    id: 'SNIP-04',
    citationIndex: 4,
    documentId: 'POL-AIRINDIA-01',
    documentTitle: 'Air India Operational Irregularity & Force Majeure Guidelines',
    supplier: 'Air India Ltd',
    section: 'Section 6.4: Inter-Metro Alternate Rerouting Protocol',
    relevanceScore: 0.89,
    excerpt: 'When direct services are restricted, operations desk is authorised to re-route via adjacent operational hubs or partner carriers under standard interline settlement agreements at zero surcharge.',
    regulationCode: 'AI-SOP-OPS-6.4'
  },
  {
    id: 'SNIP-05',
    citationIndex: 5,
    documentId: 'POL-SPICEJET-01',
    documentTitle: 'SpiceJet Flight Delay, Cancellation & Route Divergence Protocol',
    supplier: 'SpiceJet Ltd',
    section: 'Section 2.4: Severe Weather Flight Cancellation and Re-booking',
    relevanceScore: 0.86,
    excerpt: 'Passengers whose flights are cancelled due to adverse weather advisories may opt for rebooking on any subsequent flight within 5 days on adjacent co-terminals (e.g. GOI vs GOX Mopa).',
    regulationCode: 'SG-DISRUPT-2.4'
  },

  // For Incident 2 (Runway Resurfacing Mumbai)
  {
    id: 'SNIP-06',
    citationIndex: 6,
    documentId: 'POL-AIRINDIA-01',
    documentTitle: 'Air India Operational Irregularity & Force Majeure Guidelines',
    supplier: 'Air India Ltd',
    section: 'Section 3.2: Runway Maintenance & Involuntary Slot Cancellation',
    relevanceScore: 0.97,
    excerpt: 'In the event of civil aviation authority or airport operator NOTAM closures (runway resurfacing, ATC emergency halts), passengers are eligible for one complimentary date change without change fee or fare difference within +/- 3 days of original travel.',
    regulationCode: 'AI-SOP-OPS-3.2'
  },
  {
    id: 'SNIP-07',
    citationIndex: 7,
    documentId: 'POL-IRCTC-01',
    documentTitle: 'IRCTC Executive & Premium Express Rescheduling and Full Refund Rules',
    supplier: 'Indian Railway Catering and Tourism Corporation Ltd',
    section: 'Rule 14-A: Transit Disruption Emergency Quota Allocation',
    relevanceScore: 0.91,
    excerpt: 'Recognised corporate travel agency desks may access Railway Emergency Quota (EQ) up to 4 hours prior to train departure for passengers stranded by certified airline cancellations, subject to berth availability in Executive Chair Car (EC).',
    regulationCode: 'IRCTC-EQ-14A'
  },
  {
    id: 'SNIP-08',
    citationIndex: 8,
    documentId: 'POL-MMT-01',
    documentTitle: 'MakeMyTrip Agent B2B Force Majeure Standard Operating Procedure',
    supplier: 'MakeMyTrip Ltd',
    section: 'Standard Rule 5.1: Multi-Modal Transit Substitution',
    relevanceScore: 0.88,
    excerpt: 'In sectors under 450 km where air corridors are grounded, operations staff may provision premium railway (Vande Bharat / Tejas Executive) or authorized private chauffeur transit, crediting the airfare differential to the corporate ledger.',
    regulationCode: 'MMT-B2B-5.1'
  },

  // For Incident 3 (Heritage Property Jaipur)
  {
    id: 'SNIP-09',
    citationIndex: 9,
    documentId: 'POL-OBEROI-01',
    documentTitle: 'The Oberoi Group Structural Disruption & Alternative Booking Policy',
    supplier: 'The Oberoi Group',
    section: 'Policy Art. 3: Statutory Inspection or Temporary Wing Closure',
    relevanceScore: 0.95,
    excerpt: 'In case of civil authority inspections, structural preservation halts, or safety audits affecting guest accommodation wings, the hotel shall upgrade the guest to an unaffected higher category suite at zero fee or relocate the guest to an affiliated luxury partner property with complimentary private chauffeur transfers.',
    regulationCode: 'OBEROI-SOP-03'
  },
  {
    id: 'SNIP-10',
    citationIndex: 10,
    documentId: 'POL-TAJ-01',
    documentTitle: 'Taj Hotels & IHCL Severe Weather & Natural Disruption Waiver Protocol',
    supplier: 'The Indian Hotels Company Limited',
    section: 'Clause 4.3: Intra-Group Sister Property Re-accommodation',
    relevanceScore: 0.92,
    excerpt: 'If an IHCL property experiences infrastructure limits, guest reservations may be transferred to any sister IHCL hotel within the same state at room parity with zero surcharge for equivalent category.',
    regulationCode: 'IHCL-FM-4.3'
  },

  // For Incident 4 (Kerala Flood & Road Inundation)
  {
    id: 'SNIP-11',
    citationIndex: 11,
    documentId: 'POL-TAJ-01',
    documentTitle: 'Taj Hotels & IHCL Severe Weather & Natural Disruption Waiver Protocol',
    supplier: 'The Indian Hotels Company Limited',
    section: 'Clause 2.1: District Collector / IMD Red Alert Penalty Waiver',
    relevanceScore: 0.96,
    excerpt: 'Upon issuance of an official IMD Red Alert or District Collector emergency directive for coastal or hilly zones, all cancellation and retention charges are fully waived for direct and travel-agency bookings.',
    regulationCode: 'IHCL-FM-2.1'
  },
  {
    id: 'SNIP-12',
    citationIndex: 12,
    documentId: 'POL-MMT-01',
    documentTitle: 'MakeMyTrip Agent B2B Force Majeure Standard Operating Procedure',
    supplier: 'MakeMyTrip Ltd',
    section: 'Standard Rule 1.4: Cross-Supplier Cascade Cancellation Clause',
    relevanceScore: 0.94,
    excerpt: 'When the primary transport booking is verified as cancelled due to an acknowledged force majeure incident, all tied non-refundable ground services qualify for automatic zero-penalty waiver under the Cascade Protection Protocol.',
    regulationCode: 'MMT-B2B-1.4'
  },

  // For Incident 5 (Delhi T3 Ground Stoppage)
  {
    id: 'SNIP-13',
    citationIndex: 13,
    documentId: 'POL-VISTARA-01',
    documentTitle: 'Vistara / Air India Integration Emergency Re-accommodation Protocol',
    supplier: 'Tata SIA Airlines / Air India Group',
    section: 'Section 3.5: Terminal 3 Delhi Ground Irregularities Management',
    relevanceScore: 0.95,
    excerpt: 'In instances of ground staff shortages, ramp handling delays, or tanker strikes at DEL Terminal 3, passengers delayed beyond 90 minutes may switch to earlier departing code-share flights without change fee at express transfer counters.',
    regulationCode: 'TATA-DEL-3.5'
  },
  {
    id: 'SNIP-14',
    citationIndex: 14,
    documentId: 'POL-AIRINDIA-01',
    documentTitle: 'Air India Operational Irregularity & Force Majeure Guidelines',
    supplier: 'Air India Ltd',
    section: 'Section 9.1: Premium & Executive Tier Protection Guarantee',
    relevanceScore: 0.91,
    excerpt: 'Maharaja Club Platinum and Corporate CXO passengers must receive priority waitlist clearing on subsequent scheduled services and guaranteed business cabin transfer where available.',
    regulationCode: 'AI-SOP-OPS-9.1'
  }
];

export const INITIAL_RECOVERY_PLANS: RecoveryPlan[] = [
  // Incident 1: Rohan Sharma (TRV-101)
  {
    id: 'PLAN-101-A',
    incidentId: 'INC-2026-0841',
    travellerId: 'TRV-101',
    planLabel: 'Option A',
    title: 'Reroute to Mopa North Goa (GOX) + Taj Fort Aguada Transfer',
    itineraryChanges: [
      {
        bookingId: 'BKG-201',
        changeType: 'Alternative Provider',
        originalDetails: 'IndiGo 6E-241 DEL to GOI (Dabolim 14:10)',
        proposedDetails: 'IndiGo 6E-6102 DEL to GOX (Mopa North Goa 15:20)'
      },
      {
        bookingId: 'BKG-202',
        changeType: 'Room Reallocated',
        originalDetails: 'Taj Exotica Benaulim (South Goa coastal alert zone)',
        proposedDetails: 'Taj Fort Aguada Resort Sinquerim (North Goa protected hillside wing)'
      }
    ],
    costDifferenceINR: 1850,
    withinBudget: true,
    budgetDifferenceINR: 23150,
    preferenceMatchScore: 92,
    preferenceSummary: 'Maintains vegetarian meal, forward cabin aisle seat; relocates away from South Goa red-alert shoreline.',
    rationale: 'IndiGo disruption charter Section 4.1 [1] permits co-terminal rerouting DEL-GOX without fare differential. Taj Hotels Clause 4.3 [2] authorizes sister-resort reallocation to Taj Fort Aguada at zero tariff penalty during IMD coastal gale warnings.',
    status: 'Pending'
  },
  {
    id: 'PLAN-101-B',
    incidentId: 'INC-2026-0841',
    travellerId: 'TRV-101',
    planLabel: 'Option B',
    title: 'Postpone Departure 48 Hours + Retain Original Taj Exotica Booking',
    itineraryChanges: [
      {
        bookingId: 'BKG-201',
        changeType: 'Rescheduled',
        originalDetails: 'IndiGo 6E-241 on 10 Oct 14:10',
        proposedDetails: 'IndiGo 6E-241 on 12 Oct 14:10 (Post-cyclone calm window)'
      },
      {
        bookingId: 'BKG-202',
        changeType: 'Rescheduled',
        originalDetails: 'Taj Exotica 10-13 Oct (3 Nights)',
        proposedDetails: 'Taj Exotica 12-15 Oct (3 Nights, dates shifted forward)'
      }
    ],
    costDifferenceINR: 0,
    withinBudget: true,
    budgetDifferenceINR: 25000,
    preferenceMatchScore: 84,
    preferenceSummary: 'Preserves exact resort and room class; delays travel by 2 business days.',
    rationale: 'Complies with DGCA CAR Section 3 Part IV [1] 7-day zero-fee date modification window and Taj Hotels 180-day credit shift rule [2]. Complete cost neutrality with zero out-of-pocket surcharge.',
    status: 'Pending'
  },
  {
    id: 'PLAN-101-C',
    incidentId: 'INC-2026-0841',
    travellerId: 'TRV-101',
    planLabel: 'Option C',
    title: 'Full Cancellation with 100% Force Majeure Refund & Agency Credit Shell',
    itineraryChanges: [
      {
        bookingId: 'BKG-201',
        changeType: 'Full Refund & Cancel',
        originalDetails: 'IndiGo 6E-241 (₹8,450 paid)',
        proposedDetails: 'Immediate 100% refund credited to corporate account'
      },
      {
        bookingId: 'BKG-202',
        changeType: 'Full Refund & Cancel',
        originalDetails: 'Taj Exotica (₹36,000 paid)',
        proposedDetails: '100% cash refund / credit voucher issued under disaster waiver'
      }
    ],
    costDifferenceINR: -44450,
    withinBudget: true,
    budgetDifferenceINR: 25000,
    preferenceMatchScore: 60,
    preferenceSummary: 'Cancels mission entirely; zero travel incurred.',
    rationale: 'Fully supported by DGCA CAR Section 4.1 [1] and Taj Force Majeure Clause 2.1 [2]. Cascade waiver applies to all booking fees under MMT B2B SOP 1.4 [3].',
    status: 'Pending'
  },

  // Incident 1: Ananya Iyer (TRV-102)
  {
    id: 'PLAN-102-A',
    incidentId: 'INC-2026-0841',
    travellerId: 'TRV-102',
    planLabel: 'Option A',
    title: 'Switch to Air India Evening Departure AI-810 + Alila Diwa Safe Wing',
    itineraryChanges: [
      {
        bookingId: 'BKG-203',
        changeType: 'Rescheduled',
        originalDetails: 'Air India AI-804 BLR to GOX (15:30 IST)',
        proposedDetails: 'Air India AI-810 BLR to GOX (20:45 IST, after wind peak)'
      },
      {
        bookingId: 'BKG-204',
        changeType: 'Room Reallocated',
        originalDetails: 'Alila Diwa South Goa Beach Wing',
        proposedDetails: 'Alila Diwa Courtyard Inland Wing (ground safety clearance)'
      }
    ],
    costDifferenceINR: 0,
    withinBudget: true,
    budgetDifferenceINR: 18000,
    preferenceMatchScore: 90,
    preferenceSummary: 'Secures window seat on rescheduled flight, retains South Indian vegetarian meal request.',
    rationale: 'Air India Section 3.2 [6] and IndiGo/DGCA policy [1] mandate zero change penalty. Hotel accommodates safety relocation under standard coastal hospitality protocols [2].',
    status: 'Pending'
  },
  {
    id: 'PLAN-102-B',
    incidentId: 'INC-2026-0841',
    travellerId: 'TRV-102',
    planLabel: 'Option B',
    title: 'Reroute to Cochin (COK) + Kumarakom Leisure Resort Alternative',
    itineraryChanges: [
      {
        bookingId: 'BKG-203',
        changeType: 'Route Diverted',
        originalDetails: 'BLR to Goa GOX',
        proposedDetails: 'Air India AI-507 BLR to COK (16:15 IST) + Chauffeur'
      },
      {
        bookingId: 'BKG-204',
        changeType: 'Alternative Provider',
        originalDetails: 'Alila Diwa Goa (₹24,000)',
        proposedDetails: 'Grand Hyatt Kochi Bolgatty (₹22,800, unaffected weather zone)'
      }
    ],
    costDifferenceINR: -1200,
    withinBudget: true,
    budgetDifferenceINR: 18000,
    preferenceMatchScore: 78,
    preferenceSummary: 'Substitutes destination to sunny central Kerala; within corporate budget.',
    rationale: 'Inter-metro diversion authorized under Air India SOP 6.4 [4]. Goa hotel advance converted to credit shell under IHCL / MMT cascade clause [2][3].',
    status: 'Pending'
  },

  // Incident 1: Vikram Malhotra (TRV-103)
  {
    id: 'PLAN-103-A',
    incidentId: 'INC-2026-0841',
    travellerId: 'TRV-103',
    planLabel: 'Option A',
    title: 'Air India Business Class AI-671 BOM-GOX + Taj Fort Aguada Villa',
    itineraryChanges: [
      {
        bookingId: 'BKG-205',
        changeType: 'Alternative Provider',
        originalDetails: 'Akasa Air QP-1302 BOM to GOI Economy (13:00 IST)',
        proposedDetails: 'Air India AI-671 BOM to GOX Business Cabin (16:40 IST)'
      },
      {
        bookingId: 'BKG-206',
        changeType: 'Route Diverted',
        originalDetails: 'Dabolim to ITC Grand SUV via NH66',
        proposedDetails: 'Mopa Express Highway Protected Armoured Transfer to Aguada'
      }
    ],
    costDifferenceINR: 6400,
    withinBudget: true,
    budgetDifferenceINR: 33600,
    preferenceMatchScore: 98,
    preferenceSummary: 'Restores Business class 1A seat, priority baggage, executive desk handling.',
    rationale: 'Air India CXO protocol Section 9.1 [14] and MMT B2B budget rule 3.2 [8] pre-authorise up to 25% premium for executive continuity. Full refund on cancelled Akasa flight claimed under DGCA [1].',
    status: 'Pending'
  },
  {
    id: 'PLAN-103-B',
    incidentId: 'INC-2026-0841',
    travellerId: 'TRV-103',
    planLabel: 'Option B',
    title: 'Executive Virtual Participation + Full Reschedule to 18 October',
    itineraryChanges: [
      {
        bookingId: 'BKG-205',
        changeType: 'Rescheduled',
        originalDetails: 'Akasa QP-1302 on 10 Oct',
        proposedDetails: 'Shift to 18 Oct meeting slot with zero fee'
      },
      {
        bookingId: 'BKG-206',
        changeType: 'Full Refund & Cancel',
        originalDetails: 'Transfer BKG-206',
        proposedDetails: 'Full refund under force majeure cascade clause'
      }
    ],
    costDifferenceINR: -3200,
    withinBudget: true,
    budgetDifferenceINR: 40000,
    preferenceMatchScore: 82,
    preferenceSummary: 'Eliminates travel safety hazard entirely; preserves business agenda remotely.',
    rationale: 'Cascade cancellation rule MMT-B2B-1.4 [3] applies to private chauffeur. Airline fee waived under DGCA [1].',
    status: 'Pending'
  },

  // Incident 1: Priya Patel (TRV-104)
  {
    id: 'PLAN-104-A',
    incidentId: 'INC-2026-0841',
    travellerId: 'TRV-104',
    planLabel: 'Option A',
    title: 'IndiGo Direct AMD to GOX (Mopa) + North Goa Courtyard',
    itineraryChanges: [
      {
        bookingId: 'BKG-207',
        changeType: 'Alternative Provider',
        originalDetails: 'IndiGo 6E-512 via BOM (Grounded connection)',
        proposedDetails: 'IndiGo 6E-7201 Direct AMD to GOX (17:15 IST)'
      },
      {
        bookingId: 'BKG-224',
        changeType: 'Room Reallocated',
        originalDetails: 'Goa Marriott Miramar (Flood barrier alert)',
        proposedDetails: 'Courtyard by Marriott North Goa Colvale (Elevated inland)'
      }
    ],
    costDifferenceINR: 950,
    withinBudget: true,
    budgetDifferenceINR: 14050,
    preferenceMatchScore: 94,
    preferenceSummary: 'Maintains Jain vegetarian meal, eliminates risky Mumbai transit stop.',
    rationale: 'IndiGo misconnection policy 5.3 [1] covers direct rebooking without differential. Marriott inland room re-allocation processed without penalty under disaster protocol [2].',
    status: 'Pending'
  },
  {
    id: 'PLAN-104-B',
    incidentId: 'INC-2026-0841',
    travellerId: 'TRV-104',
    planLabel: 'Option B',
    title: 'Reschedule to Next Weekend (17-19 Oct) + Retain Miramar Sea View',
    itineraryChanges: [
      {
        bookingId: 'BKG-207',
        changeType: 'Rescheduled',
        originalDetails: '10 Oct Travel',
        proposedDetails: '17 Oct Travel on identical flight numbers'
      },
      {
        bookingId: 'BKG-224',
        changeType: 'Rescheduled',
        originalDetails: '10-12 Oct Miramar Stay',
        proposedDetails: '17-19 Oct Miramar Stay'
      }
    ],
    costDifferenceINR: 0,
    withinBudget: true,
    budgetDifferenceINR: 15000,
    preferenceMatchScore: 88,
    preferenceSummary: 'Full itinerary shift by 7 days; cost neutral.',
    rationale: 'DGCA CAR 7-day rule [1] guarantees free date shift. Hotel accepts shift under force majeure waiver [2].',
    status: 'Pending'
  },

  // Incident 2: Rajesh Verma (TRV-105)
  {
    id: 'PLAN-105-A',
    incidentId: 'INC-2026-0842',
    travellerId: 'TRV-105',
    planLabel: 'Option A',
    title: 'Tejas Rajdhani Express 1st AC (BOM to NDLS) Substitution',
    itineraryChanges: [
      {
        bookingId: 'BKG-208',
        changeType: 'Alternative Provider',
        originalDetails: 'Air India AI-630 BOM to DEL Flight (Cancelled by NOTAM)',
        proposedDetails: 'IRCTC 12951 Tejas Rajdhani 1st AC (Departs 17:00 IST Mumbai Central)'
      }
    ],
    costDifferenceINR: -3800,
    withinBudget: true,
    budgetDifferenceINR: 20000,
    preferenceMatchScore: 88,
    preferenceSummary: 'Traveller preference permits premium rail. Arrives New Delhi 08:30 next morning; hotel check-in at Leela Gurugram retained.',
    rationale: 'Multi-modal transit substitution under MMT Rule 5.1 [8] and IRCTC Emergency Quota Rule 14-A [7]. Air India full refund claimed under NOTAM clause AI-SOP-3.2 [6]. Net savings of ₹3,800 returned to corporate budget.',
    status: 'Pending'
  },
  {
    id: 'PLAN-105-B',
    incidentId: 'INC-2026-0842',
    travellerId: 'TRV-105',
    planLabel: 'Option B',
    title: 'Air India Morning Rebooking AI-864 on 11 Oct 07:00 IST',
    itineraryChanges: [
      {
        bookingId: 'BKG-208',
        changeType: 'Rescheduled',
        originalDetails: 'Air India AI-630 on 10 Oct 17:00 IST',
        proposedDetails: 'Air India AI-864 on 11 Oct 07:00 IST (First wave slot)'
      }
    ],
    costDifferenceINR: 0,
    withinBudget: true,
    budgetDifferenceINR: 20000,
    preferenceMatchScore: 76,
    preferenceSummary: 'Requires overnight stay in Mumbai; misses morning meeting in Gurugram.',
    rationale: 'Air India NOTAM policy 3.2 [6] allows complimentary flight transfer. Traveller requires transit accommodation near BOM.',
    status: 'Pending'
  },

  // Incident 3: Kavita Sen (TRV-108)
  {
    id: 'PLAN-108-A',
    incidentId: 'INC-2026-0843',
    travellerId: 'TRV-108',
    planLabel: 'Option A',
    title: 'Upgrade to Rambagh Palace Garden Wing Suite + Step-Free Access',
    itineraryChanges: [
      {
        bookingId: 'BKG-213',
        changeType: 'Room Reallocated',
        originalDetails: 'Rambagh Palace Heritage Suite (Closed by Municipal Safety Order)',
        proposedDetails: 'Rambagh Palace Maharaja Garden Pavilion Suite (Unaffected ground wing)'
      }
    ],
    costDifferenceINR: 0,
    withinBudget: true,
    budgetDifferenceINR: 22000,
    preferenceMatchScore: 96,
    preferenceSummary: 'Guarantees step-free garden pavilion access for elderly parent; complimentary dining credits.',
    rationale: 'The Oberoi / Taj statutory inspection protocol [9][10] mandates complimentary suite upgrade to unaffected wing at zero guest surcharge. Heritage tour itinerary BKG-214 remains completely on schedule.',
    status: 'Pending'
  },
  {
    id: 'PLAN-108-B',
    incidentId: 'INC-2026-0843',
    travellerId: 'TRV-108',
    planLabel: 'Option B',
    title: 'Relocate to The Oberoi Rajvilas Luxury Villa with Private Chauffeur',
    itineraryChanges: [
      {
        bookingId: 'BKG-213',
        changeType: 'Alternative Provider',
        originalDetails: 'Rambagh Palace Jaipur (₹52,000)',
        proposedDetails: 'The Oberoi Rajvilas Premier Room with Garden (₹54,000 negotiated parity)'
      }
    ],
    costDifferenceINR: 0,
    withinBudget: true,
    budgetDifferenceINR: 22000,
    preferenceMatchScore: 92,
    preferenceSummary: 'Luxury resort setting with golf cart mobility; family room layout.',
    rationale: 'Authorized under Oberoi Sop Art 3 [9] sister-luxury partnership agreement with direct agency ledger settlement [9].',
    status: 'Pending'
  },

  // Incident 4: Arvind Swaminathan (TRV-109)
  {
    id: 'PLAN-109-A',
    incidentId: 'INC-2026-0844',
    travellerId: 'TRV-109',
    planLabel: 'Option A',
    title: 'Reroute to Fort Kochi Heritage Stay (Bypassing Munnar Hill Blockade)',
    itineraryChanges: [
      {
        bookingId: 'BKG-217',
        changeType: 'Route Diverted',
        originalDetails: 'Cab COK to Munnar Ghat Road (Inundated)',
        proposedDetails: 'Airport Chauffeur to Fort Kochi Brunton Boatyard (NH-66 clear)'
      },
      {
        bookingId: 'BKG-218',
        changeType: 'Alternative Provider',
        originalDetails: 'Windermere Estate Munnar (₹26,000 inaccessible)',
        proposedDetails: 'Brunton Boatyard CGH Earth Fort Kochi (₹24,500)'
      }
    ],
    costDifferenceINR: -1500,
    withinBudget: true,
    budgetDifferenceINR: 22000,
    preferenceMatchScore: 86,
    preferenceSummary: 'Avoids landslide hazard; high-speed Wi-Fi, South Indian vegetarian cuisine.',
    rationale: 'KSDMA Red Alert triggers IHCL / MMT force majeure waiver [11][12]. 100% credit shell on Munnar booking applied towards coastal Fort Kochi partner property.',
    status: 'Pending'
  },

  // Incident 5: Deepa Dasgupta (TRV-112)
  {
    id: 'PLAN-112-A',
    incidentId: 'INC-2026-0845',
    travellerId: 'TRV-112',
    planLabel: 'Option A',
    title: 'Switch to Code-Share UK-817 (Vistara Business DEL to BLR 19:15)',
    itineraryChanges: [
      {
        bookingId: 'BKG-221',
        changeType: 'Alternative Provider',
        originalDetails: 'Air India AI-102 (Delayed indefinitely by tanker stoppage)',
        proposedDetails: 'Vistara UK-817 T3 Priority Handled (19:15 IST, fueled prior to strike)'
      }
    ],
    costDifferenceINR: 0,
    withinBudget: true,
    budgetDifferenceINR: 35000,
    preferenceMatchScore: 98,
    preferenceSummary: 'Business cabin row 2, sparkling water request confirmed, arrives Bengaluru before 22:00.',
    rationale: 'Governed by Tata SIA Emergency Protocol Section 3.5 [13] and Air India CXO protection [14]. Express transfer counter switch without reissue fees.',
    status: 'Pending'
  }
];

export const INITIAL_AGENT_STEPS: AgentStep[] = [
  {
    step: 1,
    name: 'Detect',
    timestamp: '2026-10-10 06:15:22 IST',
    status: 'Completed',
    durationMs: 340,
    details: 'Automated ingest parsed IMD Cyclone Warning Centre bulletin #SW-44. Classifier flagged coastal wind alert with 98.2% confidence (Entity: GOA_COASTAL_SECTOR).',
    payloadSummary: '{"feed": "IMD_RSS_SOUTH_WEST", "bulletin_id": "SW-44", "wind_kts": 65, "alert_level": "RED"}'
  },
  {
    step: 2,
    name: 'Identify affected',
    timestamp: '2026-10-10 06:15:24 IST',
    status: 'Completed',
    durationMs: 780,
    details: 'Queried agency PNR graph in Neo4j. Discovered 4 active travellers, 7 booked segments (3 flights, 3 hotels, 1 transfer) intersecting South Goa within 36-hour operational window.',
    payloadSummary: '{"affected_travellers": ["TRV-101", "TRV-102", "TRV-103", "TRV-104"], "pnr_count": 7, "financial_exposure_inr": 118850}'
  },
  {
    step: 3,
    name: 'Retrieve policies',
    timestamp: '2026-10-10 06:15:26 IST',
    status: 'Completed',
    durationMs: 620,
    details: 'Dense vector retrieval with BGE-reranker across 8 supplier contracts. Matched DGCA CAR Section 3 (score: 0.98), IHCL Red Alert Waiver (score: 0.96), and MMT Cascade Protocol (score: 0.93).',
    payloadSummary: '{"snippets_retrieved": 5, "top_doc": "POL-INDIGO-01", "min_relevance_threshold": 0.85}'
  },
  {
    step: 4,
    name: 'Evaluate alternatives',
    timestamp: '2026-10-10 06:15:28 IST',
    status: 'Completed',
    durationMs: 1150,
    details: 'Polled live inventory for Mopa (GOX) vs Dabolim (GOI). Evaluated co-terminal reroutes, inland hotel sister properties, and postponement horizons. Filtered out routes with unsafe transit links.',
    payloadSummary: '{"inventory_probed": ["GOX_INDIGO", "TAJ_FORT_AGUADA", "ALILA_INLAND"], "candidates_generated": 8, "feasible_candidates": 7}'
  },
  {
    step: 5,
    name: 'Compare costs',
    timestamp: '2026-10-10 06:15:30 IST',
    status: 'Completed',
    durationMs: 490,
    details: 'Computed gross fare adjustments minus statutory force majeure fee waivers. Validated each candidate against individual traveller disruption budget thresholds and corporate per-diems.',
    payloadSummary: '{"cost_deltas": {"TRV-101_A": 1850, "TRV-102_A": 0, "TRV-103_A": 6400, "TRV-104_A": 950}, "all_within_budget": true}'
  },
  {
    step: 6,
    name: 'Draft plan',
    timestamp: '2026-10-10 06:15:31 IST',
    status: 'Completed',
    durationMs: 820,
    details: 'Generated 7 structured recovery options across 4 travellers. Synthesized operational rationales citing policy clauses [1], [2], [3]. Queued for Operations Staff approval.',
    payloadSummary: '{"status": "AWAITING_HUMAN_APPROVAL", "total_options": 7, "auto_dispatch": false}'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-0841',
    type: 'Severe Cyclonic Storm Alert (IMD Warning)',
    location: 'South Goa & Dabolim/Mopa Coast',
    coordinates: '15.3800° N, 73.8314° E',
    severity: 'Critical',
    detectedTime: '2026-10-10 06:15 IST',
    status: 'Active Investigation',
    source: 'IMD Cyclone Warning Centre bulletin #SW-44',
    classifierConfidence: 98.2,
    affectedTravellerIds: ['TRV-101', 'TRV-102', 'TRV-103', 'TRV-104'],
    affectedBookingIds: ['BKG-201', 'BKG-202', 'BKG-203', 'BKG-204', 'BKG-205', 'BKG-206', 'BKG-207'],
    evidenceSnippetIds: ['SNIP-01', 'SNIP-02', 'SNIP-03', 'SNIP-04', 'SNIP-05'],
    agentSteps: INITIAL_AGENT_STEPS,
    summary: 'Deep depression in Arabian Sea intensified to severe cyclonic storm approaching South Goa coast. Gusts up to 65 kts, Dabolim airport runway suspension issued, sea surge affecting coastal resorts.'
  },
  {
    id: 'INC-2026-0842',
    type: 'Runway Emergency Resurfacing & Slot Suspension',
    location: 'Mumbai Chhatrapati Shivaji Maharaj Intl (BOM)',
    coordinates: '19.0896° N, 72.8656° E',
    severity: 'High',
    detectedTime: '2026-10-10 08:30 IST',
    status: 'In Recovery',
    source: 'DGCA NOTAM A1492/26 & MIAL Ops Bulletin',
    classifierConfidence: 96.5,
    affectedTravellerIds: ['TRV-105', 'TRV-106', 'TRV-107'],
    affectedBookingIds: ['BKG-208', 'BKG-209', 'BKG-210', 'BKG-211', 'BKG-212'],
    evidenceSnippetIds: ['SNIP-06', 'SNIP-07', 'SNIP-08'],
    agentSteps: [
      {
        step: 1,
        name: 'Detect',
        timestamp: '2026-10-10 08:30:10 IST',
        status: 'Completed',
        durationMs: 290,
        details: 'Ingested DGCA NOTAM A1492/26 regarding emergency tarmac repair on primary runway 09/27 at Mumbai BOM.'
      },
      {
        step: 2,
        name: 'Identify affected',
        timestamp: '2026-10-10 08:30:12 IST',
        status: 'Completed',
        durationMs: 640,
        details: 'Matched 3 travellers with flight movements through Mumbai during the 6-hour closure window.'
      },
      {
        step: 3,
        name: 'Retrieve policies',
        timestamp: '2026-10-10 08:30:14 IST',
        status: 'Completed',
        durationMs: 510,
        details: 'Extracted NOTAM involuntary slot rules from Air India SOP and IRCTC railway emergency quota clauses.'
      },
      {
        step: 4,
        name: 'Evaluate alternatives',
        timestamp: '2026-10-10 08:30:16 IST',
        status: 'Completed',
        durationMs: 890,
        details: 'Checked Tejas Rajdhani Express 1st AC availability and next morning early departure slots.'
      },
      {
        step: 5,
        name: 'Compare costs',
        timestamp: '2026-10-10 08:30:18 IST',
        status: 'Completed',
        durationMs: 420,
        details: 'Calculated flight refund credits vs premium railway ticketing. Resulted in positive cash savings.'
      },
      {
        step: 6,
        name: 'Draft plan',
        timestamp: '2026-10-10 08:30:19 IST',
        status: 'Completed',
        durationMs: 650,
        details: 'Drafted 2 options for affected travellers with full policy citations.'
      }
    ],
    summary: 'Secondary runway maintenance extended unexpectedly; main runway 09/27 closed for 6 hours. Heavy departure delays and cancellation of short-haul domestic flights.'
  },
  {
    id: 'INC-2026-0843',
    type: 'Structural Safety Order & Heritage Wing Closure',
    location: 'The Leela Palace & Rambagh Area, Jaipur',
    coordinates: '26.9124° N, 75.7873° E',
    severity: 'Medium',
    detectedTime: '2026-10-10 09:45 IST',
    status: 'In Recovery',
    source: 'Municipal Fire & Safety Inspection Notice / Hotel Advisory',
    classifierConfidence: 94.1,
    affectedTravellerIds: ['TRV-108', 'TRV-110'],
    affectedBookingIds: ['BKG-213', 'BKG-215'],
    evidenceSnippetIds: ['SNIP-09', 'SNIP-10'],
    agentSteps: [
      {
        step: 1,
        name: 'Detect',
        timestamp: '2026-10-10 09:45:15 IST',
        status: 'Completed',
        durationMs: 310,
        details: 'Notice of temporary municipal structural load inspection in heritage wing suites.'
      },
      {
        step: 2,
        name: 'Identify affected',
        timestamp: '2026-10-10 09:45:17 IST',
        status: 'Completed',
        durationMs: 450,
        details: 'Identified 2 guest reservations assigned to sealed pavilion suites.'
      },
      {
        step: 3,
        name: 'Retrieve policies',
        timestamp: '2026-10-10 09:45:18 IST',
        status: 'Completed',
        durationMs: 520,
        details: 'Retrieved Oberoi & Taj statutory inspection upgrade rules and partner relocation protocols.'
      },
      {
        step: 4,
        name: 'Evaluate alternatives',
        timestamp: '2026-10-10 09:45:20 IST',
        status: 'Completed',
        durationMs: 780,
        details: 'Confirmed garden wing suite availability with step-free accessibility.'
      },
      {
        step: 5,
        name: 'Compare costs',
        timestamp: '2026-10-10 09:45:21 IST',
        status: 'Completed',
        durationMs: 380,
        details: 'Zero cost delta confirmed under hotel operator mandatory upgrade clause.'
      },
      {
        step: 6,
        name: 'Draft plan',
        timestamp: '2026-10-10 09:45:22 IST',
        status: 'Completed',
        durationMs: 590,
        details: 'Drafted 2 options guaranteeing room accessibility and dining credits.'
      }
    ],
    summary: 'Municipal preservation inspection sealed heritage pavilion wing for 48 hours. Guests must be upgraded to unaffected garden suites or relocated to partner luxury properties.'
  },
  {
    id: 'INC-2026-0844',
    type: 'Flash Flood & Hill Route Inundation',
    location: 'Munnar Ghats & Alappuzha Backwaters, Kerala',
    coordinates: '10.0889° N, 77.0595° E',
    severity: 'High',
    detectedTime: '2026-10-10 11:10 IST',
    status: 'Active Investigation',
    source: 'Kerala State Disaster Management Authority (KSDMA) Red Alert',
    classifierConfidence: 97.4,
    affectedTravellerIds: ['TRV-109', 'TRV-111'],
    affectedBookingIds: ['BKG-217', 'BKG-218', 'BKG-219', 'BKG-220'],
    evidenceSnippetIds: ['SNIP-11', 'SNIP-12'],
    agentSteps: [
      {
        step: 1,
        name: 'Detect',
        timestamp: '2026-10-10 11:10:05 IST',
        status: 'Completed',
        durationMs: 330,
        details: 'KSDMA flash flood and landslide alert on NH-85 Gap road corridor.'
      },
      {
        step: 2,
        name: 'Identify affected',
        timestamp: '2026-10-10 11:10:07 IST',
        status: 'Completed',
        durationMs: 510,
        details: 'Identified 2 travellers booked on hill transfers and houseboat activities.'
      },
      {
        step: 3,
        name: 'Retrieve policies',
        timestamp: '2026-10-10 11:10:09 IST',
        status: 'Completed',
        durationMs: 490,
        details: 'Retrieved KSDMA disaster waiver rules and cascade cancellation protocols.'
      },
      {
        step: 4,
        name: 'Evaluate alternatives',
        timestamp: '2026-10-10 11:10:11 IST',
        status: 'Completed',
        durationMs: 760,
        details: 'Evaluated safe coastal Fort Kochi alternatives bypassing ghat routes.'
      },
      {
        step: 5,
        name: 'Compare costs',
        timestamp: '2026-10-10 11:10:12 IST',
        status: 'Completed',
        durationMs: 390,
        details: 'Credit shell applied resulting in ₹1,500 refund balance.'
      },
      {
        step: 6,
        name: 'Draft plan',
        timestamp: '2026-10-10 11:10:14 IST',
        status: 'Completed',
        durationMs: 580,
        details: 'Drafted safe coastal substitution plan with complete policy rationale.'
      }
    ],
    summary: 'Monsoon deluge caused mudslide on Munnar Gap Road. District Collector suspended hill tourist vehicle movements and backwater commercial boat operations.'
  },
  {
    id: 'INC-2026-0845',
    type: 'Ground Crew & Fuel Tanker Wildcat Stoppage',
    location: 'Delhi Indira Gandhi Intl (DEL) Terminal 3',
    coordinates: '28.5562° N, 77.1000° E',
    severity: 'Low',
    detectedTime: '2026-10-10 12:20 IST',
    status: 'Monitoring',
    source: 'DIAL Ground Handling Union Notice & AOCC Flash Report',
    classifierConfidence: 91.8,
    affectedTravellerIds: ['TRV-112'],
    affectedBookingIds: ['BKG-221'],
    evidenceSnippetIds: ['SNIP-13', 'SNIP-14'],
    agentSteps: [
      {
        step: 1,
        name: 'Detect',
        timestamp: '2026-10-10 12:20:02 IST',
        status: 'Completed',
        durationMs: 270,
        details: 'Detected sudden ramp staff walkout in Terminal 3 fuel bay.'
      },
      {
        step: 2,
        name: 'Identify affected',
        timestamp: '2026-10-10 12:20:04 IST',
        status: 'Completed',
        durationMs: 420,
        details: '1 traveller identified on delayed departure AI-102.'
      },
      {
        step: 3,
        name: 'Retrieve policies',
        timestamp: '2026-10-10 12:20:05 IST',
        status: 'Completed',
        durationMs: 470,
        details: 'Retrieved Tata SIA cross-code share re-accommodation protocol.'
      },
      {
        step: 4,
        name: 'Evaluate alternatives',
        timestamp: '2026-10-10 12:20:07 IST',
        status: 'Completed',
        durationMs: 650,
        details: 'Located earlier fueled flight UK-817 with available Business seat.'
      },
      {
        step: 5,
        name: 'Compare costs',
        timestamp: '2026-10-10 12:20:08 IST',
        status: 'Completed',
        durationMs: 310,
        details: 'Zero fare differential for corporate platinum member.'
      },
      {
        step: 6,
        name: 'Draft plan',
        timestamp: '2026-10-10 12:20:09 IST',
        status: 'Completed',
        durationMs: 510,
        details: 'Formulated seamless same-terminal switch plan.'
      }
    ],
    summary: 'Localized ramp personnel flash strike causing refuelling delays on select departures at DEL Terminal 3. Management deploying reserve supervisory crews.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-9001',
    timestamp: '2026-10-10 06:15:32 IST',
    actor: 'TripShield Ingestion Engine',
    action: 'Incident Created',
    incidentId: 'INC-2026-0841',
    newState: 'Active Investigation',
    comment: 'IMD Bulletin #SW-44 ingested and classified as Severe Cyclonic Storm Alert.'
  },
  {
    id: 'AUD-9002',
    timestamp: '2026-10-10 06:15:35 IST',
    actor: 'Autonomous Recovery Agent',
    action: 'Recovery Plans Drafted',
    incidentId: 'INC-2026-0841',
    newState: 'Pending Staff Review',
    comment: 'Generated 7 recovery options for 4 travellers citing DGCA CAR Sec 3 and IHCL policies.'
  },
  {
    id: 'AUD-9003',
    timestamp: '2026-10-10 08:30:20 IST',
    actor: 'TripShield Ingestion Engine',
    action: 'Incident Created',
    incidentId: 'INC-2026-0842',
    newState: 'In Recovery',
    comment: 'DGCA NOTAM A1492/26 parsed. Runway closure affecting BOM movements.'
  },
  {
    id: 'AUD-9004',
    timestamp: '2026-10-10 09:12:00 IST',
    actor: 'Staff Agent (A. Roy)',
    action: 'Manual Inspection Note',
    incidentId: 'INC-2026-0841',
    travellerId: 'TRV-103',
    comment: 'Confirmed with Taj Fort Aguada reception: protected presidential villas ready for guest Vikram Malhotra.'
  }
];

export const MODEL_EVALUATION_METRICS: ModelMetricRow[] = [
  {
    modelName: 'Baseline: TF-IDF + Logistic Regression',
    precision: 0.742,
    recall: 0.718,
    macroF1: 0.729,
    latencyP95Ms: 14.2,
    throughputSamplesSec: 1420
  },
  {
    modelName: 'Fine-Tuned Transformer (InTravel-RoBERTa-v2)',
    precision: 0.948,
    recall: 0.939,
    macroF1: 0.943,
    latencyP95Ms: 82.6,
    throughputSamplesSec: 285
  }
];

export const CLASS_PERFORMANCE_METRICS: ClassPerformance[] = [
  {
    className: 'Severe Weather / Cyclone',
    baselineF1: 0.78,
    transformerF1: 0.97,
    support: 340
  },
  {
    className: 'Runway / ATC NOTAM Closure',
    baselineF1: 0.71,
    transformerF1: 0.94,
    support: 285
  },
  {
    className: 'Natural Hazard / Flood & Landslide',
    baselineF1: 0.75,
    transformerF1: 0.96,
    support: 210
  },
  {
    className: 'Labour Stoppage / Ground Strike',
    baselineF1: 0.69,
    transformerF1: 0.92,
    support: 175
  },
  {
    className: 'Facility / Structural Safety Order',
    baselineF1: 0.70,
    transformerF1: 0.91,
    support: 190
  }
];

export const CONFUSION_MATRIX_DATA: ConfusionMatrixData = {
  labels: ['Weather', 'Runway/ATC', 'Flood/Slide', 'Labour/Strike', 'Facility/Safety'],
  matrix: [
    [328, 4, 6, 1, 1],   // Weather true
    [6, 269, 3, 5, 2],   // Runway/ATC true
    [5, 1, 201, 1, 2],   // Flood/Slide true
    [2, 7, 1, 161, 4],   // Labour/Strike true
    [3, 4, 3, 4, 176]    // Facility/Safety true
  ]
};
