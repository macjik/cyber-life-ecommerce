function calculateDiscount(discount, price, invitesCount = 0) {
  if (invitesCount === 0) return price;
  const effectiveDiscount = Math.min(discount, (discount / 100) * invitesCount);
  const discountFactor = (100 - effectiveDiscount) / 100;
  return price * discountFactor;
}

module.exports = calculateDiscount;
