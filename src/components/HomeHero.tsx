import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Target, 
  Lock, 
  Zap,
  Users
} from 'lucide-react';
import { DEMO_PROFILES, DemoProfileItem } from '../data/demoProfiles';
import { formatKRW } from '../utils/formatters';

interface HomeHeroProps {
  onStartWizard: () => void;
  onSelectDemo: (demo: DemoProfileItem) => void;
  onOpenDemoModal: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onStartWizard,
  onSelectDemo,
  onOpenDemoModal
}) => {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      
      {/* 히어로 메인 섹션 */}
      <div className="relative text-center max-w-4xl mx-auto space-y-6">
        
        {/* 상단 뱃지 */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>CFP 7단계 절차 × 금융공학 엔진 × Gemini 3.8 Flash AI</span>
        </div>

        {/* 메인 헤드라인 */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          당신의 오늘을 분석하고,<br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
            내일의 재무계획을 설계하세요.
          </span>
        </h1>

        {/* 서브 카피 */}
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          연령이나 추측에 의존하지 않고, 실제 입력된 소득·지출·자산·부채 데이터를 바탕으로
          재무목표 충돌 분석과 3대 미래 시나리오를 정밀하게 시뮬레이션합니다.
        </p>

        {/* CTA 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartWizard}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition transform active:scale-95"
          >
            <span>내 재무상태 진단하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenDemoModal}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center justify-center space-x-2 transition"
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>가상 고객으로 체험하기 (3대 사례)</span>
          </button>
        </div>

        {/* 프라이버시 안심 안내 */}
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 pt-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>개인정보(이름·주민번호·계좌) 없이도 전체 시뮬레이션과 AI 보고서를 이용할 수 있습니다.</span>
        </div>
      </div>

      {/* 4대 핵심 서비스 기능 소개 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">1. 정밀 재무진단</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            월 가용현금흐름, 저축여력, DSR 관리지표, 비상자금 유동성 개월 수를 금융공학 순수 함수로 엄격히 계산합니다.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">2. 재무목표 충돌 분석</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            결혼·주택·은퇴 등 여러 목표의 필요 저축액 합계가 월 가용현금을 초과할 때 발생하는 결손을 정량 탐지합니다.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">3. 3대 대안 시나리오</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            '현상 유지', '지출 개선', '목표 최적화' 시나리오별 10년 후 순자산 및 은퇴자산 소진 시점을 한눈에 비교합니다.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">4. Gemini AI 심층 보고서</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            숫자 왜곡 없이 검증된 계산값을 근거로 주요 재무위험 TOP 3와 단계별 구체적 실행계획(즉시/3개월/1년)을 제시합니다.
          </p>
        </div>

      </div>

      {/* 가상 고객 시연 사례 바로가기 (Section 10 규격) */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">가상 고객 데이터로 즉시 체험하기</h2>
            <p className="text-xs text-slate-400 mt-1">2026 AFPK 영플래너 챌린지 및 포트폴리오 분석을 위한 대표 3대 생애주기 프로필</p>
          </div>
          <button
            onClick={onOpenDemoModal}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
          >
            <span>전체 사례 보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_PROFILES.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectDemo(item)}
              className="group p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all duration-200 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {item.badge}
                  </span>
                  <span className="text-xs text-slate-400">{item.profile.age}세</span>
                </div>

                <h3 className="font-bold text-white group-hover:text-blue-300 transition text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {item.subtitle}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">월 세후소득:</span>
                    <span className="font-semibold">{formatKRW(item.profile.income.monthlySalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">월 소비지출:</span>
                    <span className="font-semibold text-slate-300">
                      {formatKRW(
                        item.profile.expenses.housing +
                        item.profile.expenses.living +
                        item.profile.expenses.transportCommunication +
                        item.profile.expenses.education +
                        item.profile.expenses.insurance +
                        item.profile.expenses.otherConsumption
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">보유 자산:</span>
                    <span className="font-semibold text-emerald-400">
                      {formatKRW(
                        item.profile.assets.cashAndChecking +
                        item.profile.assets.savingsDeposits +
                        item.profile.assets.stocksFunds +
                        item.profile.assets.pensionAssets +
                        item.profile.assets.realEstate
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 group-hover:text-blue-300 font-semibold">
                <span>이 고객으로 시뮬레이션</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
