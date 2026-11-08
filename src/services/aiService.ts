/**
 * AI 및 서버 통신 클라이언트 서비스
 * 브라우저에서 직접 AI SDK를 호출하지 않고 자체 백엔드(/api/ai/analyze)를 통해 안전하게 통신합니다.
 */

import { AIAnalysisReport, CalculatedFinancialHealth, UserFinancialProfile } from '../types/financial';
import { EvaluatedGoalsResult } from '../calculations/goalConflict';
import { ScenarioComparisonResult } from '../calculations/scenarios';

export interface HealthCheckResponse {
  status: string;
  appName: string;
  hasApiKey: boolean;
  serverTime: string;
}

export interface AIAnalyzeResponse {
  report: AIAnalysisReport;
  source: string;
  message?: string;
  warning?: string;
}

export async function checkServerHealth(): Promise<HealthCheckResponse> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (error) {
    return {
      status: 'offline',
      appName: 'LifePlan AI',
      hasApiKey: false,
      serverTime: new Date().toISOString()
    };
  }
}

export async function requestAIReport(payload: {
  profile: UserFinancialProfile;
  health: CalculatedFinancialHealth;
  goalsResult: EvaluatedGoalsResult;
  scenarios: ScenarioComparisonResult;
}): Promise<AIAnalyzeResponse> {
  const response = await fetch('/api/ai/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'AI 분석 요청에 실패했습니다.');
  }

  return await response.json();
}
