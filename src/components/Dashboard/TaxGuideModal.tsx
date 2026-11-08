import React from 'react';
import { X, BookOpen, CheckCircle, Percent, AlertCircle } from 'lucide-react';
import { KOREA_FINANCIAL_POLICIES } from '../../data/policies';
import { formatKRW } from '../../utils/formatters';

interface TaxGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaxGuideModal: React.FC<TaxGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white">대한민국 주요 세제혜택 및 절세 가이드</h3>
              <p className="text-[11px] text-slate-400">기준: {KOREA_FINANCIAL_POLICIES.version} (세법 정책 데이터)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          
          {/* 1. 연금저축 & IRP 세액공제 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-emerald-400 text-sm">1. 연금저축 및 IRP 세액공제</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">최대 900만 원 공제</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              근로소득자 및 사업자가 노후 자산을 형성할 때 연간 납입액에 대해 직접 세액공제를 제공하는 가장 강력한 세제 혜택 계좌입니다.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-medium">연금저축 단독 한도</span>
                <span className="font-bold text-white text-xs">{formatKRW(KOREA_FINANCIAL_POLICIES.pensionSavingsDeductionLimit)}/년</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-medium">IRP 포함 합산 한도</span>
                <span className="font-bold text-white text-xs">{formatKRW(KOREA_FINANCIAL_POLICIES.irpTotalDeductionLimit)}/년</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 space-y-0.5">
              <p>• 총급여 5,500만 원 이하: <strong>{KOREA_FINANCIAL_POLICIES.pensionTaxCreditRateLowIncome}%</strong> 공제 (최대 148만 5,000원 환급)</p>
              <p>• 총급여 5,500만 원 초과: <strong>{KOREA_FINANCIAL_POLICIES.pensionTaxCreditRateGeneral}%</strong> 공제 (최대 118만 8,000원 환급)</p>
            </div>
          </div>

          {/* 2. ISA (개인종합자산관리계좌) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-blue-400 text-sm">2. ISA (개인종합자산관리계좌)</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">비과세 + 분리과세</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              예적금, 국내 상장 ETF, 펀드, 채권을 하나의 계좌에서 운용하며 손익통산 후 비과세 혜택을 받는 중단기 만능 계좌입니다.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-medium">연간 납입한도</span>
                <span className="font-bold text-white text-xs">{formatKRW(KOREA_FINANCIAL_POLICIES.isaAnnualContributionLimit)} (총 1억)</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-medium">순이익 비과세 한도</span>
                <span className="font-bold text-white text-xs">일반 {formatKRW(KOREA_FINANCIAL_POLICIES.isaTaxFreeBenefitGeneral)} / 서민 {formatKRW(KOREA_FINANCIAL_POLICIES.isaTaxFreeBenefitFarmerLowIncome)}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              • 비과세 한도 초과 수익은 9.9% 저율 분리과세 적용(금융소득종합과세 미합산).<br />
              • 만기 시 연금저축/IRP로 이전 시 이전 금액의 10%(최대 300만 원) 추가 세액공제 혜택.
            </p>
          </div>

          {/* 3. DSR 관리 권고 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-purple-400 text-sm">3. 건전 부채 관리 지표 (DSR 기준)</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">권장 40% 이하</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              CFP 관리 기준 가계의 연간 세후소득 대비 부채 원리금 상환액 비율이 40%를 넘지 않아야 추가 긴급상황 발생 시 파산을 방지할 수 있습니다.
            </p>
          </div>

        </div>

        {/* 푸터 */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            확인 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
