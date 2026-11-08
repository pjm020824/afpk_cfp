/**
 * 목표자금 미래가치 및 필요 월 저축액 계산 엔진
 * CFP 공학 기준: 연 유효수익률 기반 월복리 전환 및 기말급(End of period) 정기적립
 */

export interface GoalFutureValueResult {
  futureTargetAmount: number;         // 물가상승률 반영된 실질 목표금액 (원)
  fvOfCurrentAmount: number;          // 현재 확보 자금의 만기 미래가치 (원)
  shortfallAmount: number;            // 만기 시점 부족액 (원)
  requiredMonthlySavings: number;     // 부족액 달성을 위해 매월 적립해야 할 금액 (원)
  effectiveMonthlyRate: number;       // 환산된 월 복리 이율
  totalMonths: number;
}

/**
 * 목표 자금 및 필요 적립액 계산
 * @param targetAmount 현재 시점 목표 금액 (원)
 * @param currentAmount 현재 확보된 자산 (원)
 * @param years 목표 달성 기간 (년)
 * @param annualReturnRatePercent 연 유효수익률 (% 단위)
 * @param annualInflationRatePercent 연 물가상승률 (% 단위, 기본 0%)
 */
export function calculateGoalFutureValue(
  targetAmount: number,
  currentAmount: number,
  years: number,
  annualReturnRatePercent: number,
  annualInflationRatePercent: number = 0
): GoalFutureValueResult {
  const safeTarget = Math.max(0, Math.round(targetAmount));
  const safeCurrent = Math.max(0, Math.round(currentAmount));
  const safeYears = Math.max(0, years);
  const totalMonths = Math.round(safeYears * 12);

  // 1. 물가상승률을 감안한 미래 목표 금액 (명목 미래가치)
  const inflationRate = Math.max(0, annualInflationRatePercent) / 100;
  const futureTargetAmount = safeYears > 0 && inflationRate > 0
    ? Math.round(safeTarget * Math.pow(1 + inflationRate, safeYears))
    : safeTarget;

  if (totalMonths === 0) {
    const shortfall = Math.max(0, futureTargetAmount - safeCurrent);
    return {
      futureTargetAmount,
      fvOfCurrentAmount: safeCurrent,
      shortfallAmount: shortfall,
      requiredMonthlySavings: shortfall,
      effectiveMonthlyRate: 0,
      totalMonths: 0
    };
  }

  // 2. 연 유효수익률(Effective Annual Rate)로부터 월 복리 이율 도출
  // r_m = (1 + r)^(1/12) - 1
  const annualReturn = Math.max(-0.99, annualReturnRatePercent / 100);
  const effectiveMonthlyRate = annualReturn !== 0
    ? Math.pow(1 + annualReturn, 1 / 12) - 1
    : 0;

  // 3. 기보유 자산의 미래가치 (FV of Lump Sum)
  let fvOfCurrentAmount = safeCurrent;
  if (effectiveMonthlyRate !== 0) {
    fvOfCurrentAmount = Math.round(safeCurrent * Math.pow(1 + effectiveMonthlyRate, totalMonths));
  }

  // 4. 부족액 산출
  const shortfallAmount = Math.max(0, futureTargetAmount - fvOfCurrentAmount);

  // 5. 부족액을 달성하기 위한 월 납입액 (PMT) 역산
  // 기말급 연금 미래가치 공식: FV = PMT * [ (1 + r_m)^n - 1 ] / r_m
  // => PMT = FV * r_m / [ (1 + r_m)^n - 1 ]
  let requiredMonthlySavings = 0;
  if (shortfallAmount > 0) {
    if (Math.abs(effectiveMonthlyRate) < 1e-7) {
      // 수익률이 0인 경우 단순 균등 분할
      requiredMonthlySavings = Math.ceil(shortfallAmount / totalMonths);
    } else {
      const compoundFactor = Math.pow(1 + effectiveMonthlyRate, totalMonths) - 1;
      if (compoundFactor > 0) {
        requiredMonthlySavings = Math.ceil((shortfallAmount * effectiveMonthlyRate) / compoundFactor);
      } else {
        requiredMonthlySavings = Math.ceil(shortfallAmount / totalMonths);
      }
    }
  }

  return {
    futureTargetAmount,
    fvOfCurrentAmount,
    shortfallAmount,
    requiredMonthlySavings,
    effectiveMonthlyRate,
    totalMonths
  };
}

/**
 * 정기 월 납입액과 초기자산으로 달성 가능한 미래 가치 계산
 */
export function calculateAccumulatedWealth(
  initialAmount: number,
  monthlySavings: number,
  years: number,
  annualReturnRatePercent: number
): number {
  const months = Math.round(Math.max(0, years) * 12);
  const safeInitial = Math.max(0, initialAmount);
  const safeMonthly = Math.max(0, monthlySavings);

  if (months === 0) return safeInitial;

  const annualReturn = Math.max(-0.99, annualReturnRatePercent / 100);
  if (annualReturn === 0) {
    return safeInitial + safeMonthly * months;
  }

  const rm = Math.pow(1 + annualReturn, 1 / 12) - 1;
  const lumpSumFV = safeInitial * Math.pow(1 + rm, months);
  const annuityFV = safeMonthly * ((Math.pow(1 + rm, months) - 1) / rm);

  return Math.round(lumpSumFV + annuityFV);
}
