/**
 * 재무목표 평가 및 다중 목표 충돌(Goal Conflict) 분석 엔진
 * 목표별 필요 월 저축액과 가용현금흐름 간의 정량적 비교 및 우선순위 분석
 */

import { CalculatedFinancialHealth, CalculatedGoalEvaluation, GoalConflictAnalysis, UserFinancialProfile } from '../types/financial';
import { calculateGoalFutureValue } from './futureValue';

export interface EvaluatedGoalsResult {
  goals: CalculatedGoalEvaluation[];
  conflictAnalysis: GoalConflictAnalysis;
}

export function evaluateGoalsAndConflicts(
  profile: UserFinancialProfile,
  health: CalculatedFinancialHealth
): EvaluatedGoalsResult {
  const returnRate = profile.assumptions.expectedReturnRate;
  const inflationRate = profile.assumptions.inflationRate;

  // 1. 개별 목표 평가
  const evaluatedGoals: CalculatedGoalEvaluation[] = profile.goals.map(goal => {
    const fvResult = calculateGoalFutureValue(
      goal.targetAmount,
      goal.currentAmount,
      goal.targetYears,
      returnRate,
      inflationRate
    );

    const isDirectlyAchieved = fvResult.shortfallAmount <= 0;
    const canBeAchievedWithCurrentCashflow = isDirectlyAchieved ||
      (fvResult.requiredMonthlySavings <= health.monthlyAvailableCashflow);

    const achievablePercentage = fvResult.futureTargetAmount > 0
      ? Math.min(100, Math.round((fvResult.fvOfCurrentAmount / fvResult.futureTargetAmount) * 100))
      : 100;

    return {
      goalId: goal.id,
      name: goal.name,
      category: goal.category,
      targetAmount: goal.targetAmount,
      targetYears: goal.targetYears,
      currentAmount: goal.currentAmount,
      priority: goal.priority,
      isFlexible: goal.isFlexible,
      fvOfCurrentAmount: fvResult.fvOfCurrentAmount,
      futureTargetAmountInflationAdjusted: fvResult.futureTargetAmount,
      shortfallAmount: fvResult.shortfallAmount,
      requiredMonthlySavings: fvResult.requiredMonthlySavings,
      achievablePercentage,
      canBeAchievedWithCurrentCashflow
    };
  });

  // 2. 전체 목표 필요 저축액 합계
  const totalRequiredMonthlySavings = evaluatedGoals.reduce(
    (sum, g) => sum + g.requiredMonthlySavings,
    0
  );

  const availableMonthlyCashflow = health.monthlyAvailableCashflow;
  const currentMonthlySavings = health.totalMonthlySavingsAndInvestment;
  const surplusOrDeficit = availableMonthlyCashflow - totalRequiredMonthlySavings;
  const hasConflict = surplusOrDeficit < 0 && evaluatedGoals.length > 0;

  // 3. 충돌 강도 및 우선순위 결손액 계산
  let conflictSeverity: GoalConflictAnalysis['conflictSeverity'] = 'none';
  if (hasConflict) {
    const deficitRatio = Math.abs(surplusOrDeficit) / Math.max(1, availableMonthlyCashflow);
    if (deficitRatio > 0.6) conflictSeverity = 'severe';
    else if (deficitRatio > 0.25) conflictSeverity = 'moderate';
    else conflictSeverity = 'mild';
  }

  // 중요도 높은 목표들의 필요 저축액
  const highPriorityGoals = evaluatedGoals.filter(g => g.priority === 'high');
  const highPriorityRequired = highPriorityGoals.reduce((sum, g) => sum + g.requiredMonthlySavings, 0);
  const highPriorityShortfall = Math.max(0, highPriorityRequired - availableMonthlyCashflow);

  // 충돌하는 목표 수 판별 (모든 목표를 동시 적립하지 못할 때)
  const conflictedGoalsCount = hasConflict ? evaluatedGoals.length : 0;

  // 4. CFP 권고안 생성 (정량적 수치 기반)
  const recommendations: string[] = [];

  if (!hasConflict && evaluatedGoals.length > 0) {
    recommendations.push(
      `현재 월 가용현금흐름(${Math.round(availableMonthlyCashflow / 10000).toLocaleString()}만 원)으로 등록된 모든 재무목표의 필요 월 저축액(${Math.round(totalRequiredMonthlySavings / 10000).toLocaleString()}만 원)을 충당할 수 있습니다.`
    );
    if (surplusOrDeficit > 0) {
      recommendations.push(
        `목표 적립 후에도 매월 약 ${Math.round(surplusOrDeficit / 10000).toLocaleString()}만 원의 여유 자금이 발생하므로, 추가 투자 또는 은퇴자산 확대로 활용 가능합니다.`
      );
    }
  } else if (hasConflict) {
    recommendations.push(
      `등록된 ${evaluatedGoals.length}개 재무목표를 동시에 달성하려면 매월 ${Math.round(totalRequiredMonthlySavings / 10000).toLocaleString()}만 원이 필요하나, 현재 가용현금흐름은 ${Math.round(availableMonthlyCashflow / 10000).toLocaleString()}만 원으로 매월 약 ${Math.round(Math.abs(surplusOrDeficit) / 10000).toLocaleString()}만 원이 부족합니다.`
    );

    if (highPriorityShortfall > 0) {
      recommendations.push(
        `[경고] '높음' 우선순위 목표만으로도 가용현금흐름을 ${Math.round(highPriorityShortfall / 10000).toLocaleString()}만 원 초과합니다. 고정지출 절감 또는 목표금액·시점의 재설계가 필수적입니다.`
      );
    } else {
      recommendations.push(
        `다행히 '높음' 우선순위 목표(${highPriorityGoals.map(g => `'${g.name}'`).join(', ')})는 현재 가용현금으로 충당 가능하므로, '보통' 또는 '낮음' 목표의 달성 시점을 1~3년 연기하거나 목표 금액을 현실화하는 전략을 권장합니다.`
      );
    }

    const flexibleGoals = evaluatedGoals.filter(g => g.isFlexible);
    if (flexibleGoals.length > 0) {
      recommendations.push(
        `사용자가 조율 가능하다고 설정한 목표(${flexibleGoals.map(g => g.name).join(', ')})의 기간을 연장하면 매월 필요한 저축 부담이 대폭 완화됩니다.`
      );
    }
  }

  return {
    goals: evaluatedGoals,
    conflictAnalysis: {
      totalRequiredMonthlySavings,
      availableMonthlyCashflow,
      currentMonthlySavings,
      surplusOrDeficit,
      hasConflict,
      conflictSeverity,
      conflictedGoalsCount,
      highPriorityShortfall,
      recommendations
    }
  };
}
