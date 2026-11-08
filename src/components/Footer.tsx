import React from 'react';
import { Shield, FileText, Award, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 상단 3대 배지 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">CFP 7단계 설계 절차 준용</p>
              <p className="text-slate-400 text-[11px] mt-0.5">상황이해, 목표설정, 재무상태진단, 시나리오대안, 권고안 개발 절차를 체계적으로 반영</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">데이터 프라이버시 보호</p>
              <p className="text-slate-400 text-[11px] mt-0.5">주민등록번호 및 금융계좌 미연결. 입력 데이터는 세션 내에서만 연산되며 영구 저장되지 않음</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Award className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">2026 AFPK 영플래너 챌린지</p>
              <p className="text-slate-400 text-[11px] mt-0.5">재무설계 공모전 및 상담 보고서 작성용 수치 검증과 분석 근거 데이터 원클릭 복사 지원</p>
            </div>
          </div>
        </div>

        {/* 법적 고지사항 및 면책조항 */}
        <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/60 space-y-2 text-[11px] leading-relaxed text-slate-400">
          <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>이용 안내 및 법적 면책 고지 (Disclaimer)</span>
          </div>
          <p>
            1. <strong>LifePlan AI</strong>는 재무설계 학문적 기준 및 한국 금융제도를 바탕으로 가계 재무상태를 분석하고 다양한 의사결정 시나리오를 시뮬레이션할 수 있도록 돕는 학습·분석 도구입니다.
          </p>
          <p>
            2. 본 플랫폼의 계산 결과 및 AI 해석 보고서는 공인된 금융기관이나 자격자의 확정적 투자 권유, 법률·세무 자문을 대체하지 않습니다. 실제 금융상품 가입 및 세무 신고 시에는 공인된 전문가(CFP, AFPK, 세무사 등)와 상담하시기 바랍니다.
          </p>
          <p>
            3. 미래 수익률 가정 및 물가상승률은 가상의 시뮬레이션 지표이며 장래 금융상품의 실현 수익을 보장하지 않습니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-slate-400 text-xs pt-2">
          <p>© 2026 LifePlan AI. All rights reserved. Built with Financial Engineering & Google Gemini.</p>
          <p className="mt-2 sm:mt-0 text-slate-400">CFP® & AFPK® are registered certification marks of FPSB.</p>
        </div>
      </div>
    </footer>
  );
};
