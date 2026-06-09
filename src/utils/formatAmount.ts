export const formatAmount = (amount: number) => {
  return amount.toFixed(8).replace(/\.?0+$/, ""); 
};
