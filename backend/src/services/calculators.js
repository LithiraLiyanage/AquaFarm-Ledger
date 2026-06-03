export const waterQualityScore = ({ ph, temperature, dissolvedOxygen, ammonia = 0 }) => {
  let score = 100;
  if (ph < 6.5 || ph > 8.5) score -= Math.min(35, Math.abs(ph - 7.5) * 12);
  if (temperature < 24 || temperature > 32) score -= Math.min(25, Math.abs(temperature - 28) * 3);
  if (dissolvedOxygen < 5) score -= Math.min(35, (5 - dissolvedOxygen) * 12);
  if (ammonia > 0.5) score -= Math.min(25, ammonia * 18);
  score = Math.max(0, Math.round(score));
  const status = score < 55 ? 'Critical' : score < 78 ? 'Warning' : 'Safe';
  return { score, status };
};
export const calcSurvivalRate = (current, initial) => initial ? Number(((current / initial) * 100).toFixed(1)) : 0;
export const calcBiomass = (stock, avgWeight) => Number((stock * avgWeight).toFixed(2));
export const calcHarvest = (stock, avgWeight, price, cost = 0) => {
  const biomass = calcBiomass(stock, avgWeight);
  const revenue = Number((biomass * price).toFixed(2));
  return { biomass, revenue, profit: Number((revenue - cost).toFixed(2)) };
};
