export function estimateResaleValue(purchasePrice: number, purchaseDate: string, category: string = 'Electronics'): number {
  if (!purchasePrice || purchasePrice <= 0) return 0;
  
  const now = new Date();
  const purchase = new Date(purchaseDate);
  const ageInMonths = Math.max(0, (now.getFullYear() - purchase.getFullYear()) * 12 + now.getMonth() - purchase.getMonth());
  
  // Basic depreciation curve based on category
  let retainedPercentage = 100;

  if (category === 'Electronics' || category === 'Appliances') {
    // Electronics depreciate fast: 30% drop immediately, then ~1.5% per month
    retainedPercentage = 70 - (ageInMonths * 1.5);
  } else if (category === 'Vehicles') {
    // Vehicles: 20% first year, 1% per month after
    retainedPercentage = 80 - (Math.max(0, ageInMonths - 12) * 1);
  } else if (category === 'Furniture') {
    // Furniture: 20% drop immediately, then 0.5% per month
    retainedPercentage = 80 - (ageInMonths * 0.5);
  } else {
    // Other: Generic 2% per month
    retainedPercentage = 100 - (ageInMonths * 2);
  }

  // Value shouldn't drop below 5%
  retainedPercentage = Math.max(5, retainedPercentage);

  return Math.round(purchasePrice * (retainedPercentage / 100));
}
