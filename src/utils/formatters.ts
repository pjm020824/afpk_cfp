/**
 * 한국 원화(KRW) 및 금융 수치 포맷팅 유틸리티
 */

export function formatKRW(amount: number): string {
  const safe = Math.round(amount);
  const isNegative = safe < 0;
  const abs = Math.abs(safe);

  if (abs === 0) return '0원';

  const eok = Math.floor(abs / 100000000);
  const man = Math.floor((abs % 100000000) / 10000);
  const won = abs % 10000;

  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString()}억`);
  if (man > 0) parts.push(`${man.toLocaleString()}만`);
  if (won > 0 && eok === 0 && man === 0) parts.push(`${won.toLocaleString()}`);

  const result = parts.join(' ') + ' 원';
  return isNegative ? `-${result}` : result;
}

export function formatManwon(amount: number): string {
  const man = Math.round(amount / 10000);
  return `${man.toLocaleString()}만 원`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
