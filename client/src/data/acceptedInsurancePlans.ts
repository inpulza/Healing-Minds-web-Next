import type { StaticImageData } from 'next/image';
import aetnaLogo from '@/assets/insurance-aetna.webp';
import ambetterLogo from '@/assets/insurance-ambetter.webp';
import avmedLogo from '@/assets/insurance-avmed.webp';
import champvaLogo from '@/assets/insurance-champva.webp';
import cignaLogo from '@/assets/insurance-cigna.webp';
import firstHealthLogo from '@/assets/insurance-first-health.webp';
import floridaMedicaidLogo from '@/assets/insurance-florida-medicaid.webp';
import medicaidLogo from '@/assets/insurance-medicaid.webp';
import medicareLogo from '@/assets/insurance-medicare.webp';
import sunshineHealthLogo from '@/assets/insurance-sunshine.webp';
import wellcareLogo from '@/assets/insurance-wellcare.webp';
import doctorsHealthcareLogo from '@assets/3_1755868276797.webp';
import unitedHealthcareLogo from '@assets/8_1755868276798.webp';
import oscarLogo from '@assets/10_1755868276798.webp';

export type AcceptedInsurancePlan = {
  slug: string;
  name: string;
  src: string | StaticImageData;
  alt: { en: string; es: string };
};

// Clinically confirmed by Jordan on 2026-08-26 for HM Web 03.
// Do not add or remove plans without a new explicit confirmation.
export const acceptedInsurancePlans = [
  { slug: 'aetna', name: 'Aetna', src: aetnaLogo, alt: { en: 'Aetna insurance logo', es: 'Logotipo de seguro Aetna' } },
  { slug: 'united-healthcare', name: 'United Healthcare', src: unitedHealthcareLogo, alt: { en: 'United Healthcare insurance logo', es: 'Logotipo de seguro United Healthcare' } },
  { slug: 'medicare', name: 'Medicare', src: medicareLogo, alt: { en: 'Medicare logo', es: 'Logotipo de Medicare' } },
  { slug: 'medicaid', name: 'Medicaid', src: medicaidLogo, alt: { en: 'Medicaid logo', es: 'Logotipo de Medicaid' } },
  { slug: 'cigna', name: 'Cigna', src: cignaLogo, alt: { en: 'Cigna insurance logo', es: 'Logotipo de seguro Cigna' } },
  { slug: 'ambetter', name: 'Ambetter', src: ambetterLogo, alt: { en: 'Ambetter insurance logo', es: 'Logotipo de seguro Ambetter' } },
  { slug: 'first-health', name: 'First Health', src: firstHealthLogo, alt: { en: 'First Health insurance logo', es: 'Logotipo de seguro First Health' } },
  { slug: 'oscar', name: 'Oscar', src: oscarLogo, alt: { en: 'Oscar Health insurance logo', es: 'Logotipo de seguro Oscar Health' } },
  { slug: 'wellcare', name: 'WellCare', src: wellcareLogo, alt: { en: 'WellCare insurance logo', es: 'Logotipo de seguro WellCare' } },
  { slug: 'sunshine-health', name: 'Sunshine Health', src: sunshineHealthLogo, alt: { en: 'Sunshine Health insurance logo', es: 'Logotipo de seguro Sunshine Health' } },
  { slug: 'avmed', name: 'AvMed', src: avmedLogo, alt: { en: 'AvMed insurance logo', es: 'Logotipo de seguro AvMed' } },
  { slug: 'doctors-healthcare-plans', name: 'Doctors Healthcare Plans', src: doctorsHealthcareLogo, alt: { en: 'Doctors Healthcare Plans insurance logo', es: 'Logotipo de seguro Doctors Healthcare Plans' } },
  { slug: 'champva', name: 'CHAMPVA', src: champvaLogo, alt: { en: 'CHAMPVA logo', es: 'Logotipo de CHAMPVA' } },
  { slug: 'florida-medicaid', name: 'Florida Medicaid', src: floridaMedicaidLogo, alt: { en: 'Florida Medicaid logo', es: 'Logotipo de Florida Medicaid' } },
] as const satisfies readonly AcceptedInsurancePlan[];
