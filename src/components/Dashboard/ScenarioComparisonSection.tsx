import React, { useState } from 'react';
import { ScenarioComparisonResult } from '../../calculations/scenarios';
import { formatKRW } from '../../utils/formatters';
import { TrendingUp, Sliders, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ScenarioProps {
  scenarios: ScenarioComparisonResult;
  onUpdateExpenseReduction: (amount: number) => void;
  currentExpenseReduction: number;
}

export const ScenarioComparisonSection: React.FC<ScenarioProps> = ({
  scenarios,
  onUpdateExpenseReduction,
  currentExpenseReduction
}) => {
  const { scenarioA, scenarioB, scenarioC } = scenarios;

  const netWorthDiffB = scenarioB.projectedNetWorth10Yr - scenarioA.projectedNetWorth10Yr;
  const netWorthDiffC = scenarioC.projectedNetWorth10Yr - scenarioA.projectedNetWorth10Yr;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md space-y-6">
      
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">3대 재무 시나리오 미래 시뮬레이션 비교</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            동일한 경제 환경에서 고객의 재무적 선택(지출 절감, 목표 유연화)에 따른 10년 후 결과를 정량 비교합니다.
          </p>
        </div>

        {/* 인터랙티브 지출절감 슬라이더 컨트롤러 */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col space-y-1.5 min-w-[240px]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center space-x-1">
              <Sliders className="w-3 h-3 text-blue-400" />
              <span>월 소비지출 절감액:</span>
            </span>
            <span className="font-bold text-emerald-400">{formatKRW(currentExpenseReduction)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1500000"
            step="50000"
            value={currentExpenseReduction}
            onChange={(e) => onUpdateExpenseReduction(parseInt(e.target.value) || 0)}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-[10px] text-slate-500 text-right">0원 ~ 150만 원 조절 가능</span>
        </div>
      </div>

      {/* 3대 시나리오 비교 카드 뷰 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 시나리오 A */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                시나리오 A
              </span>
              <span className="text-xs text-slate-500">기준점</span>
            </div>
            <h4 className="font-bold text-white text-sm mt-2">{scenarioA.title}</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {scenarioA.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>월 가용 현금흐름:</span>
                <span className="text-white font-medium">{formatKRW(scenarioA.monthlyAvailableCashflow)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>목표 달성 가능률:</span>
                <span className="text-amber-400 font-semibold">{scenarioA.goalsAchievableCount} / {scenarioA.totalGoalsCount}개</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>은퇴자산 소진 시점:</span>
                <span className="text-rose-300 font-medium">
                  {scenarioA.retirementDepletionAge ? `${scenarioA.retirementDepletionAge}세 소진 위험` : '평생 안전'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block">10년 후 예상 순자산</span>
            <span className="text-lg font-black text-white">{formatKRW(scenarioA.projectedNetWorth10Yr)}</span>
          </div>
        </div>

        {/* 시나리오 B */}
        <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 shadow-sm space-y-3 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                시나리오 B
              </span>
              <span className="text-xs text-blue-400 font-semibold">지출 최적화</span>
            </div>
            <h4 className="font-bold text-white text-sm mt-2">{scenarioB.title}</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {scenarioB.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>월 가용 저축액:</span>
                <span className="text-emerald-400 font-bold">
                  {formatKRW(scenarioB.monthlyAvailableCashflow)} (+{formatKRW(scenarioB.monthlyExpenseReduction)})
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>목표 달성 가능률:</span>
                <span className="text-emerald-400 font-semibold">{scenarioB.goalsAchievableCount} / {scenarioB.totalGoalsCount}개</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>은퇴자산 소진 시점:</span>
                <span className="text-slate-200 font-medium">
                  {scenarioB.retirementDepletionAge ? `${scenarioB.retirementDepletionAge}세 (+개선)` : '평생 안전'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block">10년 후 예상 순자산</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-black text-blue-300">{formatKRW(scenarioB.projectedNetWorth10Yr)}</span>
              {netWorthDiffB > 0 && (
                <span className="text-xs text-emerald-400 font-bold">+{formatKRW(netWorthDiffB)}</span>
              )}
            </div>
          </div>
        </div>

        {/* 시나리오 C */}
        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 shadow-md space-y-3 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                시나리오 C (추천)
              </span>
              <span className="text-xs text-indigo-400 font-semibold">종합 최적화</span>
            </div>
            <h4 className="font-bold text-white text-sm mt-2">{scenarioC.title}</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {scenarioC.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>적용 기대수익률:</span>
                <span className="text-indigo-300 font-bold">{scenarioC.adjustedReturnRate}% (+1.5%p 분산)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>목표 달성 가능률:</span>
                <span className="text-emerald-400 font-bold">{scenarioC.goalsAchievableCount} / {scenarioC.totalGoalsCount}개 달성</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>은퇴자산 소진 시점:</span>
                <span className="text-emerald-400 font-bold">
                  {scenarioC.retirementDepletionAge ? `${scenarioC.retirementDepletionAge}세까지 연장` : '평생 지속 가능'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block">10년 후 예상 순자산</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-black text-emerald-400">{formatKRW(scenarioC.projectedNetWorth10Yr)}</span>
              {netWorthDiffC > 0 && (
                <span className="text-xs text-emerald-400 font-bold">+{formatKRW(netWorthDiffC)}</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 정량 비교 요약문 */}
      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
        <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>CFP 시나리오 제언:</strong> 불필요한 소비를 월 {formatKRW(scenarioB.monthlyExpenseReduction)} 절감하고, 중요도가 보통·낮음인 목표의 달성 시점을 1~2년 연장하면 10년 후 순자산이 약 <strong>{formatKRW(netWorthDiffC)}</strong> 추가 증식되며 목표 충돌을 원활하게 해소할 수 있습니다.
        </p>
      </div>

    </div>
  );
};
