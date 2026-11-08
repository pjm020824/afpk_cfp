import React from 'react';
import { EvaluatedGoalsResult } from '../../calculations/goalConflict';
import { formatKRW } from '../../utils/formatters';
import { Target, AlertTriangle, CheckCircle2, AlertCircle, ArrowUpRight, Clock, ShieldCheck } from 'lucide-react';

interface GoalConflictProps {
  goalsResult: EvaluatedGoalsResult;
  onNavigateToWizard?: () => void;
}

export const GoalConflictCard: React.FC<GoalConflictProps> = ({ goalsResult, onNavigateToWizard }) => {
  const { goals, conflictAnalysis } = goalsResult;
  const { hasConflict, surplusOrDeficit, totalRequiredMonthlySavings, availableMonthlyCashflow, recommendations } = conflictAnalysis;

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'high':
        return <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">🔴 높음</span>;
      case 'medium':
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">🟡 보통</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-medium text-[10px]">🟢 낮음</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md space-y-5">
      
      {/* 헤더 & 충돌 여부 상태 배너 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">재무목표 충돌(Goal Conflict) 정밀 분석</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            등록된 {goals.length}개 목표의 필요 저축액과 실제 가용현금흐름 간의 동시 달성 가능성을 검증합니다.
          </p>
        </div>

        {/* 상태 배지 */}
        <div className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 text-xs font-semibold ${
          hasConflict
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
          {hasConflict ? (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>목표 충돌 발생 (월 결손 {formatKRW(Math.abs(surplusOrDeficit))})</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>동시 달성 가능 (월 여유 {formatKRW(surplusOrDeficit)})</span>
            </>
          )}
        </div>
      </div>

      {/* 수치 비교 막대 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">월 전체 목표 필요 저축액</span>
          <span className="text-base font-bold text-white mt-0.5 block">{formatKRW(totalRequiredMonthlySavings)}</span>
          <span className="text-[10px] text-slate-500">{goals.length}개 목표 합산</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">현재 월 가용현금흐름</span>
          <span className="text-base font-bold text-blue-400 mt-0.5 block">{formatKRW(availableMonthlyCashflow)}</span>
          <span className="text-[10px] text-slate-500">수입 - 소비 - 부채상환</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">월 현금흐름 밸런스</span>
          <span className={`text-base font-bold mt-0.5 block ${surplusOrDeficit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {surplusOrDeficit >= 0 ? `+${formatKRW(surplusOrDeficit)} 여유` : `-${formatKRW(Math.abs(surplusOrDeficit))} 부족`}
          </span>
          <span className="text-[10px] text-slate-500">{hasConflict ? '대안 시나리오 조정 필요' : '안정적 저축 진행 가능'}</span>
        </div>
      </div>

      {/* 목표별 상세 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
              <th className="py-2.5 px-3">목표명</th>
              <th className="py-2.5 px-3">우선순위</th>
              <th className="py-2.5 px-3">목표 기간</th>
              <th className="py-2.5 px-3 text-right">목표 금액</th>
              <th className="py-2.5 px-3 text-right">물가반영 미래가치</th>
              <th className="py-2.5 px-3 text-right">월 필요 저축액</th>
              <th className="py-2.5 px-3 text-center">조정 가능성</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {goals.map((g) => (
              <tr key={g.goalId} className="hover:bg-slate-800/30 transition">
                <td className="py-3 px-3 font-medium text-white">
                  <div className="flex items-center space-x-1.5">
                    <span>{g.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3">{getPriorityBadge(g.priority)}</td>
                <td className="py-3 px-3 text-slate-300">{g.targetYears}년 ({g.targetYears * 12}개월)</td>
                <td className="py-3 px-3 text-right text-slate-300 font-medium">{formatKRW(g.targetAmount)}</td>
                <td className="py-3 px-3 text-right text-indigo-300 font-semibold">{formatKRW(g.futureTargetAmountInflationAdjusted)}</td>
                <td className="py-3 px-3 text-right text-emerald-400 font-bold">{formatKRW(g.requiredMonthlySavings)}/월</td>
                <td className="py-3 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    g.isFlexible
                      ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {g.isFlexible ? '기간조정 가능' : '고정 목표'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 정량적 CFP 권고안 박스 */}
      {recommendations.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center space-x-1.5 text-blue-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>CFP 목표 충돌 해소 권고사항</span>
          </div>
          <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed list-disc list-inside">
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
