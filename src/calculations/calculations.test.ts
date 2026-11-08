/**
 * 재무계산 엔진 단위 테스트 (Unit Tests)
 * Section 12 규격: 0값, 역전현상, 금리0%, 상환방식별 검증, 은퇴고갈 검증
 */

import { calculateFinancialHealth } from './indicators';
import { calculateLoan } from './loans';
import { calculateGoalFutureValue, calculateAccumulatedWealth } from './futureValue';
import { calculateRetirementAnalysis } from './retirement';
import { evaluateGoalsAndConflicts } from './goalConflict';
import { UserFinancialProfile } from '../types/financial';

function createMockProfile(overrides: Partial<UserFinancialProfile> = {}): UserFinancialProfile {
  return {
    age: 30,
    householdType: 'single',
    dependentsCount: 0,
    employmentStatus: 'employed',
    expectedRetirementAge: 60,
    interests: ['자산형성'],
    income: {
      monthlySalary: 3000000,
      monthlyBusiness: 0,
      monthlyPension: 0,
      monthlyOther: 0
    },
    expenses: {
      housing: 500000,
      living: 700000,
      transportCommunication: 200000,
      education: 100000,
      insurance: 100000,
      otherConsumption: 200000
    },
    savingsAndInvestment: {
      monthlySavings: 600000,
      monthlyInvestment: 400000,
      monthlyPensionSavings: 200000
    },
    assets: {
      cashAndChecking: 5000000,
      savingsDeposits: 10000000,
      stocksFunds: 10000000,
      pensionAssets: 5000000,
      realEstate: 0,
      otherAssets: 0
    },
    debts: [],
    goals: [],
    assumptions: {
      expectedReturnRate: 5.0,
      inflationRate: 2.0,
      incomeGrowthRate: 2.0,
      savingsGrowthRate: 2.0,
      retirementMonthlyExpenses: 2000000,
      lifeExpectancy: 90
    },
    ...overrides
  };
}

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passed++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    failed++;
    console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
  }
}

console.log('--- LifePlan AI 금융계산 엔진 단위 테스트 시작 ---');

// 1. 모든 금액이 0인 경우
{
  const zeroProfile = createMockProfile({
    income: { monthlySalary: 0, monthlyBusiness: 0, monthlyPension: 0, monthlyOther: 0 },
    expenses: { housing: 0, living: 0, transportCommunication: 0, education: 0, insurance: 0, otherConsumption: 0 },
    savingsAndInvestment: { monthlySavings: 0, monthlyInvestment: 0, monthlyPensionSavings: 0 },
    assets: { cashAndChecking: 0, savingsDeposits: 0, stocksFunds: 0, pensionAssets: 0, realEstate: 0, otherAssets: 0 },
    debts: []
  });
  const health = calculateFinancialHealth(zeroProfile);
  assert(health.totalAssets === 0, '모든 자산이 0일 때 총자산 0');
  assert(health.netWorth === 0, '모든 부채 및 자산 0일 때 순자산 0');
  assert(health.actualSavingsRate === 0, '소득 0일 때 실제저축률 0% (NaN 방지)');
  assert(health.debtServiceRatio === 0, '소득 0일 때 부채상환부담비율 0% (0 나누기 방지)');
}

// 2. 소득보다 지출이 큰 경우 (적자 가계)
{
  const deficitProfile = createMockProfile({
    income: { monthlySalary: 2000000, monthlyBusiness: 0, monthlyPension: 0, monthlyOther: 0 },
    expenses: { housing: 1000000, living: 1500000, transportCommunication: 200000, education: 0, insurance: 100000, otherConsumption: 200000 }
  }); // 지출 3,000,000원 > 소득 2,000,000원
  const health = calculateFinancialHealth(deficitProfile);
  assert(health.monthlyAvailableCashflow === -1000000, '적자 가계 월 가용현금흐름 음수(-100만 원) 정확히 산출');
}

// 3. 자산보다 부채가 큰 경우 (자본잠식/순부채)
{
  const insolventProfile = createMockProfile({
    assets: { cashAndChecking: 5000000, savingsDeposits: 0, stocksFunds: 0, pensionAssets: 0, realEstate: 0, otherAssets: 0 },
    debts: [
      {
        id: 'd1',
        name: '신용대출',
        category: 'credit',
        balance: 30000000,
        annualInterestRate: 6.0,
        remainingMonths: 36,
        repaymentType: 'equal_principal_interest',
        currentMonthlyPayment: 912000
      }
    ]
  });
  const health = calculateFinancialHealth(insolventProfile);
  assert(health.totalDebts === 30000000, '총부채 3,000만 원 정확성');
  assert(health.netWorth === -25000000, '순부채 상태에서 음수 순자산(-2,500만 원) 계산');
}

// 4. 대출 금리 0% (무이자 대출)
{
  const zeroInterestLoan = calculateLoan(12000000, 0, 12, 'equal_principal_interest');
  assert(zeroInterestLoan.monthlyPayment === 1000000, '0% 금리 시 원금 1200만원 12개월 월 상환액 100만원');
  assert(zeroInterestLoan.totalInterest === 0, '0% 금리 시 총이자 0원');
}

// 5. 대출 상환방식 3종 비교 검증 (1,000만원, 12개월, 연 12%)
{
  const pmtEqualPI = calculateLoan(10000000, 12, 12, 'equal_principal_interest');
  const pmtEqualP = calculateLoan(10000000, 12, 12, 'equal_principal');
  const pmtBullet = calculateLoan(10000000, 12, 12, 'bullet');

  assert(pmtEqualPI.monthlyPayment > 0, '원리금균등 월 상환액 계산 성공');
  assert(pmtEqualP.monthlyPayment > pmtEqualPI.monthlyPayment, '원금균등의 첫 달 상환액은 원리금균등보다 큼');
  assert(pmtBullet.totalInterest > pmtEqualPI.totalInterest, '만기일시 총이자가 분할상환보다 큼');
  assert(pmtEqualPI.totalInterest > pmtEqualP.totalInterest, '원리금균등 총이자가 원금균등 총이자보다 큼');
}

// 6. 목표기간이 0인 경우 및 이미 목표금액이 달성된 경우
{
  const zeroTermGoal = calculateGoalFutureValue(10000000, 10000000, 0, 5, 2);
  assert(zeroTermGoal.shortfallAmount === 0, '목표금액 이미 확보 시 부족액 0');
  assert(zeroTermGoal.requiredMonthlySavings === 0, '목표금액 이미 확보 시 필요 월 저축액 0');

  const zeroTermShortfall = calculateGoalFutureValue(10000000, 4000000, 0, 5, 2);
  assert(zeroTermShortfall.shortfallAmount === 6000000, '기간 0년 시 즉시 부족액 전액 일치');
}

// 7. 연 유효수익률 기반 월 복리 변환 정확성
{
  // 연 12% 단리 vs 복리: (1+0.12)^(1/12) - 1 약 0.00948879
  const fvRes = calculateGoalFutureValue(10000000, 0, 1, 12, 0);
  assert(fvRes.effectiveMonthlyRate > 0.0094 && fvRes.effectiveMonthlyRate < 0.0096, '연 유효수익률의 월 복리 전환율 오차 검증');
}

// 8. 다중 재무목표 충돌 분석 (필요 저축액 > 가용현금)
{
  const profileWithGoals = createMockProfile({
    income: { monthlySalary: 3000000, monthlyBusiness: 0, monthlyPension: 0, monthlyOther: 0 },
    expenses: { housing: 500000, living: 1000000, transportCommunication: 200000, education: 100000, insurance: 100000, otherConsumption: 300000 },
    debts: [],
    goals: [
      {
        id: 'g1',
        category: 'housing',
        name: '3년 후 아파트 계약금 1억',
        targetAmount: 100000000,
        targetYears: 3,
        currentAmount: 0,
        priority: 'high',
        isFlexible: false
      },
      {
        id: 'g2',
        category: 'wedding',
        name: '2년 후 결혼자금 5천만원',
        targetAmount: 50000000,
        targetYears: 2,
        currentAmount: 0,
        priority: 'high',
        isFlexible: false
      }
    ]
  });
  const health = calculateFinancialHealth(profileWithGoals);
  const evalResult = evaluateGoalsAndConflicts(profileWithGoals, health);

  assert(evalResult.conflictAnalysis.hasConflict === true, '가용현금 초과 목표 설정 시 충돌(Conflict) 감지 성공');
  assert(evalResult.conflictAnalysis.surplusOrDeficit < 0, '부족액(Deficit) 음수 검증');
  assert(evalResult.conflictAnalysis.recommendations.length > 0, '충돌 완화를 위한 권고문 생성 확인');
}

// 10. 가상 고객 '55세 직장인 박진우' 은퇴 사례 독립 검증 (Section 3 규격)
{
  // 박진우 고객 프로필: 55세, 은퇴 60세, 기대수명 90세, 수익률 4.5%, 물가 2.2%, 은퇴생활비 월 280만
  // 초기자산: 주식/펀드 1억 + 연금자산 1억 + 예적금 8000만 = 2.8억
  // 월 저축적립: 50만 + 50만 + 70만 = 170만 (연 2,040만 원)
  const parkProfile = createMockProfile({
    age: 55,
    expectedRetirementAge: 60,
    income: { monthlySalary: 5000000, monthlyBusiness: 0, monthlyPension: 0, monthlyOther: 0 },
    expenses: { housing: 400000, living: 1400000, transportCommunication: 400000, education: 500000, insurance: 300000, otherConsumption: 200000 },
    savingsAndInvestment: { monthlySavings: 500000, monthlyInvestment: 500000, monthlyPensionSavings: 700000 },
    assets: { cashAndChecking: 20000000, savingsDeposits: 80000000, stocksFunds: 100000000, pensionAssets: 100000000, realEstate: 450000000, otherAssets: 0 },
    debts: [{ id: 'm1', name: '담보대출', category: 'mortgage', balance: 10000000, annualInterestRate: 3.5, remainingMonths: 36, repaymentType: 'equal_principal_interest', currentMonthlyPayment: 293000 }],
    assumptions: {
      expectedReturnRate: 4.5,
      inflationRate: 2.2,
      incomeGrowthRate: 0,
      savingsGrowthRate: 0,
      retirementMonthlyExpenses: 2800000,
      lifeExpectancy: 90
    }
  });

  const parkRetirement = calculateRetirementAnalysis(parkProfile);

  // ① 60세 은퇴시점 준비자산 검증 (약 4억 6,053만 원)
  assert(
    parkRetirement.accumulatedAtRetirement >= 460000000 && parkRetirement.accumulatedAtRetirement <= 461000000,
    '박진우 60세 은퇴 준비자산 4억 6,053만 원(±0.1%) 정확성',
    `실제 계산값: ${parkRetirement.accumulatedAtRetirement}`
  );

  // ② 은퇴시점 필요자금 검증 (약 9억 4,599만 원)
  assert(
    parkRetirement.requiredAtRetirement >= 945000000 && parkRetirement.requiredAtRetirement <= 946500000,
    '박진우 은퇴 필요자금 9억 4,599만 원(±0.1%) 정확성',
    `실제 계산값: ${parkRetirement.requiredAtRetirement}`
  );

  // ③ 부족액 검증 (약 4억 8,545만 원)
  assert(
    parkRetirement.shortfallAtRetirement >= 485000000 && parkRetirement.shortfallAtRetirement <= 486000000,
    '박진우 은퇴 부족액 4억 8,545만 원(±0.1%) 정확성',
    `실제 계산값: ${parkRetirement.shortfallAtRetirement}`
  );

  // ④ 자산 소진 예상 나이 검증 (73세)
  assert(
    parkRetirement.depletionAge === 73,
    '박진우 은퇴 자산 소진 예상 나이 73세 검증',
    `실제 계산 나이: ${parkRetirement.depletionAge}`
  );

  // ⑤ 피셔 방정식 실질 할인율 검증: (1+0.03375)/(1+0.022) - 1 약 1.1497%
  assert(
    parkRetirement.realDiscountRatePercent > 1.14 && parkRetirement.realDiscountRatePercent < 1.16,
    '피셔 실질 할인율 (1.1497%) 정확성',
    `실제값: ${parkRetirement.realDiscountRatePercent}%`
  );
}

// 11. 피셔 실질수익률 공식 및 물가상승률 비왜곡 검증
{
  const rNom = 0.05; // 명목 5%
  const infl = 0.02; // 물가 2%
  const rRealExpected = (1 + rNom) / (1 + infl) - 1; // 약 2.9412%
  const rRealApprox = rNom - infl; // 단순 근사치 3.0%
  assert(Math.abs(rRealExpected - 0.02941176) < 1e-6, '피셔 정확식 (1+r)/(1+i)-1 정밀도 검증');
  assert(rRealExpected < rRealApprox, '복리 실질수익률이 단순 차감치보다 보수적임 검증');
}

// 12. 현금흐름 이중 차감 배제 검증
{
  const testProf = createMockProfile({
    income: { monthlySalary: 4000000, monthlyBusiness: 0, monthlyPension: 0, monthlyOther: 0 },
    expenses: { housing: 1000000, living: 1000000, transportCommunication: 0, education: 0, insurance: 0, otherConsumption: 0 }, // 소비: 200만
    debts: [{ id: 'd1', name: '대출', category: 'credit', balance: 10000000, annualInterestRate: 3, remainingMonths: 24, repaymentType: 'equal_principal_interest', currentMonthlyPayment: 500000 }], // 상환: 50만
    savingsAndInvestment: { monthlySavings: 1000000, monthlyInvestment: 0, monthlyPensionSavings: 0 } // 저축: 100만
  });
  const health = calculateFinancialHealth(testProf);

  // 가용현금 = 400만 - 200만(소비) - 50만(상환) = 150만 (저축 100만은 미차감)
  assert(health.monthlyAvailableCashflow === 1500000, '가용현금흐름에서 저축액 이중차감 배제 (150만 원)');
  // 잉여현금 = 150만 - 100만(저축) = 50만
  assert(health.unallocatedCashflow === 500000, '미배분 잉여현금흐름 (50만 원) 정확성');
}

console.log(`\n결과 요약: 총 ${passed + failed}개 테스트 중 ${passed}개 통과, ${failed}개 실패.`);

if (failed > 0) {
  process.exit(1);
}

