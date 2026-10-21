export interface TriageQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface B2BMarketIntel {
  estimatedMonthlySearches: number;
  unmetDemandScore: number;
  missingSolutionGap: string;
  targetAudience: string;
}

export interface TriageResponse {
  isSafetyEmergency: boolean;
  emergencyMessage?: string;
  detectedCategory: string;
  empathySummary: string;
  questions: TriageQuestion[];
  b2bMarketIntel?: B2BMarketIntel;
}

export interface ImmediateStep {
  stepNumber: number;
  actionTitle: string;
  description: string;
  timeRequired: string;
  vectorType?: 'Atrito Ambiental' | 'Reset Biomecânico/Fisiológico' | 'Micro-hábito de Ancoragem' | string;
}

export interface ImmediateReliefLayer {
  title: string;
  subtitle: string;
  steps: ImmediateStep[];
}

export interface PhysicalProduct {
  name: string;
  category: string;
  whyItSolves: string;
  pros: string[];
  cons: string[];
  estimatedPriceBRL: number | string;
  originalPriceBRL?: number | string;
  discountPercentage?: number;
  installments?: string;
  painScore: number;
  searchQueryAmazon: string;
  searchQueryMercadoLivre: string;
  visualIconType: string;
  imageUrl?: string;
  gallery?: string[];
  whatsIncluded?: string[];
  badgePromotion?: string;
  reviewsCount?: string | number;
  rating?: number;
  deliveryInfo?: string;
  guaranteeDays?: number;
  conversionHeadline?: string;
  directUrl?: string;
  brandName?: string;
  isVerifiedPartner?: boolean;
}

export interface DigitalSolution {
  name: string;
  format: 'Curso Online' | 'Ebook / Método' | 'Template / Sistema' | 'App / SaaS' | string;
  transformationPromise: string;
  implementationTime: string;
  estimatedPriceBRL: number | string;
  originalPriceBRL?: number | string;
  discountPercentage?: number;
  installments?: string;
  painScore: number;
  searchQueryPlatform: string;
  imageUrl?: string;
  gallery?: string[];
  whatsIncluded?: string[];
  badgePromotion?: string;
  reviewsCount?: string | number;
  rating?: number;
  deliveryInfo?: string;
  guaranteeDays?: number;
  conversionHeadline?: string;
  directUrl?: string;
  brandName?: string;
  isVerifiedPartner?: boolean;
}

export interface PainAnatomyVector {
  tag: string;
  vectorType: string;
  clinicalExplanation: string;
  severity: number;
}

export interface PrescriptionResponse {
  isSafetyEmergency?: boolean;
  emergencyMessage?: string;
  diagnosisTitle: {
    part1Dark: string;
    part2Gray: string;
  };
  rootCauseAnalysis: string;
  painAnatomyTags: string[];
  painAnatomyVectors?: PainAnatomyVector[];
  layer01_ImmediateRelief: ImmediateReliefLayer;
  layer02_PhysicalProducts: PhysicalProduct[];
  layer03_DigitalSolutions: DigitalSolution[];
}

export interface PartnerProduct {
  id: string;
  name: string;
  category: string;
  type: 'physical' | 'digital';
  painTarget: string;
  priceBRL: number;
  rating: number;
  affiliateUrl: string;
  format?: string;
  description: string;
  verifiedBadge?: boolean;
}

export interface PainTrendItem {
  id: string;
  painQuery: string;
  category: string;
  monthlySearches: number;
  unmetDemandScore: number; // 0 - 100
  missingSolutionGap: string;
  targetAudience: string;
  dateAdded: string;
  isUserQuery?: boolean;
}

export interface SavedConsultation {
  id: string;
  timestamp: string;
  formattedDate: string;
  userPain: string;
  detectedCategory: string;
  triageAnswers: Record<string, string>;
  prescription: PrescriptionResponse;
  physicalProducts: PhysicalProduct[];
  digitalSolutions: DigitalSolution[];
}

export type ActiveTab = 'diagnose' | 'history' | 'tech_anatomy' | 'pain_trends' | 'partners';
