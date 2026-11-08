import React from 'react';
import { UserFinancialProfile } from '../../types/financial';
import { Sliders, AlertCircle, Info, Sparkles } from 'lucide-react';
import { formatKRW } from '../../utils/formatters';

interface Step5Props {
  data: UserFinancialProfile;
  onChange: (updates: Partial<UserFinancialProfile>) => void;
}

export const Step5Assumptions: React.FC<Step5Props> = ({ data, onChange }) => {
  const handleAssumptionChange = (field: keyof UserFinancialProfile['assumptions'], value: number) => {
    onChange({
      assumptions: {
        ...data.assumptions,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          <span>STEP 5. 계산 및 시뮬레이션 경제 가정</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          미래가치, 물가상승률, 은퇴 후 필요자금 산출에 적용할 경제적 가정을 점검하고 조정합니다.
        </p>
      </div>

      {/* 법적 기준값 아님 고지 배너 */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start space-x-2.5">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <p className="font-semibold">가정치 적용 안내 (Disclaimer)</p>
          <p className="text-[11px] text-amber-200/90">
            아래에 설정된 기본값은 한국은행 및 금융투자협회의 통계적 참고치에 기반한 시뮬레이션용 예시입니다.
            법정 기준값이나 미래의 보장 수익률이 아니므로, 본인의 투자 성향 및 리스크 허용 범위에 맞춰 자유롭게 조정하세요.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* 예상 연간 자산수익률 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <label className="text-slate-300 font-semibold block">예상 연간 자산수익률 (기대수익률)</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={data.assumptions.expectedReturnRate}
              onChange={(e) => handleAssumptionChange('expectedReturnRate', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400">%</span>
          </div>
          <span className="text-[10px] text-slate-500 block">예: 정기예금 3~3.5%, 글로벌 자산배분 5~7%</span>
        </div>

        {/* 연간 물가상승률 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <label className="text-slate-300 font-semibold block">예상 연간 물가상승률 (인플레이션)</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              max="15"
              value={data.assumptions.inflationRate}
              onChange={(e) => handleAssumptionChange('inflationRate', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400">%</span>
          </div>
          <span className="text-[10px] text-slate-500 block">한국은행 중기 물가안정 목표치: 약 2.0%~2.5%</span>
        </div>

        {/* 은퇴 후 예상 월 생활비 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <label className="text-slate-300 font-semibold block">은퇴 후 희망 월 생활비 (현재가치 기준)</label>
          <input
            type="number"
            step="100000"
            value={data.assumptions.retirementMonthlyExpenses || ''}
            onChange={(e) => handleAssumptionChange('retirementMonthlyExpenses', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            placeholder="예: 2500000"
          />
          <span className="text-[10px] text-slate-400 block">{formatKRW(data.assumptions.retirementMonthlyExpenses)}</span>
        </div>

        {/* 기대수명 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <label className="text-slate-300 font-semibold block">시뮬레이션 분석 수명 (기대수명)</label>
          <div className="relative">
            <input
              type="number"
              min="70"
              max="110"
              value={data.assumptions.lifeExpectancy}
              onChange={(e) => handleAssumptionChange('lifeExpectancy', parseInt(e.target.value) || 90)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400">세까지 분석</span>
          </div>
          <span className="text-[10px] text-slate-500 block">장수 리스크(자산 고갈)를 대비해 90~95세 권장</span>
        </div>

        {/* 소득 증가율 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <label className="text-slate-300 font-semibold block">연간 소득 증가율</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={data.assumptions.incomeGrowthRate}
              onChange={(e) => handleAssumptionChange('incomeGrowthRate', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400">%</span>
          </div>
        </div>

        {/* 저축 증가율 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <label className="text-slate-300 font-semibold block">연간 저축액 증가율</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={data.assumptions.savingsGrowthRate}
              onChange={(e) => handleAssumptionChange('savingsGrowthRate', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400">%</span>
          </div>
        </div>

      </div>

      <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-300 flex items-center space-x-2">
        <Sparkles className="w-4 h-4 shrink-0 text-blue-400" />
        <span>모든 입력이 완료되었습니다. 하단의 '분석 결과 확인하기'를 누르면 즉시 재무상태 대시보드와 AI 종합 분석을 열람할 수 있습니다.</span>
      </div>

    </div>
  );
};
