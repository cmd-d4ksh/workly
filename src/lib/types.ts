/**
 * Domain types for Workly. These mirror the Postgres schema in
 * `supabase/schema.sql` field-for-field, so the demo-mode mock data layer
 * (`lib/mock-data`) and a real Supabase-backed layer can both satisfy the
 * same `lib/data` interfaces without the UI knowing which one is active.
 */

export type City = "Mumbai" | "Bangalore" | "Delhi" | "Pune" | "Hyderabad" | "Gurgaon";

export const CITIES: City[] = ["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad", "Gurgaon"];

export type WorkspaceType =
  | "hot_desk"
  | "dedicated_desk"
  | "private_office"
  | "team_office"
  | "meeting_room"
  | "virtual_office";

export const WORKSPACE_TYPE_LABELS: Record<WorkspaceType, string> = {
  hot_desk: "Hot desk",
  dedicated_desk: "Dedicated desk",
  private_office: "Private office",
  team_office: "Team office",
  meeting_room: "Meeting room",
  virtual_office: "Virtual office",
};

export const WORKSPACE_TYPES: WorkspaceType[] = Object.keys(
  WORKSPACE_TYPE_LABELS
) as WorkspaceType[];

export type AmenityKey =
  | "private_office"
  | "dedicated_desk"
  | "hot_desk"
  | "meeting_rooms"
  | "access_247"
  | "high_speed_wifi"
  | "parking"
  | "kitchen"
  | "phone_booths"
  | "conference_rooms"
  | "pet_friendly"
  | "event_space"
  | "accessibility"
  | "furnished"
  | "reception"
  | "air_conditioning";

export const AMENITY_LABELS: Record<AmenityKey, string> = {
  private_office: "Private office",
  dedicated_desk: "Dedicated desk",
  hot_desk: "Hot desk",
  meeting_rooms: "Meeting rooms",
  access_247: "24/7 access",
  high_speed_wifi: "High-speed WiFi",
  parking: "Parking",
  kitchen: "Kitchen",
  phone_booths: "Phone booths",
  conference_rooms: "Conference rooms",
  pet_friendly: "Pet friendly",
  event_space: "Event space",
  accessibility: "Accessibility",
  furnished: "Furnished",
  reception: "Reception",
  air_conditioning: "Air conditioning",
};

export const AMENITY_KEYS = Object.keys(AMENITY_LABELS) as AmenityKey[];

export type SpaceStatus = "draft" | "pending_review" | "published" | "rejected";

export interface WorkspaceOption {
  id: string;
  spaceId: string;
  type: WorkspaceType;
  priceMonthly: number;
  minCapacity: number;
  maxCapacity: number;
  available: boolean;
  availableUnits: number;
}

export interface OpeningHours {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  open: string | null;
  close: string | null;
}

export interface Space {
  id: string;
  slug: string;
  operatorId: string;
  name: string;
  tagline: string;
  description: string;
  city: City;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  images: string[];
  workspaceTypes: WorkspaceType[];
  amenities: AmenityKey[];
  startingPrice: number;
  minCapacity: number;
  maxCapacity: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  status: SpaceStatus;
  openingHours: OpeningHours[];
  workspaceOptions: WorkspaceOption[];
  createdAt: string;
  updatedAt: string;
}

export interface Operator {
  id: string;
  userId: string;
  companyName: string;
  logoUrl: string | null;
  contactEmail: string;
  contactPhone: string;
  plan: PlanTier;
  approved: boolean;
  createdAt: string;
}

export type PlanTier = "free" | "growth" | "pro";

export interface PlanDefinition {
  id: PlanTier;
  name: string;
  priceMonthly: number;
  leadCap: number | null;
  features: string[];
}

export type Role = "seeker" | "operator" | "admin";

export interface Profile {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export type TeamSizeBand = "1" | "2-5" | "6-10" | "11-25" | "26-50" | "50+";
export type MoveInTimeline = "immediately" | "30_days" | "1_3_months" | "3_plus_months";

export const TEAM_SIZE_BANDS: { value: TeamSizeBand; label: string; min: number; max: number }[] = [
  { value: "1", label: "Just me", min: 1, max: 1 },
  { value: "2-5", label: "2–5 people", min: 2, max: 5 },
  { value: "6-10", label: "6–10 people", min: 6, max: 10 },
  { value: "11-25", label: "11–25 people", min: 11, max: 25 },
  { value: "26-50", label: "26–50 people", min: 26, max: 50 },
  { value: "50+", label: "50+ people", min: 50, max: 500 },
];

export const MOVE_IN_LABELS: Record<MoveInTimeline, string> = {
  immediately: "Immediately",
  "30_days": "Within 30 days",
  "1_3_months": "1–3 months",
  "3_plus_months": "3+ months",
};

/**
 * Canonical lead lifecycle — one state machine, two audiences. The operator
 * CRM shows these values directly; the seeker dashboard renders friendlier
 * copy via `SEEKER_STATUS_LABELS` so neither side needs its own enum.
 */
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "tour_scheduled"
  | "proposal"
  | "won"
  | "lost";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "tour_scheduled",
  "proposal",
  "won",
  "lost",
];

export const OPERATOR_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  tour_scheduled: "Tour Scheduled",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export const SEEKER_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Matching",
  contacted: "Contacted",
  qualified: "In conversation",
  tour_scheduled: "Tour scheduled",
  proposal: "Negotiating",
  won: "Closed",
  lost: "Lost",
};

export interface LeadStatusHistoryEntry {
  id: string;
  leadId: string;
  status: LeadStatus;
  note?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  userId: string | null;
  city: City;
  neighborhoods: string[];
  workspaceType: WorkspaceType;
  teamSize: TeamSizeBand;
  budgetMin: number;
  budgetMax: number;
  moveIn: MoveInTimeline;
  amenities: AmenityKey[];
  contactName: string;
  company: string;
  email: string;
  phone: string;
  jobTitle: string;
  status: LeadStatus;
  assignedSpaceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MatchBand = "excellent" | "strong" | "possible" | "low";

export const MATCH_BAND_LABELS: Record<MatchBand, string> = {
  excellent: "Excellent match",
  strong: "Strong match",
  possible: "Possible match",
  low: "Low match",
};

export interface MatchScoreBreakdown {
  location: number;
  workspaceType: number;
  budget: number;
  capacity: number;
  amenities: number;
  availability: number;
}

export interface LeadMatch {
  id: string;
  leadId: string;
  spaceId: string;
  score: number;
  band: MatchBand;
  breakdown: MatchScoreBreakdown;
  createdAt: string;
}

export interface SavedSpace {
  id: string;
  userId: string;
  spaceId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  spaceId: string;
  userId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  spaceId: string;
  userId: string;
  operatorId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderRole: Role;
  senderName: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export type TourStatus = "requested" | "confirmed" | "completed" | "cancelled";

export interface Tour {
  id: string;
  leadId: string;
  spaceId: string;
  scheduledFor: string;
  status: TourStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  href?: string;
  readAt: string | null;
  createdAt: string;
}

export interface AnalyticsPoint {
  date: string;
  value: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
}
