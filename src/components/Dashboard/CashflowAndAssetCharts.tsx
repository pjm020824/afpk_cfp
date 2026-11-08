import React from 'react';
import { CalculatedFinancialHealth, UserFinancialProfile } from '../../types/financial';
import { formatKRW } from '../../utils/formatters';
import { PieChart, BarChart2, TrendingUp, Layers } from 'lucide-react';

interface ChartsProps {
  health: CalculatedFinancialHealth;
  profile: UserFinancialProfile;
}

export const CashflowAndAssetCharts: React.FC<ChartsProps> = ({ health, profile }) => {
  // 1. 자산 구성 데이터
  const assetData = [
    { name: '현금/수시입출금', value: profile.assets.cashAndChecking, color: '#38bdf8' },
    { name: '정기예적금', value: profile.assets.savingsDeposits, color: '#60a5fa' },
    { name: '주식/ETF/펀드', value: profile.assets.stocksFunds, color: '#818cf8' },
    { name: '연금저축/IRP', value: profile.assets.pensionAssets, color: '#34d399' },
    { name: '부동산/기타', value: profile.assets.realEstate + profile.assets.otherAssets, color: '#fbbf24' },
  ].filter(item => item.value > 0);

  const totalAssets = Math.max(1, health.totalAssets);

  // 2. 월 현금 지출 배분 데이터
  const cashflowData = [
    { name: '순수 소비지출', value: health.totalMonthlyConsumption, color: '#f87171' },
    { name: '대출 원리금 상환', value: health.totalMonthlyDebtPayment, color: '#fb923c' },
    { name: '정기 저축·투자', value: health.totalMonthlySavingsAndInvestment, color: '#34d399' },
    { name: '미배분 잉여현금', value: Math.max(0, health.unallocatedCashflow), color: '#38bdf8' },
  ].filter(item => item.value > 0);

  const totalIncome = Math.max(1, health.totalMonthlyIncome);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* 1. 자산 포트폴리오 구성 비중 */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h4 className="font-bold text-white text-sm">자산군별 배분 비중</h4>
          </div>
          <span className="text-xs font-semibold text-slate-300">총 {formatKRW(health.totalAssets)}</span>
        </div>

        {/* 비례 바 차트 */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-800">
          {assetData.map((item, idx) => {
            const pct = (item.value / totalAssets) * 100;
            return (
              <div
                key={idx}
                style={{ width: `${pct}%`, backgroundColor: item.color }}
                className="h-full transition-all duration-300 hover:opacity-90"
                title={`${item.name}: ${formatKRW(item.value)} (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* 상세 범례 목록 */}
        <div className="space-y-2 pt-1 text-xs">
          {assetData.map((item, idx) => {
            const pct = (item.value / totalAssets) * 100;
            return (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2 font-medium">
                  <span>{formatKRW(item.value)}</span>
                  <span className="text-slate-500 text-[11px] w-12 text-right">({pct.toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. 월 소득 대비 현금흐름 배분 */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">월 세후수입 배분 현황</h4>
          </div>
          <span className="text-xs font-semibold text-slate-300">월 {formatKRW(health.totalMonthlyIncome)}</span>
        </div>

        {/* 비례 바 차트 */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-800">
          {cashflowData.map((item, idx) => {
            const pct = (item.value / totalIncome) * 100;
            return (
              <div
                key={idx}
                style={{ width: `${pct}%`, backgroundColor: item.color }}
                className="h-full transition-all duration-300 hover:opacity-90"
                title={`${item.name}: ${formatKRW(item.value)} (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* 상세 범례 목록 */}
        <div className="space-y-2 pt-1 text-xs">
          {cashflowData.map((item, idx) => {
            const pct = (item.value / totalIncome) * 100;
            return (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2 font-medium">
                  <span>{formatKRW(item.value)}</span>
                  <span className="text-slate-500 text-[11px] w-12 text-right">({pct.toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
