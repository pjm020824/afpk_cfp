/**
 * 대한민국 금융제도 및 세제 혜택 기준 정책 데이터 (2025~2026 기준)
 * ISA, 연금저축, IRP, 소득/세액공제 한도 및 DSR 지침
 */

export interface TaxPolicyConfig {
  version: string;
  lastUpdated: string;
  pensionSavingsDeductionLimit: number; // 연금저축 납입한도 및 공제한도 (연 600만원)
  irpTotalDeductionLimit: number;       // 연금저축+IRP 합산 공제한도 (연 900만원)
  pensionTaxCreditRateGeneral: number;  // 총급여 5,500만원 초과 시 공제율 (13.2%)
  pensionTaxCreditRateLowIncome: number;// 총급여 5,500만원 이하 시 공제율 (16.5%)
  isaAnnualContributionLimit: number;  // ISA 연간 납입한도 (2,000만원, 총 1억원)
  isaTaxFreeBenefitGeneral: number;     // ISA 일반형 비과세 한도 (200만원)
  isaTaxFreeBenefitFarmerLowIncome: number; // ISA 서민형 비과세 한도 (400만원)
  dsrManagementThreshold: number;      // 권장 관리 DSR 기준 (40%)
}

export const KOREA_FINANCIAL_POLICIES: TaxPolicyConfig = {
  version: '2026.1-KR',
  lastUpdated: '2026-01-01',
  pensionSavingsDeductionLimit: 6000000,
  irpTotalDeductionLimit: 9000000,
  pensionTaxCreditRateGeneral: 13.2,
  pensionTaxCreditRateLowIncome: 16.5,
  isaAnnualContributionLimit: 20000000,
  isaTaxFreeBenefitGeneral: 2000000,
  isaTaxFreeBenefitFarmerLowIncome: 4000000,
  dsrManagementThreshold: 40.0
};
