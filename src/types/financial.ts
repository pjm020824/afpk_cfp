/**
 * LifePlan AI - Financial Planning Type Definitions
 * CFP 7단계 절차 및 한국 금융제도 기반 데이터 모델
 */

export type HouseholdType = 'single' | 'couple_no_kids' | 'couple_with_kids' | 'single_parent' | 'multi_generation';
export type EmploymentStatus = 'employed' | 'self_employed' | 'freelancer' | 'civil_servant' | 'retired' | 'student_unemployed';

export type GoalCategory = 
  | 'emergency_fund'   // 비상자금
  | 'debt_repayment'   // 부채상환 (학자금/신용대출 등)
  | 'wedding'          // 결혼자금
  | 'housing'          // 주택자금 (전세/내집마련)
  | 'education'        // 자녀교육비
  | 'retirement'       // 은퇴자금
  | 'seed_money'       // 종잣돈 마련
  | 'custom';          // 사용자 정의

export type GoalPriority = 'high' | 'medium' | 'low';

export interface FinancialGoal {
  id: string;
  category: GoalCategory;
  name: string;
  targetAmount: number;     // 목표 금액 (원)
  targetYears: number;      // 달성 기간 (년)
  currentAmount: number;    // 현재 확보한 자금 (원)
  priority: GoalPriority;   // 중요도
  isFlexible: boolean;      // 목표 시점/금액 조정 가능 여부
  notes?: string;
}

export type LoanRepaymentType = 'equal_principal_interest' | 'equal_principal' | 'bullet'; // 원리금균등, 원금균등, 만기일시

export interface DebtItem {
  id: string;
  name: string;
  category: 'mortgage' | 'jeonse' | 'credit' | 'student' | 'other';
  balance: number;          // 대출 잔액 (원)
  annualInterestRate: number; // 연 이자율 (% 단위, e.g. 4.5)
  remainingMonths: number;  // 남은 기간 (개월)
  repaymentType: LoanRepaymentType;
  currentMonthlyPayment: number; // 현재 실제 월 상환액 (원)
}

export interface UserFinancialProfile {
  // Step 1: 기본 상황
  age: number;
  householdType: HouseholdType;
  dependentsCount: number;
  employmentStatus: EmploymentStatus;
  expectedRetirementAge: number;
  interests: string[];

  // Step 2: 월 소득 (세후, 원 단위)
  income: {
    monthlySalary: number;       // 세후 근로소득
    monthlyBusiness: number;     // 사업/부업소득
    monthlyPension: number;      // 연금소득
    monthlyOther: number;        // 기타 정기 수입
  };

  // Step 2: 월 지출 (원 단위) - 소비, 저축투자, 부채상환 엄격 분리
  expenses: {
    housing: number;             // 주거비 (월세, 관리비 등)
    living: number;              // 식비/생활비
    transportCommunication: number; // 교통/통신비
    education: number;           // 교육비
    insurance: number;           // 보장성 보험료
    otherConsumption: number;    // 기타 소비지출
  };
  
  // 정기 저축 및 투자 (소비지출과 분리)
  savingsAndInvestment: {
    monthlySavings: number;      // 정기예적금 납입
    monthlyInvestment: number;   // 주식/펀드/ETF 적립
    monthlyPensionSavings: number; // 연금저축/IRP 납입
  };

  // Step 3: 보유 자산 (원 단위)
  assets: {
    cashAndChecking: number;     // 현금 및 수시입출금 (비상자금 후보)
    savingsDeposits: number;     // 정기예금/적금
    stocksFunds: number;         // 주식/ETF/펀드
    pensionAssets: number;       // 연금저축/IRP/DC퇴직연금
    realEstate: number;          // 주택/부동산
    otherAssets: number;         // 기타 자산
  };

  // Step 3: 부채 목록
  debts: DebtItem[];

  // Step 4: 재무목표 목록
  goals: FinancialGoal[];

  // Step 5: 계산 가정
  assumptions: {
    expectedReturnRate: number;      // 예상 연간 자산수익률 (% 단위, e.g. 5.0)
    inflationRate: number;           // 연간 물가상승률 (% 단위, e.g. 2.5)
    incomeGrowthRate: number;        // 연간 소득증가율 (% 단위, e.g. 2.0)
    savingsGrowthRate: number;       // 연간 저축증가율 (% 단위, e.g. 2.0)
    retirementMonthlyExpenses: number; // 은퇴 후 예상 월 생활비 (현재가치 기준, 원)
    lifeExpectancy: number;          // 기대수명 (e.g. 90)
  };
}

export interface CalculatedFinancialHealth {
  totalAssets: number;
  liquidAssets: number;
  investmentAssets: number;
  pensionAssets: number;
  fixedAssets: number;
  totalDebts: number;
  netWorth: number;

  totalMonthlyIncome: number;
  totalMonthlyConsumption: number;
  totalMonthlyDebtPayment: number;
  totalMonthlySavingsAndInvestment: number;

  monthlyAvailableCashflow: number; // 월 가용현금흐름 = 세후수입 - 소비지출 - 대출원리금상환액
  unallocatedCashflow: number;      // 월 잉여현금 = 가용현금흐름 - 실제저축투자액

  actualSavingsRate: number;        // 실제 저축률 = 저축투자액 / 세후수입 * 100
  theoreticalSavingsCapacityRate: number; // 이론적 저축여력 비율 = 가용현금흐름 / 세후수입 * 100
  debtServiceRatio: number;         // 관리용 부채상환부담비율 = 월 부채상환액 / 세후수입 * 100
  emergencyFundMonths: number;      // 비상자금 확보 개월 수 = 즉시 사용가능 유동성 / 필수지출

  liquidityStatus: 'danger' | 'caution' | 'healthy' | 'optimal';
  debtStatus: 'low' | 'moderate' | 'high' | 'critical';
  savingsStatus: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface CalculatedGoalEvaluation {
  goalId: string;
  name: string;
  category: GoalCategory;
  targetAmount: number;
  targetYears: number;
  currentAmount: number;
  priority: GoalPriority;
  isFlexible: boolean;

  fvOfCurrentAmount: number;
  futureTargetAmountInflationAdjusted: number; // 물가반영 미래 목표액
  shortfallAmount: number;
  requiredMonthlySavings: number; // 달성을 위해 매월 필요한 저축액
  achievablePercentage: number;
  canBeAchievedWithCurrentCashflow: boolean;
}

export interface GoalConflictAnalysis {
  totalRequiredMonthlySavings: number;
  availableMonthlyCashflow: number;
  currentMonthlySavings: number;
  surplusOrDeficit: number; // 양수: 여유, 음수: 부족액
  hasConflict: boolean;
  conflictSeverity: 'none' | 'mild' | 'moderate' | 'severe';
  conflictedGoalsCount: number;
  highPriorityShortfall: number;
  recommendations: string[];
}

export interface RetirementSimulationYear {
  age: number;
  year: number;
  isRetired: boolean;
  annualIncome: number;
  annualExpense: number;
  pensionIncome: number;
  netAnnualCashflow: number;
  beginningAssets: number;
  investmentReturn: number;
  endingAssets: number;
}

export interface RetirementAnalysisResult {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  yearsToRetirement: number;
  retirementDurationYears: number;
  accumulatedAtRetirement: number;
  requiredAtRetirement: number;
  requiredAtRetirementPresentValue: number; // 은퇴 시점 필요자금의 현재가치(PV)
  shortfallAtRetirement: number;
  depletionAge: number | null; // null이면 평생 안전
  isDepletedBeforeLifeExpectancy: boolean;
  preRetirementReturnPercent: number;  // 은퇴 전 연 운용수익률 (%)
  postRetirementReturnPercent: number; // 은퇴 후 연 보수적 운용수익률 (%)
  inflationRatePercent: number;        // 적용 연 물가상승률 (%)
  realDiscountRatePercent: number;     // 피셔 공식 실질 할인율 (%)
  firstYearAnnualLivingExpense: number;// 은퇴 첫해 연 생활비 (물가반영 미래 명목가치)
  simulationSchedule: RetirementSimulationYear[];
}

export interface FinancialScenario {
  id: 'current' | 'expense_reduction' | 'optimized';
  title: string;
  description: string;
  monthlyExpenseReduction: number;
  additionalMonthlySavings: number;
  adjustedReturnRate: number;
  adjustedGoals: Array<{ goalId: string; targetYears: number; targetAmount: number }>;
  
  monthlyAvailableCashflow: number;
  monthlySavings: number;
  goalsAchievableCount: number;
  totalGoalsCount: number;
  totalMonthlyShortfall: number;
  projectedNetWorth10Yr: number;
  retirementDepletionAge: number | null;
}

export interface AIAnalysisReport {
  summary: {
    headline: string;
    netWorthText: string;
    cashflowEvaluation: string;
    keyStrengths: string[];
    keyConcerns: string[];
  };
  diagnoses: Array<{
    title: string;
    severity: 'critical' | 'warning' | 'info';
    cause: string;
    metrics: string;
    recommendation: string;
  }>;
  goalsEvaluationText: {
    conflictAnalysis: string;
    priorityStrategy: string;
  };
  scenarioComparisonText: {
    verdict: string;
    tradeoffs: string;
  };
  actionPlan: {
    immediate: string[];  // 즉시 실행 (1개월 내)
    midTerm: string[];    // 3개월 내 점검
    longTerm: string[];   // 1년 내 재검토
  };
  assumptionsAndLimits: {
    formulasUsed: string[];
    caveats: string[];
    furtherVerificationNeeded: string[];
  };
  isAIGenerated: boolean;
  generatedAt: string;
}
