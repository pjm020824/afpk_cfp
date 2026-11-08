import React from 'react';
import { UserFinancialProfile, FinancialGoal, GoalCategory, GoalPriority } from '../../types/financial';
import { Target, Plus, Trash2, Shield, Home, Heart, GraduationCap, Clock, Award } from 'lucide-react';
import { formatKRW } from '../../utils/formatters';

interface Step4Props {
  data: UserFinancialProfile;
  onChange: (updates: Partial<UserFinancialProfile>) => void;
}

const PRESET_TEMPLATES: Array<{ category: GoalCategory; name: string; defaultAmount: number; defaultYears: number; defaultPriority: GoalPriority }> = [
  { category: 'emergency_fund', name: '3~6개월 필수 비상예비자금', defaultAmount: 10000000, defaultYears: 1, defaultPriority: 'high' },
  { category: 'housing', name: '내 집 마련 주택자금', defaultAmount: 150000000, defaultYears: 5, defaultPriority: 'high' },
  { category: 'wedding', name: '결혼 준비 자금', defaultAmount: 40000000, defaultYears: 3, defaultPriority: 'medium' },
  { category: 'debt_repayment', name: '학자금/신용대출 조기상환', defaultAmount: 15000000, defaultYears: 3, defaultPriority: 'high' },
  { category: 'seed_money', name: '첫 1억 종잣돈 만들기', defaultAmount: 100000000, defaultYears: 5, defaultPriority: 'medium' },
  { category: 'education', name: '자녀 대학 등록금 마련', defaultAmount: 50000000, defaultYears: 10, defaultPriority: 'medium' },
  { category: 'retirement', name: '노후 은퇴자산 캐시카우', defaultAmount: 500000000, defaultYears: 25, defaultPriority: 'high' }
];

export const Step4Goals: React.FC<Step4Props> = ({ data, onChange }) => {
  const addGoal = (template?: typeof PRESET_TEMPLATES[0]) => {
    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      category: template ? template.category : 'custom',
      name: template ? template.name : '신규 재무목표',
      targetAmount: template ? template.defaultAmount : 30000000,
      targetYears: template ? template.defaultYears : 3,
      currentAmount: 0,
      priority: template ? template.defaultPriority : 'medium',
      isFlexible: true
    };
    onChange({ goals: [...data.goals, newGoal] });
  };

  const updateGoal = (id: string, updates: Partial<FinancialGoal>) => {
    const updated = data.goals.map(g => g.id === id ? { ...g, ...updates } : g);
    onChange({ goals: updated });
  };

  const removeGoal = (id: string) => {
    onChange({ goals: data.goals.filter(g => g.id !== id) });
  };

  const totalTargetAmount = data.goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-400" />
          <span>STEP 4. 생애 재무목표(Goals) 설정</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          달성하고자 하는 주요 재무목표를 등록합니다. 복수의 목표가 동시에 추진될 때 발생하는 <strong>목표 충돌(Conflict)</strong>을 분석합니다.
        </p>
      </div>

      {/* 템플릿 빠른 추가 바 */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 block">원클릭 추천 목표 템플릿 추가:</span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TEMPLATES.map((tpl) => (
            <button
              key={tpl.name}
              type="button"
              onClick={() => addGoal(tpl)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center space-x-1 transition"
            >
              <Plus className="w-3 h-3 text-blue-400" />
              <span>{tpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 목표 리스트 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">
            등록된 재무목표 ({data.goals.length}개)
          </span>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-blue-300 font-semibold">
              목표 총합: {formatKRW(totalTargetAmount)}
            </span>
            <button
              type="button"
              onClick={() => addGoal()}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center space-x-1 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>직접 추가</span>
            </button>
          </div>
        </div>

        {data.goals.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl space-y-2">
            <Target className="w-8 h-8 text-slate-600 mx-auto" />
            <p>아직 등록된 재무목표가 없습니다.</p>
            <p className="text-[11px]">위 템플릿 버튼을 누르거나 '직접 추가'를 눌러 최소 1개 이상의 목표를 설정하세요.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.goals.map((goal, index) => (
              <div key={goal.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs shadow-sm">
                
                {/* 상단 라인: 목표명 및 삭제 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 mr-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={goal.name}
                      onChange={(e) => updateGoal(goal.id, { name: e.target.value })}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-semibold text-xs focus:border-blue-500 flex-1 max-w-xs"
                      placeholder="목표명"
                    />
                    <select
                      value={goal.category}
                      onChange={(e) => updateGoal(goal.id, { category: e.target.value as GoalCategory })}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-300 text-xs"
                    >
                      <option value="emergency_fund">비상자금</option>
                      <option value="debt_repayment">부채상환</option>
                      <option value="wedding">결혼자금</option>
                      <option value="housing">주택자금</option>
                      <option value="education">자녀교육</option>
                      <option value="retirement">은퇴자금</option>
                      <option value="seed_money">종잣돈</option>
                      <option value="custom">기타</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeGoal(goal.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="목표 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 입력 필드 그리드 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">목표 금액 (원)</label>
                    <input
                      type="number"
                      step="1000000"
                      value={goal.targetAmount || ''}
                      onChange={(e) => updateGoal(goal.id, { targetAmount: parseInt(e.target.value) || 0 })}
                      className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(goal.targetAmount)}</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">목표 달성 기간 (년)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={goal.targetYears || ''}
                      onChange={(e) => updateGoal(goal.id, { targetYears: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">약 {Math.round(goal.targetYears * 12)}개월 후</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">현재 기확보 자금 (원)</label>
                    <input
                      type="number"
                      step="500000"
                      value={goal.currentAmount || ''}
                      onChange={(e) => updateGoal(goal.id, { currentAmount: parseInt(e.target.value) || 0 })}
                      className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(goal.currentAmount)}</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">중요도 및 우선순위</label>
                    <select
                      value={goal.priority}
                      onChange={(e) => updateGoal(goal.id, { priority: e.target.value as GoalPriority })}
                      className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:border-blue-500"
                    >
                      <option value="high">🔴 높음 (필수 목표)</option>
                      <option value="medium">🟡 보통 (중요 목표)</option>
                      <option value="low">🟢 낮음 (선택적 목표)</option>
                    </select>
                  </div>
                </div>

                {/* 유연성 토글 및 메모 */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={goal.isFlexible}
                      onChange={(e) => updateGoal(goal.id, { isFlexible: e.target.checked })}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-950"
                    />
                    <span>현금흐름 부족 시 시점·금액 조정 가능 (유연 목표)</span>
                  </label>

                  <input
                    type="text"
                    value={goal.notes || ''}
                    onChange={(e) => updateGoal(goal.id, { notes: e.target.value })}
                    placeholder="목표 비고/전략 메모 (선택)"
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-slate-400 text-[11px] w-full sm:w-60 focus:border-slate-700"
                  />
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
