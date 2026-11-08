/**
 * LifePlan AI - Express Full-Stack Server
 * - Gemini API Server-Side Integration (@google/genai with gemini-3.8-flash)
 * - Vite Middleware integration for dev server on port 3000
 * - Deterministic fallback CFP analysis engine when offline or no API key
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Gemini SDK 초기화 (서버 사이드 전용)
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. 헬스체크 및 AI 연결 상태 확인 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'LifePlan AI',
    hasApiKey: Boolean(aiClient),
    serverTime: new Date().toISOString(),
  });
});

// 2. CFP 규칙 기반 결정론적 분석 보고서 생성기 (Fallback 및 신속 응답용)
function generateDeterministicCFPReport(data: any) {
  const { health, goalsResult, scenarios, profile } = data;
  const netWorthManwon = Math.round((health?.netWorth || 0) / 10000);
  const incomeManwon = Math.round((health?.totalMonthlyIncome || 0) / 10000);
  const cashflowManwon = Math.round((health?.monthlyAvailableCashflow || 0) / 10000);
  const emergencyMonths = health?.emergencyFundMonths || 0;
  const dsr = health?.debtServiceRatio || 0;
  const savingsRate = health?.actualSavingsRate || 0;

  const diagnoses = [];

  // 문제 1: 비상예비자금 유동성
  if (emergencyMonths < 3) {
    diagnoses.push({
      title: '유동성 비상예비자금 부족',
      severity: emergencyMonths < 1 ? ('critical' as const) : ('warning' as const),
      cause: `현재 보유 현금성 자산 기준 비상자금 확보 기간이 ${emergencyMonths}개월에 불과합니다.`,
      metrics: `보유 유동성: ${Math.round((health?.liquidAssets || 0) / 10000).toLocaleString()}만 원 (권장 기준: 월 필수지출 3~6개월분)`,
      recommendation: '급여통장과 분리된 수시입출금 CMA 또는 파킹통장에 최소 3개월분 필수생활비를 최우선 적립하세요.'
    });
  }

  // 문제 2: 부채 상환 부담
  if (dsr > 25) {
    diagnoses.push({
      title: '월 소득 대비 과도한 부채 원리금 상환 부담',
      severity: dsr > 40 ? ('critical' as const) : ('warning' as const),
      cause: `월 세후소득의 ${dsr}%가 부채 원리금 상환에 고정 지출되어 가용 현금흐름을 압박하고 있습니다.`,
      metrics: `월 부채상환액: ${Math.round((health?.totalMonthlyDebtPayment || 0) / 10000).toLocaleString()}만 원 (권장 상한선: 25% 이하)`,
      recommendation: '고금리 신용대출 우선 상환 또는 정책 서민금융/대환대출을 통해 월 상환액과 이자비용을 절감하세요.'
    });
  }

  // 문제 3: 목표 충돌 및 저축 부족
  if (goalsResult?.conflictAnalysis?.hasConflict) {
    const deficitManwon = Math.round(Math.abs(goalsResult.conflictAnalysis.surplusOrDeficit) / 10000);
    diagnoses.push({
      title: '동시 다발적 재무목표 설정으로 인한 현금흐름 충돌',
      severity: ('warning' as const),
      cause: `설정된 모든 목표를 현재 시점에 동시 달성하기 위한 필요 저축액이 월 가용현금을 매월 ${deficitManwon.toLocaleString()}만 원 초과합니다.`,
      metrics: `필요 저축 합계: ${Math.round(goalsResult.conflictAnalysis.totalRequiredMonthlySavings / 10000).toLocaleString()}만 원 vs 가용현금: ${cashflowManwon.toLocaleString()}만 원`,
      recommendation: '목표 중요도에 따라 우선순위를 재설정하고, 조정 가능한 목표의 달성 시점을 1~2년 연기하세요.'
    });
  } else if (savingsRate < 20) {
    diagnoses.push({
      title: '소득 대비 정기 저축·투자율 저조',
      severity: ('info' as const),
      cause: `월 소득 대비 실제 저축·투자 비율이 ${savingsRate}% 수준으로 장기 자산증식 속도가 지연될 수 있습니다.`,
      metrics: `현재 저축률: ${savingsRate}% (권장 목표: 25% 이상)`,
      recommendation: '선저축-후지출 원칙을 적용하여 급여일에 자동이체로 최소 10% 추가 저축을 집행하세요.'
    });
  }

  // 기본 진단 항목이 적을 때 보완
  if (diagnoses.length < 3) {
    diagnoses.push({
      title: '세제 혜택 계좌(ISA/IRP/연금저축) 활용 점검',
      severity: ('info' as const),
      cause: '절세 계좌를 활용하지 않을 경우 금융소득 과세 및 세액공제 기회손실이 발생합니다.',
      metrics: '연금저축 및 IRP 연간 최대 900만 원 세액공제(13.2%~16.5%) 한도 점검 필요',
      recommendation: '일반 과세 계좌 투자분을 ISA 및 연금저축/IRP 계좌로 점진적 이전하여 복리 절세 효과를 누리세요.'
    });
  }

  return {
    summary: {
      headline: `${profile?.age || 30}세 고객님의 순자산은 ${netWorthManwon.toLocaleString()}만 원이며, 월 가용현금흐름은 ${cashflowManwon.toLocaleString()}만 원입니다.`,
      netWorthText: `총자산 ${Math.round((health?.totalAssets || 0) / 10000).toLocaleString()}만 원 중 부채는 ${Math.round((health?.totalDebts || 0) / 10000).toLocaleString()}만 원으로 순자산 비율은 ${health?.totalAssets > 0 ? Math.round((health.netWorth / health.totalAssets) * 100) : 0}%입니다.`,
      cashflowEvaluation: `월 세후수입(${incomeManwon.toLocaleString()}만 원) 대비 소비지출은 ${Math.round((health?.totalMonthlyConsumption || 0) / 10000).toLocaleString()}만 원, 실제 저축률은 ${savingsRate}%입니다.`,
      keyStrengths: [
        health?.monthlyAvailableCashflow > 0 ? '월간 현금흐름 흑자 구조 유지' : '자산 구조 다변화 시도',
        health?.debtServiceRatio < 30 ? '건전한 수준의 부채 관리' : '명확한 생애주기 목표 수립'
      ],
      keyConcerns: [
        emergencyMonths < 3 ? '비상예비자금 부족에 따른 긴급상황 취약성' : '고물가에 따른 실질 구매력 보전 필요',
        goalsResult?.conflictAnalysis?.hasConflict ? '다중 목표 동시 추진에 따른 현금흐름 결손' : '장기 은퇴자산 적립의 지속성 확보'
      ]
    },
    diagnoses: diagnoses.slice(0, 3),
    goalsEvaluationText: {
      conflictAnalysis: goalsResult?.conflictAnalysis?.hasConflict
        ? `현재 등록된 ${goalsResult.goals.length}개 목표를 동시 달성하려면 월 ${Math.round(goalsResult.conflictAnalysis.totalRequiredMonthlySavings / 10000).toLocaleString()}만 원이 소요되어 ${Math.round(Math.abs(goalsResult.conflictAnalysis.surplusOrDeficit) / 10000).toLocaleString()}만 원의 충돌 결손이 발생합니다.`
        : `현재 가용현금(${cashflowManwon.toLocaleString()}만 원)으로 등록된 모든 재무목표의 필요 월 저축액(${Math.round((goalsResult?.conflictAnalysis?.totalRequiredMonthlySavings || 0) / 10000).toLocaleString()}만 원)을 안정적으로 달성할 수 있습니다.`,
      priorityStrategy: '핵심 필수 목표(비상자금/주거)를 선순위로 배정하고, 상대적으로 유연한 목표는 달성 시점을 탄력적으로 조정하는 자금 배분 전략이 효과적입니다.'
    },
    scenarioComparisonText: {
      verdict: '시나리오 B(지출 개선) 및 C(목표 최적화)를 병행할 때 10년 후 예상 순자산과 은퇴 안정성이 현저히 향상됩니다.',
      tradeoffs: `소비지출을 월 ${Math.round((scenarios?.scenarioB?.monthlyExpenseReduction || 300000) / 10000).toLocaleString()}만 원 절감하여 투자로 전환할 경우 10년 후 순자산이 약 ${Math.round(((scenarios?.scenarioB?.projectedNetWorth10Yr || 0) - (scenarios?.scenarioA?.projectedNetWorth10Yr || 0)) / 10000).toLocaleString()}만 원 증가합니다.`
    },
    actionPlan: {
      immediate: [
        '급여 이체일 다음 날 비상자금 자동이체 계좌 개설 및 월 정액 이체 설정',
        '통장 쪼개기(급여/소비/비상금/투자)를 통해 지출 통제선 확립'
      ],
      midTerm: [
        '소비지출 내역 3개월간 모니터링하여 변동 지출 15% 감축 실행',
        '보유 대출의 중도상환 수수료 및 금리 인하 요구권 행사 가능 여부 조회'
      ],
      longTerm: [
        '연금저축 및 IRP 세액공제 한도(연 900만 원) 납입액 최종 점검',
        '재무목표 달성률 반기별 1회 점검 및 포트폴리오 리밸런싱'
      ]
    },
    assumptionsAndLimits: {
      formulasUsed: [
        '월복리 미래가치 산출: FV = PMT * ((1 + r_m)^n - 1) / r_m',
        '연 유효수익률(EAR) 기반 월복리 전환: r_m = (1 + r)^(1/12) - 1',
        '물가반영 미래 목표액: Target * (1 + inflation)^years'
      ],
      caveats: [
        '본 분석은 입력된 수치와 통계적 가정을 기반으로 한 시뮬레이션이며 미래 금융시장 수익률을 보장하지 않습니다.',
        '세법 및 금융규제(DSR 등)는 정부 정책 및 세법 개정에 따라 변동될 수 있습니다.'
      ],
      furtherVerificationNeeded: [
        '국민연금 예상 수령액 공단 공식 조회 내역 확인',
        '보유 대출 상품의 변동금리 주기 및 우대금리 충족 조건 확인'
      ]
    },
    isAIGenerated: false,
    generatedAt: new Date().toISOString()
  };
}

// 3. Gemini AI 기반 종합 재무설계 보고서 생성 엔드포인트
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { health, goalsResult, scenarios, profile } = req.body;

    if (!health || !profile) {
      return res.status(400).json({ error: '필수 재무 데이터가 누락되었습니다.' });
    }

    // AI 클라이언트가 준비되지 않았을 경우 고품질 CFP 결정론적 엔진 보고서 반환
    if (!aiClient) {
      console.log('Gemini API 키 미설정 또는 미초기화: CFP 규칙 기반 분석 보고서 생성');
      const fallbackReport = generateDeterministicCFPReport(req.body);
      return res.json({
        report: fallbackReport,
        source: 'rule_based_cfp_engine',
        message: 'CFP 표준 가이드라인에 따른 규칙 기반 재무진단 보고서가 생성되었습니다.'
      });
    }

    // Gemini API 호출 프롬프트 구성
    const systemInstruction = `당신은 대한민국 최고 수준의 CFP(국제공인재무설계사) 수석 컨설턴트입니다.
제공된 JSON 데이터는 금융공학 엔진으로 사전 계산된 검증된 수치입니다.
절대로 입력된 계산 수치(순자산, 가용현금, 부족액, 필요저축액 등)를 임의로 왜곡하거나 바꾸지 마십시오.
입력되지 않은 가족관계나 자산을 날조하지 마십시오.
특정 주식 종목이나 특정 보험상품의 일방적 매수/매도를 추천하지 마십시오.
한국 금융제도(ISA, 연금저축, IRP, 비상금 3~6개월 등)와 CFP 7단계 원칙에 기반하여 논리적이고 신뢰도 높은 한국어 분석 보고서를 작성하세요.`;

    const userPrompt = `다음 정량 계산 데이터를 바탕으로 심층 재무진단 보고서를 생성해 주세요.

[고객 기본 정보]
- 나이: ${profile.age}세, 가구형태: ${profile.householdType}, 은퇴예정: ${profile.expectedRetirementAge}세
- 세후 월소득: ${Math.round(health.totalMonthlyIncome / 10000)}만 원
- 월 소비지출: ${Math.round(health.totalMonthlyConsumption / 10000)}만 원
- 월 부채상환: ${Math.round(health.totalMonthlyDebtPayment / 10000)}만 원
- 월 정기저축투자: ${Math.round(health.totalMonthlySavingsAndInvestment / 10000)}만 원
- 월 가용현금흐름: ${Math.round(health.monthlyAvailableCashflow / 10000)}만 원
- 총자산: ${Math.round(health.totalAssets / 10000)}만 원, 총부채: ${Math.round(health.totalDebts / 10000)}만 원, 순자산: ${Math.round(health.netWorth / 10000)}만 원
- 비상자금 확보: ${health.emergencyFundMonths}개월, 부채상환부담률: ${health.debtServiceRatio}%

[재무목표 평가]
- 목표 개수: ${goalsResult?.goals?.length || 0}개
- 전체 필요 월저축 합계: ${Math.round((goalsResult?.conflictAnalysis?.totalRequiredMonthlySavings || 0) / 10000)}만 원
- 목표 충돌 여부: ${goalsResult?.conflictAnalysis?.hasConflict ? '충돌 발생 (결손액: ' + Math.round(Math.abs(goalsResult.conflictAnalysis.surplusOrDeficit) / 10000) + '만 원)' : '충돌 없음(여유)'}

[시나리오 비교]
- 현상 유지 10년 후 순자산: ${Math.round((scenarios?.scenarioA?.projectedNetWorth10Yr || 0) / 10000)}만 원
- 지출 개선 10년 후 순자산: ${Math.round((scenarios?.scenarioB?.projectedNetWorth10Yr || 0) / 10000)}만 원
- 목표 최적화 10년 후 순자산: ${Math.round((scenarios?.scenarioC?.projectedNetWorth10Yr || 0) / 10000)}만 원

반드시 지정된 JSON 스키마 규격으로만 응답하세요.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                netWorthText: { type: Type.STRING },
                cashflowEvaluation: { type: Type.STRING },
                keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyConcerns: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['headline', 'netWorthText', 'cashflowEvaluation', 'keyStrengths', 'keyConcerns'],
            },
            diagnoses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  cause: { type: Type.STRING },
                  metrics: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                },
                required: ['title', 'severity', 'cause', 'metrics', 'recommendation'],
              },
            },
            goalsEvaluationText: {
              type: Type.OBJECT,
              properties: {
                conflictAnalysis: { type: Type.STRING },
                priorityStrategy: { type: Type.STRING },
              },
              required: ['conflictAnalysis', 'priorityStrategy'],
            },
            scenarioComparisonText: {
              type: Type.OBJECT,
              properties: {
                verdict: { type: Type.STRING },
                tradeoffs: { type: Type.STRING },
              },
              required: ['verdict', 'tradeoffs'],
            },
            actionPlan: {
              type: Type.OBJECT,
              properties: {
                immediate: { type: Type.ARRAY, items: { type: Type.STRING } },
                midTerm: { type: Type.ARRAY, items: { type: Type.STRING } },
                longTerm: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['immediate', 'midTerm', 'longTerm'],
            },
            assumptionsAndLimits: {
              type: Type.OBJECT,
              properties: {
                formulasUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                caveats: { type: Type.ARRAY, items: { type: Type.STRING } },
                furtherVerificationNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['formulasUsed', 'caveats', 'furtherVerificationNeeded'],
            },
          },
          required: ['summary', 'diagnoses', 'goalsEvaluationText', 'scenarioComparisonText', 'actionPlan', 'assumptionsAndLimits'],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Gemini 응답 텍스트가 비어있습니다.');
    }

    const parsedJson = JSON.parse(textOutput);
    parsedJson.isAIGenerated = true;
    parsedJson.generatedAt = new Date().toISOString();

    return res.json({
      report: parsedJson,
      source: 'gemini-3.8-flash',
      message: 'Gemini 3.8 Flash AI 모델을 통해 종합 재무분석 보고서가 성공적으로 생성되었습니다.'
    });

  } catch (error: any) {
    console.error('Gemini API 처리 중 오류 발생, 결정론적 엔진으로 폴백합니다:', error);
    const fallbackReport = generateDeterministicCFPReport(req.body);
    return res.json({
      report: fallbackReport,
      source: 'rule_based_fallback',
      warning: error?.message || 'AI 서비스 연결 실패로 표준 재무 규칙 보고서로 자동 전환되었습니다.'
    });
  }
});

// Vite Dev Server 또는 프로덕션 정적 서빙
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LifePlan AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('서버 시작 실패:', err);
  process.exit(1);
});
