/**
 * 은퇴설계 및 연도별 자산소진 시뮬레이션 엔진
 * 물가상승률을 반영한 실질 생활비와 은퇴자산 현금흐름 분석
 */

import { RetirementAnalysisResult, RetirementSimulationYear, UserFinancialProfile } from '../types/financial';

export function calculateRetirementAnalysis(profile: UserFinancialProfile): RetirementAnalysisResult {
  const currentAge = Math.max(18, Math.min(100, Math.round(profile.age)));
  const retirementAge = Math.max(currentAge, Math.min(100, Math.round(profile.expectedRetirementAge || 60)));
  const lifeExpectancy = Math.max(retirementAge + 1, Math.min(110, Math.round(profile.assumptions.lifeExpectancy || 90)));

  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const retirementDurationYears = Math.max(1, lifeExpectancy - retirementAge);

  const inflationRate = Math.max(0, profile.assumptions.inflationRate) / 100;
  const preRetirementReturn = Math.max(0, profile.assumptions.expectedReturnRate) / 100;
  // 은퇴 후 자산 운용수익률은 통상 보수적으로 적용 (은퇴 전 수익률의 70% 또는 물가상승률+1%)
  const postRetirementReturn = Math.max(0.015, preRetirementReturn * 0.75);

  // 초기 자산: 금융투자자산 + 연금자산 + 정기예적금
  let currentAccumulated = Math.max(0,
    profile.assets.stocksFunds +
    profile.assets.pensionAssets +
    profile.assets.savingsDeposits
  );

  // 연간 저축/적립액 (은퇴 전)
  const annualSavings = Math.max(0,
    (profile.savingsAndInvestment.monthlySavings +
     profile.savingsAndInvestment.monthlyInvestment +
     profile.savingsAndInvestment.monthlyPensionSavings) * 12
  );

  // 은퇴 후 필요 월 생활비 (현재가치 기준)
  const baseMonthlyRetirementExpense = profile.assumptions.retirementMonthlyExpenses > 0
    ? profile.assumptions.retirementMonthlyExpenses
    : Math.max(1500000, Math.round(
        (profile.expenses.housing + profile.expenses.living + profile.expenses.transportCommunication + profile.expenses.otherConsumption) * 0.7
      ));

  // 은퇴 후 월 공적/사적 연금 수령 예상액 (현재가치)
  const baseMonthlyPensionIncome = Math.max(0, profile.income.monthlyPension);

  const simulationSchedule: RetirementSimulationYear[] = [];
  let assetBalance = currentAccumulated;
  let depletionAge: number | null = null;
  let accumulatedAtRetirement = 0;

  const currentYear = new Date().getFullYear();

  // 현재 나이부터 기대수명까지 연도별 시뮬레이션
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const elapsedYears = age - currentAge;
    const isRetired = age >= retirementAge;
    const year = currentYear + elapsedYears;

    const beginningAssets = Math.round(assetBalance);

    let annualIncome = 0;
    let annualExpense = 0;
    let annualPension = 0;
    let netAnnualCashflow = 0;
    let investmentReturn = 0;

    if (!isRetired) {
      // 은퇴 전: 근로/사업 소득 발생, 정기 저축 적립
      annualIncome = (profile.income.monthlySalary + profile.income.monthlyBusiness) * 12;
      annualExpense = (
        profile.expenses.housing +
        profile.expenses.living +
        profile.expenses.transportCommunication +
        profile.expenses.education +
        profile.expenses.insurance +
        profile.expenses.otherConsumption
      ) * 12;

      // 은퇴 전 자산 운용수익 + 연간 저축 유입
      investmentReturn = Math.round(beginningAssets * preRetirementReturn);
      netAnnualCashflow = annualSavings;
      assetBalance = beginningAssets + investmentReturn + annualSavings;

      if (age + 1 === retirementAge) {
        accumulatedAtRetirement = Math.round(assetBalance);
      }
    } else {
      // 은퇴 후: 물가상승 반영된 생활비 인출
      // 한국 공적연금(국민연금)은 국민연금법 제51조에 의거 소비자물가상승률을 100% 반영합니다.
      const inflationFactor = Math.pow(1 + inflationRate, elapsedYears);
      const inflatedMonthlyExpense = baseMonthlyRetirementExpense * inflationFactor;
      const inflatedMonthlyPension = baseMonthlyPensionIncome * inflationFactor;

      annualExpense = Math.round(inflatedMonthlyExpense * 12);
      annualPension = Math.round(inflatedMonthlyPension * 12);
      annualIncome = annualPension;

      netAnnualCashflow = annualPension - annualExpense; // 통상 음수 (순인출)

      if (assetBalance > 0) {
        investmentReturn = Math.round(beginningAssets * postRetirementReturn);
        assetBalance = assetBalance + investmentReturn + netAnnualCashflow;

        if (assetBalance <= 0) {
          assetBalance = 0;
          if (depletionAge === null) {
            depletionAge = age;
          }
        }
      } else {
        investmentReturn = 0;
        assetBalance = 0;
        if (depletionAge === null) {
          depletionAge = age;
        }
      }
    }

    simulationSchedule.push({
      age,
      year,
      isRetired,
      annualIncome,
      annualExpense,
      pensionIncome: annualPension,
      netAnnualCashflow,
      beginningAssets,
      investmentReturn,
      endingAssets: Math.max(0, Math.round(assetBalance))
    });
  }

  if (accumulatedAtRetirement === 0) {
    accumulatedAtRetirement = Math.round(currentAccumulated);
  }

  // 은퇴 시점 필요자금 역산 (물가상승률 및 은퇴기간 고려한 연금 현가)
  // 피셔(Fisher) 방정식 실질 할인율: r_real = (1 + postRetirementReturn) / (1 + inflationRate) - 1
  const rReal = (1 + postRetirementReturn) / (1 + inflationRate) - 1;
  const firstYearAnnualLivingExpense = Math.round(baseMonthlyRetirementExpense * 12 * Math.pow(1 + inflationRate, yearsToRetirement));
  const firstYearPensionIncome = Math.round(baseMonthlyPensionIncome * 12 * Math.pow(1 + inflationRate, yearsToRetirement));
  const initialRetirementAnnualShortfall = Math.max(0, firstYearAnnualLivingExpense - firstYearPensionIncome);
  
  let requiredAtRetirement = 0;
  if (Math.abs(rReal) < 1e-5) {
    requiredAtRetirement = Math.round(initialRetirementAnnualShortfall * retirementDurationYears);
  } else {
    requiredAtRetirement = Math.round(
      initialRetirementAnnualShortfall * (1 - Math.pow(1 + rReal, -retirementDurationYears)) / rReal
    );
  }

  const shortfallAtRetirement = Math.max(0, requiredAtRetirement - accumulatedAtRetirement);
  const requiredAtRetirementPresentValue = yearsToRetirement > 0
    ? Math.round(requiredAtRetirement / Math.pow(1 + inflationRate, yearsToRetirement))
    : requiredAtRetirement;

  return {
    currentAge,
    retirementAge,
    lifeExpectancy,
    yearsToRetirement,
    retirementDurationYears,
    accumulatedAtRetirement,
    requiredAtRetirement,
    requiredAtRetirementPresentValue,
    shortfallAtRetirement,
    depletionAge,
    isDepletedBeforeLifeExpectancy: depletionAge !== null && depletionAge <= lifeExpectancy,
    preRetirementReturnPercent: Number((preRetirementReturn * 100).toFixed(2)),
    postRetirementReturnPercent: Number((postRetirementReturn * 100).toFixed(2)),
    inflationRatePercent: Number((inflationRate * 100).toFixed(2)),
    realDiscountRatePercent: Number((rReal * 100).toFixed(4)),
    firstYearAnnualLivingExpense,
    simulationSchedule
  };
}
