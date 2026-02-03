export type IdentityTier = 'known' | 'appended' | 'anonymous';

// ─── Data Provenance & Usage Permissions ────────────────────────
export type DataProvenance =
  | 'stated'
  | 'declared'
  | 'observed'
  | 'inferred'
  | 'agent_inferred'
  | 'appended';

export type UsagePermission = 'direct' | 'soft' | 'influence_only';

export const PROVENANCE_USAGE: Record<DataProvenance, UsagePermission> = {
  stated: 'direct',
  declared: 'direct',
  observed: 'direct',
  inferred: 'soft',
  agent_inferred: 'soft',
  appended: 'influence_only',
};

export interface TaggedContextField {
  value: string;
  provenance: DataProvenance;
  usage: UsagePermission;
}

export interface MerkuryIdentity {
  merkuryId: string;
  identityTier: IdentityTier;
  confidence: number;
  resolvedAt: string;
}

// ─── 3P: Merkury Appended Data ──────────────────────────────────
export interface AppendedProfile {
  companySize?: string;
  industryVertical?: string;
  annualRevenue?: string;
  employeeCount?: string;
  interests?: string[];
  lifestyleSignals?: string[];
  geoRegion?: string;
}

// ─── Purchase Data (Order-level) ────────────────────────────────
export interface OrderLineItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
  isGift?: boolean;
}

export interface OrderRecord {
  orderId: string;
  orderDate: string;
  channel: 'online' | 'phone' | 'sales-rep' | 'in-store' | 'mobile-app';
  lineItems: OrderLineItem[];
  totalAmount: number;
  status: 'completed' | 'shipped' | 'in-transit' | 'processing' | 'returned' | 'backordered';
  poNumber?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// ─── Summarized Chat Context ────────────────────────────────────
export interface ChatSummary {
  sessionDate: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  topicsDiscussed: string[];
}

// ─── Meaningful Events ──────────────────────────────────────────
export interface MeaningfulEvent {
  eventType: 'preference' | 'milestone' | 'life-event' | 'concern' | 'intent';
  description: string;
  capturedAt: string;
  agentNote?: string;
  metadata?: Record<string, string>;
}

// ─── Browse Data ────────────────────────────────────────────────
export interface BrowseSession {
  sessionDate: string;
  categoriesBrowsed: string[];
  productsViewed: string[];
  durationMinutes: number;
  device: 'desktop' | 'mobile' | 'tablet';
}

// ─── 1P Account Profile (B2B) ───────────────────────────────────
export interface AccountPreferences {
  industry: string;
  primaryApplications: string[];
  certifications: string[];
  preferredProcessingMethods: string[];
  preferredResins: string[];
  preferredBrands: string[];
  volumeTier?: string;
  communicationPrefs?: { email: boolean; phone: boolean; sms: boolean };
}

/** @deprecated Use AccountPreferences directly */
export type ProfilePreferences = AccountPreferences;
/** Legacy alias — kept for field name compat in CustomerProfile */
export type BeautyProfile = AccountPreferences;

// ─── Account Tier ───────────────────────────────────────────────
export interface LoyaltyData {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  pointsBalance: number;
  lifetimePoints: number;
  memberSince: string;
  rewardsAvailable: { name: string; pointsCost: number }[];
  tierExpiryDate?: string;
  nextTierThreshold?: number;
}

// ─── Agent-Captured Profile ─────────────────────────────────────
export interface CapturedProfileField<T = string> {
  value: T;
  capturedAt: string;
  capturedFrom: string;
  confidence: 'stated' | 'inferred';
}

export interface AgentCapturedProfile {
  // B2B renewable energy fields
  annualVolume?: CapturedProfileField;
  budgetCycle?: CapturedProfileField;
  decisionMakers?: CapturedProfileField<string[]>;
  primaryApplication?: CapturedProfileField;
  processingCapabilities?: CapturedProfileField<string[]>;
  qualityStandards?: CapturedProfileField;
  sustainabilityGoals?: CapturedProfileField;
  preferredLeadTime?: CapturedProfileField;
  warehouseLocations?: CapturedProfileField<string[]>;
  inventoryStrategy?: CapturedProfileField;
  accountManager?: CapturedProfileField;
  priceSensitivity?: CapturedProfileField;
  competitorProducts?: CapturedProfileField;
  painPoints?: CapturedProfileField;
  projectPipeline?: CapturedProfileField;
  gridInterconnection?: CapturedProfileField;
  siteConditions?: CapturedProfileField;
}

/** @deprecated Use OrderRecord instead */
export interface PurchaseRecord {
  productId: string;
  productName: string;
  purchaseDate: string;
  quantity: number;
  rating?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'net-terms' | 'wire' | 'ach' | 'paypal' | 'applepay';
  last4?: string;
  brand?: string;
  isDefault: boolean;
  terms?: string;
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  jobTitle?: string;

  /** Account preferences (industry, applications, certs). Named beautyProfile for legacy compat. */
  beautyProfile: AccountPreferences;

  orders: OrderRecord[];
  /** @deprecated */
  purchaseHistory: PurchaseRecord[];

  chatSummaries: ChatSummary[];
  meaningfulEvents: MeaningfulEvent[];
  browseSessions: BrowseSession[];

  loyalty: LoyaltyData | null;
  lifetimeValue?: number;

  agentCapturedProfile?: AgentCapturedProfile;

  merkuryIdentity?: MerkuryIdentity;
  appendedProfile?: AppendedProfile;

  savedPaymentMethods: PaymentMethod[];
  shippingAddresses: Address[];
  /** @deprecated */
  recentActivity?: RecentActivity[];
}

export interface RecentActivity {
  type: 'purchase' | 'trip' | 'browse' | 'return';
  description: string;
  date: string;
  productIds?: string[];
  metadata?: Record<string, string>;
}

export interface CustomerSessionContext {
  customerId: string;
  name: string;
  email?: string;
  company?: string;
  identityTier: IdentityTier;
  industry?: string;
  primaryApplications?: string[];
  recentPurchases?: string[];
  recentActivity?: string[];
  appendedInterests?: string[];
  loyaltyTier?: string;
  loyaltyPoints?: number;
  chatContext?: string[];
  meaningfulEvents?: string[];
  browseInterests?: string[];
  capturedProfile?: string[];
  missingProfileFields?: string[];
  taggedContext?: TaggedContextField[];
}
