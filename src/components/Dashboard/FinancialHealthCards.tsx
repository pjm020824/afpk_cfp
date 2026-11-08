import React from 'react';
import { CalculatedFinancialHealth } from '../../types/financial';
import { formatKRW, formatPercent } from '../../utils/formatters';
import { Landmark, TrendingUp, ShieldAlert, CheckCircle, PieChart, Wallet, CreditCard, Clock } from 'lucide-react';

interface HealthCardsProps {
  health: CalculatedFinancialHealth;
}

export const FinancialHealthCards: React.FC<HealthCardsProps> = ({ health }) => {
  // 비상자금 상태 배지
  const getLiquidityBadge = () => {
    switch (health.liquidityStatus) {
      case 'danger':
        return { text: '비상금 매우 부족 (위험)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'caution':
        return { text: '비상금 주의 (확충 권장)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'healthy':
        return { text: '비상금 적정 (3~6개월)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'optimal':
        return { text: '비상금 충분 (6개월 이상)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    }
  };

  // 부채상환부담 상태 배지
  const getDebtBadge = () => {
    switch (health.debtStatus) {
      case 'critical':
        return { text: '상환부담 심각 (>40%)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'high':
        return { text: '상환부담 주의 (25~40%)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'moderate':
        return { text: '적정 수준 (10~25%)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'low':
        return { text: '매우 양호 (0~10%)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    }
  };

  const liq = getLiquidityBadge();
  const debt = getDebtBadge();

  return (
    <div className="space-y-4">
      
      {/* 1. 상단 핵심 3대 재무상태표 지표 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* 총자산 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>보유 총자산 (Assets)</span>
            <Landmark className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {formatKRW(health.totalAssets)}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>유동성 자산</span>
            <span className="text-slate-200 font-medium">{formatKRW(health.liquidAssets)}</span>
          </div>
        </div>

        {/* 총부채 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>총부채 잔액 (Liabilities)</span>
            <CreditCard className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-rose-300 tracking-tight">
              {formatKRW(health.totalDebts)}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>월 원리금 상환</span>
            <span className="text-rose-300 font-medium">{formatKRW(health.totalMonthlyDebtPayment)}</span>
          </div>
        </div>

        {/* 순자산 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/30 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-blue-300">
            <span className="font-semibold">순자산 (Net Worth)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200 font-bold">
              자산의 {health.totalAssets > 0 ? Math.round((health.netWorth / health.totalAssets) * 100) : 0}%
            </span>
          </div>
          <div className="mt-2">
            <span className={`text-xl sm:text-2xl font-black tracking-tight ${health.netWorth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatKRW(health.netWorth)}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>투자·연금 자산</span>
            <span className="text-slate-200 font-medium">{formatKRW(health.investmentAssets + health.pensionAssets)}</span>
          </div>
        </div>

      </div>

      {/* 2. 월간 현금흐름 및 CFP 건전성 비율 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* 월 가용 현금흐름 */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>월 가용 현금흐름</span>
            <Wallet className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className={`text-base font-bold mt-1 ${health.monthlyAvailableCashflow >= 0 ? 'text-white' : 'text-rose-400'}`}>
            {formatKRW(health.monthlyAvailableCashflow)}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">소득 - 소비 - 부채상환</span>
        </div>

        {/* 실제 저축률 */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>실제 저축률</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-emerald-400 mt-1">
            {formatPercent(health.actualSavingsRate)}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">
            이론적 저축여력: {formatPercent(health.theoreticalSavingsCapacityRate)}
          </span>
        </div>

        {/* 비상자금 확보 개월 수 */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>비상자금 유동성</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-base font-bold text-white mt-1">
            {health.emergencyFundMonths}개월분
          </p>
          <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.2 rounded border ${liq.color}`}>
            {liq.text}
          </span>
        </div>

        {/* 관리용 부채상환부담비율 */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>부채상환부담 비율</span>
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-base font-bold text-white mt-1">
            {formatPercent(health.debtServiceRatio)}
          </p>
          <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.2 rounded border ${debt.color}`}>
            {debt.text}
          </span>
        </div>

      </div>

    </div>
  );
};
