/**
 * 3대 재무 시나리오 시뮬레이션 및 정량 비교 모듈
 * 1. 현재 유지 (Current)
 * 2. 지출 개선 (Expense Reduction)
 * 3. 저축 확대 및 목표 조정 (Optimized & Adjusted Goals)
 */

import { CalculatedFinancialHealth, FinancialScenario, UserFinancialProfile } from '../types/financial';
import { calculateAccumulatedWealth, calculateGoalFutureValue } from './futureValue';
import { calculateRetirementAnalysis } from './retirement';

export interface ScenarioComparisonResult {
  scenarioA: FinancialScenario;
  scenarioB: FinancialScenario;
  scenarioC: FinancialScenario;
}

export function calculateScenarios(
  profile: UserFinancialProfile,
  health: CalculatedFinancialHealth,
  customExpenseReduction: number = 0
): ScenarioComparisonResult {
  // 기본 소비지출 중 조정 가능한 변동비 (식비/기타/교통)
  const variableExpenses = profile.expenses.living + profile.expenses.otherConsumption + profile.expenses.transportCommunication;
  const defaultExpenseReduction = customExpenseReduction > 0
    ? customExpenseReduction
    : Math.round(variableExpenses * 0.15); // 약 15% 절감 가정

  const baseReturnRate = profile.assumptions.expectedReturnRate;
  const inflationRate = profile.assumptions.inflationRate;

  // --- Scenario A: 현재 유지 ---
  const evalGoalsA = profile.goals.map(g => {
    const res = calculateGoalFutureValue(g.targetAmount, g.currentAmount, g.targetYears, baseReturnRate, inflationRate);
    return {
      goal: g,
      res,
      isAchievable: res.requiredMonthlySavings <= Math.max(0, health.monthlyAvailableCashflow)
    };
  });
  const totalShortfallA = evalGoalsA.reduce((sum, item) => sum + item.res.shortfallAmount, 0);
  const achievableCountA = evalGoalsA.filter(item => item.isAchievable).length;
  const netWorth10YrA = calculateAccumulatedWealth(health.totalAssets, health.totalMonthlySavingsAndInvestment, 10, baseReturnRate) - Math.max(0, health.totalDebts * 0.5);
  const retA = calculateRetirementAnalysis(profile);

  const scenarioA: FinancialScenario = {
    id: 'current',
    title: '시나리오 A: 현재 유지',
    description: '현재의 소득, 소비지출 및 저축 수준을 그대로 유지할 때의 재무적 결과입니다.',
    monthlyExpenseReduction: 0,
    additionalMonthlySavings: 0,
    adjustedReturnRate: baseReturnRate,
    adjustedGoals: profile.goals.map(g => ({ goalId: g.id, targetYears: g.targetYears, targetAmount: g.targetAmount })),
    monthlyAvailableCashflow: health.monthlyAvailableCashflow,
    monthlySavings: health.totalMonthlySavingsAndInvestment,
    goalsAchievableCount: achievableCountA,
    totalGoalsCount: profile.goals.length,
    totalMonthlyShortfall: totalShortfallA,
    projectedNetWorth10Yr: Math.max(0, netWorth10YrA),
    retirementDepletionAge: retA.depletionAge
  };

  // --- Scenario B: 지출 개선 (소비 절감 -> 전액 저축 전환) ---
  const newCashflowB = health.monthlyAvailableCashflow + defaultExpenseReduction;
  const newSavingsB = health.totalMonthlySavingsAndInvestment + defaultExpenseReduction;

  const evalGoalsB = profile.goals.map(g => {
    const res = calculateGoalFutureValue(g.targetAmount, g.currentAmount, g.targetYears, baseReturnRate, inflationRate);
    return {
      goal: g,
      res,
      isAchievable: res.requiredMonthlySavings <= newCashflowB
    };
  });
  const achievableCountB = evalGoalsB.filter(item => item.isAchievable).length;
  const netWorth10YrB = calculateAccumulatedWealth(health.totalAssets, newSavingsB, 10, baseReturnRate) - Math.max(0, health.totalDebts * 0.5);

  // 은퇴 시뮬레이션에서도 소비 감소 및 저축 증가 반영
  const profileB: UserFinancialProfile = {
    ...profile,
    expenses: {
      ...profile.expenses,
      otherConsumption: Math.max(0, profile.expenses.otherConsumption - defaultExpenseReduction)
    },
    savingsAndInvestment: {
      ...profile.savingsAndInvestment,
      monthlyInvestment: profile.savingsAndInvestment.monthlyInvestment + defaultExpenseReduction
    }
  };
  const retB = calculateRetirementAnalysis(profileB);

  const scenarioB: FinancialScenario = {
    id: 'expense_reduction',
    title: '시나리오 B: 지출 구조 개선',
    description: `불필요한 변동 소비를 월 ${Math.round(defaultExpenseReduction / 10000).toLocaleString()}만 원 절감하여 전액 투자·저축으로 전환한 시나리오입니다.`,
    monthlyExpenseReduction: defaultExpenseReduction,
    additionalMonthlySavings: defaultExpenseReduction,
    adjustedReturnRate: baseReturnRate,
    adjustedGoals: profile.goals.map(g => ({ goalId: g.id, targetYears: g.targetYears, targetAmount: g.targetAmount })),
    monthlyAvailableCashflow: newCashflowB,
    monthlySavings: newSavingsB,
    goalsAchievableCount: achievableCountB,
    totalGoalsCount: profile.goals.length,
    totalMonthlyShortfall: evalGoalsB.reduce((sum, item) => sum + item.res.shortfallAmount, 0),
    projectedNetWorth10Yr: Math.max(0, netWorth10YrB),
    retirementDepletionAge: retB.depletionAge
  };

  // --- Scenario C: 저축 확대 및 목표 유연화 (자산배분 다변화 + 유연 목표 기간 1~2년 연장) ---
  const optimizedReturnRate = Math.min(10, Number((baseReturnRate + 1.5).toFixed(1))); // 글로벌 분산투자로 기대수익률 1.5%p 개선 가정
  const adjustedGoalsC = profile.goals.map(g => {
    // 유연한 목표이거나 보통/낮음 중요도인 경우 기간 1~2년 완화
    const extension = g.isFlexible ? 2 : (g.priority === 'low' ? 1 : 0);
    return {
      goalId: g.id,
      targetYears: g.targetYears + extension,
      targetAmount: g.targetAmount
    };
  });

  const evalGoalsC = adjustedGoalsC.map(adj => {
    const original = profile.goals.find(g => g.id === adj.goalId)!;
    const res = calculateGoalFutureValue(
      adj.targetAmount,
      original.currentAmount,
      adj.targetYears,
      optimizedReturnRate,
      inflationRate
    );
    return {
      goal: original,
      res,
      isAchievable: res.requiredMonthlySavings <= newCashflowB
    };
  });

  const achievableCountC = evalGoalsC.filter(item => item.isAchievable).length;
  const netWorth10YrC = calculateAccumulatedWealth(health.totalAssets, newSavingsB, 10, optimizedReturnRate) - Math.max(0, health.totalDebts * 0.5);
  
  const profileC: UserFinancialProfile = {
    ...profileB,
    assumptions: {
      ...profileB.assumptions,
      expectedReturnRate: optimizedReturnRate
    }
  };
  const retC = calculateRetirementAnalysis(profileC);

  const scenarioC: FinancialScenario = {
    id: 'optimized',
    title: '시나리오 C: 저축 확대 및 목표 최적화',
    description: `지출 절감과 함께 자산배분 다변화(+1.5%p 기대수익) 및 유연한 목표의 달성 시점을 1~2년 조정하여 달성 가능성을 극대화한 시나리오입니다.`,
    monthlyExpenseReduction: defaultExpenseReduction,
    additionalMonthlySavings: defaultExpenseReduction,
    adjustedReturnRate: optimizedReturnRate,
    adjustedGoals: adjustedGoalsC,
    monthlyAvailableCashflow: newCashflowB,
    monthlySavings: newSavingsB,
    goalsAchievableCount: achievableCountC,
    totalGoalsCount: profile.goals.length,
    totalMonthlyShortfall: evalGoalsC.reduce((sum, item) => sum + item.res.shortfallAmount, 0),
    projectedNetWorth10Yr: Math.max(0, netWorth10YrC),
    retirementDepletionAge: retC.depletionAge
  };

  return { scenarioA, scenarioB, scenarioC };
}
