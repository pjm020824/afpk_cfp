import React from 'react';
import { X, CheckCircle2, User, Users, Briefcase, ArrowRight } from 'lucide-react';
import { DEMO_PROFILES, DemoProfileItem } from '../data/demoProfiles';
import { UserFinancialProfile } from '../types/financial';
import { formatKRW } from '../utils/formatters';

interface DemoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: (demo: DemoProfileItem) => void;
  currentProfileAge: number;
}

export const DemoSelectorModal: React.FC<DemoSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectProfile,
  currentProfileAge
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* 모달 헤더 */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>가상 고객 시연 사례 선택 (공모전/체험)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              별도의 개인정보 입력 없이 즉시 실제 재무 시뮬레이션 결과를 체험할 수 있습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_PROFILES.map((item) => {
              const isSelected = item.profile.age === currentProfileAge;
              const totalIncome = item.profile.income.monthlySalary;
              const totalAssets = item.profile.assets.cashAndChecking + item.profile.assets.savingsDeposits + item.profile.assets.stocksFunds + item.profile.assets.pensionAssets + item.profile.assets.realEstate;
              const totalDebts = item.profile.debts.reduce((sum, d) => sum + d.balance, 0);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectProfile(item);
                    onClose();
                  }}
                  className={`group relative rounded-xl border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {item.badge}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      )}
                    </div>

                    <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>

                    {/* 핵심 지표 프리뷰 */}
                    <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>월 세후소득:</span>
                        <span className="font-medium text-slate-200">{formatKRW(totalIncome)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>총자산:</span>
                        <span className="font-medium text-slate-200">{formatKRW(totalAssets)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>총부채:</span>
                        <span className="font-medium text-rose-300">{formatKRW(totalDebts)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>목표 개수:</span>
                        <span className="font-medium text-slate-200">{item.profile.goals.length}개 설정</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 group-hover:bg-blue-600 text-slate-200 group-hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? '현재 적용 중' : '이 사례로 분석하기'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-blue-900/20 border border-blue-500/20 text-xs text-blue-300 flex items-center space-x-2">
            <span className="font-semibold px-1.5 py-0.5 rounded bg-blue-500/30">Tip</span>
            <span>사례를 선택한 후에도 상단의 '정보 수정하기' 버튼을 눌러 소득, 지출, 부채, 목표 금액을 자유롭게 변경할 수 있습니다.</span>
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
