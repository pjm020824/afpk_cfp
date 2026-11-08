/**
 * CFP 기반 재무건전성 지표 계산 엔진
 * 모든 수치는 원(KRW) 단위를 기준으로 계산하며 부동소수점 오차를 최소화합니다.
 */

import { CalculatedFinancialHealth, UserFinancialProfile } from '../types/financial';

export function calculateFinancialHealth(profile: UserFinancialProfile): CalculatedFinancialHealth {
  // 1. 자산 분류 및 합계
  const liquidAssets = Math.max(0, Math.round(profile.assets.cashAndChecking));
  const shortTermSavings = Math.max(0, Math.round(profile.assets.savingsDeposits));
  const investmentAssets = Math.max(0, Math.round(profile.assets.stocksFunds));
  const pensionAssets = Math.max(0, Math.round(profile.assets.pensionAssets));
  const fixedAssets = Math.max(0, Math.round(profile.assets.realEstate + profile.assets.otherAssets));

  const totalAssets = liquidAssets + shortTermSavings + investmentAssets + pensionAssets + fixedAssets;

  // 2. 부채 합계
  const totalDebts = profile.debts.reduce((sum, debt) => sum + Math.max(0, Math.round(debt.balance || 0)), 0);

  // 3. 순자산
  const netWorth = totalAssets - totalDebts;

  // 4. 월 소득 합계 (세후)
  const totalMonthlyIncome = Math.max(0, Math.round(
    profile.income.monthlySalary +
    profile.income.monthlyBusiness +
    profile.income.monthlyPension +
    profile.income.monthlyOther
  ));

  // 5. 월 소비지출 합계 (저축 및 부채상환 제외된 순수 소비)
  const totalMonthlyConsumption = Math.max(0, Math.round(
    profile.expenses.housing +
    profile.expenses.living +
    profile.expenses.transportCommunication +
    profile.expenses.education +
    profile.expenses.insurance +
    profile.expenses.otherConsumption
  ));

  // 6. 월 대출 원리금 상환액 합계
  const totalMonthlyDebtPayment = profile.debts.reduce((sum, debt) => {
    return sum + Math.max(0, Math.round(debt.currentMonthlyPayment || 0));
  }, 0);

  // 7. 월 정기 저축 및 투자액 합계
  const totalMonthlySavingsAndInvestment = Math.max(0, Math.round(
    profile.savingsAndInvestment.monthlySavings +
    profile.savingsAndInvestment.monthlyInvestment +
    profile.savingsAndInvestment.monthlyPensionSavings
  ));

  // 8. 월 가용현금흐름 (Available Cashflow)
  // 월 세후수입 - 월 소비지출 - 월 대출 원리금 상환액
  // ※ 저축·투자액은 소비지출과 구분되어 배분 가능한 가용현금에서 집행됩니다.
  const monthlyAvailableCashflow = totalMonthlyIncome - totalMonthlyConsumption - totalMonthlyDebtPayment;

  // 9. 미배분 잉여현금흐름 (Unallocated surplus)
  const unallocatedCashflow = monthlyAvailableCashflow - totalMonthlySavingsAndInvestment;

  // 10. 재무 비율 산출 (0으로 나누기 방지)
  const actualSavingsRate = totalMonthlyIncome > 0
    ? Number(((totalMonthlySavingsAndInvestment / totalMonthlyIncome) * 100).toFixed(2))
    : 0;

  const theoreticalSavingsCapacityRate = totalMonthlyIncome > 0
    ? Number(((monthlyAvailableCashflow / totalMonthlyIncome) * 100).toFixed(2))
    : 0;

  // 관리지표 부채상환부담비율 (DSR 유사 관리지표)
  const debtServiceRatio = totalMonthlyIncome > 0
    ? Number(((totalMonthlyDebtPayment / totalMonthlyIncome) * 100).toFixed(2))
    : 0;

  // 11. 비상자금 유동성 개월 수
  // 즉시 사용 가능한 현금성 자산(현금 + 입출금 + 일부 수시인출가능 예적금) / 월 필수 지출(소비 + 대출상환)
  const essentialMonthlyExpenses = totalMonthlyConsumption + totalMonthlyDebtPayment;
  const emergencyFundMonths = essentialMonthlyExpenses > 0
    ? Number((liquidAssets / essentialMonthlyExpenses).toFixed(1))
    : 0;

  // 상태 평가 판정 (CFP 가이드라인 기준)
  let liquidityStatus: CalculatedFinancialHealth['liquidityStatus'] = 'healthy';
  if (emergencyFundMonths < 2) liquidityStatus = 'danger';
  else if (emergencyFundMonths < 3) liquidityStatus = 'caution';
  else if (emergencyFundMonths <= 6) liquidityStatus = 'healthy';
  else liquidityStatus = 'optimal';

  let debtStatus: CalculatedFinancialHealth['debtStatus'] = 'low';
  if (debtServiceRatio > 40) debtStatus = 'critical';
  else if (debtServiceRatio > 25) debtStatus = 'high';
  else if (debtServiceRatio > 10) debtStatus = 'moderate';
  else debtStatus = 'low';

  let savingsStatus: CalculatedFinancialHealth['savingsStatus'] = 'fair';
  if (actualSavingsRate >= 35) savingsStatus = 'excellent';
  else if (actualSavingsRate >= 20) savingsStatus = 'good';
  else if (actualSavingsRate >= 10) savingsStatus = 'fair';
  else savingsStatus = 'poor';

  return {
    totalAssets,
    liquidAssets,
    investmentAssets,
    pensionAssets,
    fixedAssets,
    totalDebts,
    netWorth,
    totalMonthlyIncome,
    totalMonthlyConsumption,
    totalMonthlyDebtPayment,
    totalMonthlySavingsAndInvestment,
    monthlyAvailableCashflow,
    unallocatedCashflow,
    actualSavingsRate,
    theoreticalSavingsCapacityRate,
    debtServiceRatio,
    emergencyFundMonths,
    liquidityStatus,
    debtStatus,
    savingsStatus
  };
}
