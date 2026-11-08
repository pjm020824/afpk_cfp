/**
 * 대출 상환 방식별 계산 모듈
 * 1) 원리금균등분할상환
 * 2) 원금균등분할상환
 * 3) 만기일시상환
 */

import { LoanRepaymentType } from '../types/financial';

export interface LoanCalculationResult {
  monthlyPayment: number;       // 첫 달 기준 월 상환액 (원금+이자)
  averageMonthlyPayment: number;// 평균 월 상환액
  totalInterest: number;        // 만기까지의 총이자
  totalPayment: number;         // 총 상환금액 (원금+총이자)
  schedulePreview: Array<{
    month: number;
    principalPayment: number;
    interestPayment: number;
    totalMonthPayment: number;
    remainingBalance: number;
  }>;
}

/**
 * 대출 상환액 계산 함수
 * @param principal 대출 원금(잔액) (원)
 * @param annualRatePercent 연 이자율 (%) e.g. 4.5
 * @param months 남은 상환 기간 (개월)
 * @param type 상환 방식
 */
export function calculateLoan(
  principal: number,
  annualRatePercent: number,
  months: number,
  type: LoanRepaymentType
): LoanCalculationResult {
  const safePrincipal = Math.max(0, Math.round(principal));
  const safeMonths = Math.max(0, Math.floor(months));
  const safeRate = Math.max(0, annualRatePercent);

  if (safePrincipal === 0 || safeMonths === 0) {
    return {
      monthlyPayment: 0,
      averageMonthlyPayment: 0,
      totalInterest: 0,
      totalPayment: safePrincipal,
      schedulePreview: []
    };
  }

  // 월 이자율 (명목 연이율 기준 12분할)
  const monthlyRate = safeRate / 100 / 12;

  let schedule: LoanCalculationResult['schedulePreview'] = [];
  let totalInterest = 0;
  let firstMonthPayment = 0;

  if (type === 'bullet') {
    // 만기일시상환: 매월 이자만 납입, 만기에 원금 일시상환
    const monthlyInterest = Math.round(safePrincipal * monthlyRate);
    firstMonthPayment = monthlyInterest;
    totalInterest = monthlyInterest * safeMonths;

    for (let m = 1; m <= Math.min(12, safeMonths); m++) {
      const isLast = m === safeMonths;
      schedule.push({
        month: m,
        principalPayment: isLast ? safePrincipal : 0,
        interestPayment: monthlyInterest,
        totalMonthPayment: monthlyInterest + (isLast ? safePrincipal : 0),
        remainingBalance: isLast ? 0 : safePrincipal
      });
    }

    return {
      monthlyPayment: monthlyInterest,
      averageMonthlyPayment: monthlyInterest + Math.round(safePrincipal / safeMonths),
      totalInterest,
      totalPayment: safePrincipal + totalInterest,
      schedulePreview: schedule
    };
  }

  if (monthlyRate === 0) {
    // 무이자 대출 (0% 금리 예외 처리)
    const monthlyPrincipal = Math.round(safePrincipal / safeMonths);
    for (let m = 1; m <= Math.min(12, safeMonths); m++) {
      schedule.push({
        month: m,
        principalPayment: monthlyPrincipal,
        interestPayment: 0,
        totalMonthPayment: monthlyPrincipal,
        remainingBalance: Math.max(0, safePrincipal - monthlyPrincipal * m)
      });
    }

    return {
      monthlyPayment: monthlyPrincipal,
      averageMonthlyPayment: monthlyPrincipal,
      totalInterest: 0,
      totalPayment: safePrincipal,
      schedulePreview: schedule
    };
  }

  if (type === 'equal_principal_interest') {
    // 원리금균등상환: PMT = P * r * (1+r)^n / ((1+r)^n - 1)
    const factor = Math.pow(1 + monthlyRate, safeMonths);
    const pmt = Math.round((safePrincipal * monthlyRate * factor) / (factor - 1));
    firstMonthPayment = pmt;

    let balance = safePrincipal;
    let accumulatedInterest = 0;

    for (let m = 1; m <= safeMonths; m++) {
      const interest = Math.round(balance * monthlyRate);
      accumulatedInterest += interest;
      const principalPart = m === safeMonths ? balance : Math.min(balance, pmt - interest);
      balance = Math.max(0, balance - principalPart);

      if (m <= 12 || m === safeMonths) {
        schedule.push({
          month: m,
          principalPayment: principalPart,
          interestPayment: interest,
          totalMonthPayment: principalPart + interest,
          remainingBalance: balance
        });
      }
    }

    totalInterest = accumulatedInterest;

    return {
      monthlyPayment: firstMonthPayment,
      averageMonthlyPayment: firstMonthPayment,
      totalInterest,
      totalPayment: safePrincipal + totalInterest,
      schedulePreview: schedule.slice(0, 12)
    };
  }

  // equal_principal: 원금균등상환
  // 매월 동일한 원금 상환 + 잔액에 대한 이자 (매월 상환액 체감)
  const monthlyPrincipal = Math.floor(safePrincipal / safeMonths);
  let balance = safePrincipal;
  let accumulatedInterest = 0;

  for (let m = 1; m <= safeMonths; m++) {
    const interest = Math.round(balance * monthlyRate);
    accumulatedInterest += interest;
    const principalPart = m === safeMonths ? balance : monthlyPrincipal;
    const monthTotal = principalPart + interest;

    if (m === 1) firstMonthPayment = monthTotal;

    balance = Math.max(0, balance - principalPart);

    if (m <= 12 || m === safeMonths) {
      schedule.push({
        month: m,
        principalPayment: principalPart,
        interestPayment: interest,
        totalMonthPayment: monthTotal,
        remainingBalance: balance
      });
    }
  }

  totalInterest = accumulatedInterest;

  return {
    monthlyPayment: firstMonthPayment,
    averageMonthlyPayment: Math.round((safePrincipal + totalInterest) / safeMonths),
    totalInterest,
    totalPayment: safePrincipal + totalInterest,
    schedulePreview: schedule.slice(0, 12)
  };
}
