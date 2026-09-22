/** An explicitly illustrative model; no device readings or hardware changes. */
export const coolingProfiles = {
  quiet: { label: 'Quiet', watts: 35 },
  balanced: { label: 'Balanced', watts: 55 },
  max: { label: 'Full cooling', watts: 70 },
} as const;

export type CoolingProfile = keyof typeof coolingProfiles;

export function modelPower(requested: number, profile: CoolingProfile) {
  const power = Math.max(15, Math.min(80, Number.isFinite(requested) ? requested : 45));
  const cooling = coolingProfiles[profile].watts;
  const sustained = Math.min(power, cooling);
  const throughput = Math.round(100 * Math.cbrt(sustained / 45));
  return { power, cooling, sustained, throughput, limited: power > cooling };
}

export function chartPoint(power: number, throughput: number) {
  return { x: 45 + (power - 15) / 65 * 450, y: 218 - (throughput - 60) / 70 * 160 };
}

export function powerCurve(profile: CoolingProfile) {
  return Array.from({ length: 66 }, (_, i) => {
    const power = i + 15;
    const { throughput } = modelPower(power, profile);
    const point = chartPoint(power, throughput);
    return `${i === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`;
  }).join(' ');
}
