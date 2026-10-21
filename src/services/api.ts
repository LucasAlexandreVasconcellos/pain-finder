import { TriageResponse, PrescriptionResponse, PartnerProduct } from '../types';
import { generateFallbackTriage, generateFallbackPrescription } from './fallbackData';
import { resolvePhysicalProductVisuals, resolveDigitalSolutionVisuals } from './productVisuals';

function enrichPrescriptionWithVisuals(prescription: PrescriptionResponse): PrescriptionResponse {
  if (!prescription) return prescription;

  const enrichedPhysical = (prescription.layer02_PhysicalProducts || []).map((prod) => {
    const visuals = resolvePhysicalProductVisuals(prod);
    return {
      ...prod,
      imageUrl: prod.imageUrl || visuals.imageUrl,
      gallery: prod.gallery && prod.gallery.length > 0 ? prod.gallery : visuals.gallery,
      whatsIncluded: prod.whatsIncluded && prod.whatsIncluded.length > 0 ? prod.whatsIncluded : visuals.whatsIncluded,
      originalPriceBRL: prod.originalPriceBRL || visuals.originalPriceBRL,
      discountPercentage: prod.discountPercentage || visuals.discountPercentage,
      installments: prod.installments || visuals.installments,
      rating: prod.rating || visuals.rating,
      reviewsCount: prod.reviewsCount || visuals.reviewsCount,
      badgePromotion: prod.badgePromotion || visuals.badgePromotion,
      deliveryInfo: prod.deliveryInfo || visuals.deliveryInfo,
      guaranteeDays: prod.guaranteeDays || visuals.guaranteeDays,
      conversionHeadline: prod.conversionHeadline || visuals.conversionHeadline,
      directUrl: prod.directUrl || visuals.directUrl,
      brandName: prod.brandName || visuals.brandName,
    };
  });

  const enrichedDigital = (prescription.layer03_DigitalSolutions || []).map((sol) => {
    const visuals = resolveDigitalSolutionVisuals(sol);
    return {
      ...sol,
      imageUrl: sol.imageUrl || visuals.imageUrl,
      gallery: sol.gallery && sol.gallery.length > 0 ? sol.gallery : visuals.gallery,
      whatsIncluded: sol.whatsIncluded && sol.whatsIncluded.length > 0 ? sol.whatsIncluded : visuals.whatsIncluded,
      originalPriceBRL: sol.originalPriceBRL || visuals.originalPriceBRL,
      discountPercentage: sol.discountPercentage || visuals.discountPercentage,
      installments: sol.installments || visuals.installments,
      rating: sol.rating || visuals.rating,
      reviewsCount: sol.reviewsCount || visuals.reviewsCount,
      badgePromotion: sol.badgePromotion || visuals.badgePromotion,
      deliveryInfo: sol.deliveryInfo || visuals.deliveryInfo,
      guaranteeDays: sol.guaranteeDays || visuals.guaranteeDays,
      conversionHeadline: sol.conversionHeadline || visuals.conversionHeadline,
      directUrl: sol.directUrl || visuals.directUrl,
      brandName: sol.brandName || visuals.brandName,
    };
  });

  return {
    ...prescription,
    layer02_PhysicalProducts: enrichedPhysical,
    layer03_DigitalSolutions: enrichedDigital,
  };
}

export async function requestTriage(userPain: string): Promise<TriageResponse> {
  try {
    const res = await fetch('/api/gemini/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPain }),
    });

    if (!res.ok) {
      console.warn('API triage returned error status, using high-fidelity local clinical synthesis', res.status);
      return generateFallbackTriage(userPain);
    }

    const data = await res.json();
    if (data.useFallback || !data.questions) {
      return generateFallbackTriage(userPain);
    }

    return data as TriageResponse;
  } catch (error) {
    console.warn('Network error during triage request, activating offline diagnostic synthesis:', error);
    return generateFallbackTriage(userPain);
  }
}

export async function requestPrescription(
  userPain: string,
  triageAnswers: Record<string, string>,
  partnerProducts: PartnerProduct[] = []
): Promise<PrescriptionResponse> {
  try {
    const res = await fetch('/api/gemini/prescribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPain, triageAnswers, partnerProducts }),
    });

    if (!res.ok) {
      console.warn('API prescription returned error status, synthesizing 3-layer architecture locally', res.status);
      const fallback = generateFallbackPrescription(userPain, triageAnswers, partnerProducts);
      return enrichPrescriptionWithVisuals(fallback);
    }

    const data = await res.json();
    if (data.useFallback || !data.diagnosisTitle || !data.layer01_ImmediateRelief) {
      const fallback = generateFallbackPrescription(userPain, triageAnswers, partnerProducts);
      return enrichPrescriptionWithVisuals(fallback);
    }

    return enrichPrescriptionWithVisuals(data as PrescriptionResponse);
  } catch (error) {
    console.warn('Network error during prescription, activating offline 3-layer synthesis:', error);
    const fallback = generateFallbackPrescription(userPain, triageAnswers, partnerProducts);
    return enrichPrescriptionWithVisuals(fallback);
  }
}
