// Currency conversion utility
export const convertUSDToPKR = (usdAmount) => {
  // Current exchange rate (you can update this or fetch from API)
  const exchangeRate = 280.50; // 1 USD = 280.50 PKR (approximate)
  return (usdAmount * exchangeRate).toFixed(2);
};

export const formatPKR = (amount) => {
  return `₨${parseFloat(amount).toLocaleString('en-PK')}`;
};

export const formatUSD = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

export const getCurrencyDisplay = (amount, showBoth = true) => {
  const usd = formatUSD(amount);
  const pkr = formatPKR(convertUSDToPKR(amount));
  
  if (showBoth) {
    return `${usd} (${pkr})`;
  }
  return pkr;
}; 