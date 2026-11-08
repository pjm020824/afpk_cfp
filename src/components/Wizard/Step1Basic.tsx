import React from 'react';
import { UserFinancialProfile, HouseholdType, EmploymentStatus } from '../../types/financial';
import { User, Users, Briefcase, Calendar, CheckSquare } from 'lucide-react';

interface Step1Props {
  data: UserFinancialProfile;
  onChange: (updates: Partial<UserFinancialProfile>) => void;
}

const INTEREST_OPTIONS = [
  '비상자금 확보',
  '학자금/신용대출 상환',
  '종잣돈(1억) 만들기',
  '결혼자금 마련',
  '내 집 마련/청약',
  '출산 및 자녀양육',
  '연금저축/IRP 세제혜택',
  '은퇴 후 생활비 확보',
  '자산소진 방지 및 상속'
];

export const Step1Basic: React.FC<Step1Props> = ({ data, onChange }) => {
  const toggleInterest = (item: string) => {
    const current = data.interests || [];
    if (current.includes(item)) {
      onChange({ interests: current.filter(i => i !== item) });
    } else {
      onChange({ interests: [...current, item] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <User className="w-5 h-5 text-blue-400" />
          <span>STEP 1. 기본 개인 및 가구 상황</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          재무설계의 출발점으로 고객의 생애주기 단계와 기본 가구 현황을 파악합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* 나이 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">현재 나이 (만 나이)</label>
          <div className="relative">
            <input
              type="number"
              min="18"
              max="100"
              value={data.age || ''}
              onChange={(e) => onChange({ age: Math.max(18, Math.min(100, parseInt(e.target.value) || 0)) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="예: 28"
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">세</span>
          </div>
        </div>

        {/* 희망 은퇴 나이 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">예상 은퇴 나이</label>
          <div className="relative">
            <input
              type="number"
              min={data.age || 50}
              max="100"
              value={data.expectedRetirementAge || ''}
              onChange={(e) => onChange({ expectedRetirementAge: Math.max(data.age, parseInt(e.target.value) || 60) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="예: 60"
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">세</span>
          </div>
        </div>

        {/* 가구 형태 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">가구 형태</label>
          <select
            value={data.householdType}
            onChange={(e) => onChange({ householdType: e.target.value as HouseholdType })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="single">1인 가구 (단독가구)</option>
            <option value="couple_no_kids">부부 가구 (무자녀)</option>
            <option value="couple_with_kids">부부 + 자녀 가구</option>
            <option value="single_parent">한부모 가구</option>
            <option value="multi_generation">다세대 동거 가구</option>
          </select>
        </div>

        {/* 부양가족 수 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">부양가족 수 (본인 제외)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="10"
              value={data.dependentsCount}
              onChange={(e) => onChange({ dependentsCount: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">명</span>
          </div>
        </div>

        {/* 경제활동 상태 */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-300">경제활동 및 고용 형태</label>
          <select
            value={data.employmentStatus}
            onChange={(e) => onChange({ employmentStatus: e.target.value as EmploymentStatus })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="employed">직장인 (급여소득자)</option>
            <option value="self_employed">개인사업자 / 자영업</option>
            <option value="freelancer">프리랜서 / 특수고용</option>
            <option value="civil_servant">공무원 / 교직원</option>
            <option value="retired">은퇴 생활자</option>
            <option value="student_unemployed">취업준비생 / 학생</option>
          </select>
        </div>

      </div>

      {/* 주요 관심사 복수 선택 */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>주요 재무 관심사 (복수 선택)</span>
          <span className="text-[11px] text-blue-400 font-normal">선택된 항목: {data.interests?.length || 0}개</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INTEREST_OPTIONS.map((item) => {
            const isChecked = data.interests?.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggleInterest(item)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition flex items-center justify-between ${
                  isChecked
                    ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{item}</span>
                {isChecked && <CheckSquare className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
