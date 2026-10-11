export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus = 
  | 'Active Investigation' 
  | 'In Recovery' 
  | 'Resolved' 
  | 'Monitoring';

export type BookingType = 'Flight' | 'Hotel' | 'Activity' | 'Transfer';

export type BookingStatus = 'On Schedule' | 'Disrupted' | 'Rebooked' | 'Cancelled';

export type PlanStatus = 'Pending' | 'Approved' | 'Rejected' | 'Edited & Approved';

export interface TravellerPreference {
  seat: string;
  meal: string;
  hotelRoom: string;
  transitFlexibility: string;
}

export interface Traveller {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  baseCity: string;
  emergencyContact: string;
  budgetLimitINR: number;
  preferences: TravellerPreference;
  insuranceActive: boolean;
}

export interface Booking {
  id: string;
  travellerId: string;
  type: BookingType;
  reference: string;
  supplier: string;
  serviceName: string;
  departureOrCheckIn: string;
  arrivalOrCheckOut: string;
  location: string;
  costINR: number;
  status: BookingStatus;
  impactedByIncidentId?: string;
  disruptionNote?: string;
}

export interface EvidenceSnippet {
  id: string;
  citationIndex: number;
  documentId: string;
  documentTitle: string;
  supplier: string;
  section: string;
  relevanceScore: number;
  excerpt: string;
  regulationCode?: string;
}

export interface PolicySection {
  title: string;
  code?: string;
  content: string;
}

export interface PolicyDocument {
  id: string;
  title: string;
  supplier: string;
  category: 'Airlines' | 'Hotels' | 'Railways' | 'Aggregator';
  effectiveDate: string;
  version: string;
  summary: string;
  sections: PolicySection[];
}

export interface ItineraryChange {
  bookingId: string;
  changeType: 'Rescheduled' | 'Alternative Provider' | 'Route Diverted' | 'Full Refund & Cancel' | 'Room Reallocated';
  originalDetails: string;
  proposedDetails: string;
}

export interface RecoveryPlan {
  id: string;
  incidentId: string;
  travellerId: string;
  planLabel: 'Option A' | 'Option B' | 'Option C';
  title: string;
  itineraryChanges: ItineraryChange[];
  costDifferenceINR: number;
  withinBudget: boolean;
  budgetDifferenceINR: number;
  preferenceMatchScore: number;
  preferenceSummary: string;
  rationale: string;
  status: PlanStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerComment?: string;
}

export interface AgentStep {
  step: number;
  name: 'Detect' | 'Identify affected' | 'Retrieve policies' | 'Evaluate alternatives' | 'Compare costs' | 'Draft plan';
  timestamp: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  durationMs: number;
  details: string;
  payloadSummary?: string;
}

export interface Incident {
  id: string;
  type: string;
  location: string;
  coordinates: string;
  severity: Severity;
  detectedTime: string;
  status: IncidentStatus;
  source: string;
  classifierConfidence: number;
  affectedTravellerIds: string[];
  affectedBookingIds: string[];
  evidenceSnippetIds: string[];
  agentSteps: AgentStep[];
  summary: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  incidentId?: string;
  travellerId?: string;
  planId?: string;
  previousState?: string;
  newState?: string;
  comment?: string;
}

export interface ModelMetricRow {
  modelName: string;
  precision: number;
  recall: number;
  macroF1: number;
  latencyP95Ms: number;
  throughputSamplesSec: number;
}

export interface ClassPerformance {
  className: string;
  baselineF1: number;
  transformerF1: number;
  support: number;
}

export interface ConfusionMatrixData {
  labels: string[];
  matrix: number[][];
}
