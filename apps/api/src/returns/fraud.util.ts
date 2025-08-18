/**
 * Simple fraud scoring for returns.
 * - Rapid-fire: <10s since last return
 * - Duplicate deviceId or photoId (hash)
 * - Location: for MVP, not checked
 */
export function fraudScoreReturn(recentReturns: any[], data: { deviceId: string; photoId: string }) {
  let score = 0;
  let review = false;
  if (recentReturns.length > 0) {
    const last = recentReturns[0];
    if (last && new Date().getTime() - new Date(last.createdAt).getTime() < 10_000) score += 50;
    if (recentReturns.some(r => r.deviceId === data.deviceId)) score += 20;
    if (recentReturns.some(r => r.photoId === data.photoId)) score += 40;
  }
  if (score >= 50) review = true;
  return { score, review };
}