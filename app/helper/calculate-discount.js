function calculateDiscount(discount, price, invitesCount) {
  //   let totalDiscounts = discount * invitesCount;
  //   let percentage = (price * totalDiscounts) / 100;
  //   return price - percentage;
  const total = (100 - discount) / invitesCount;
  return (price * total) / 100;
}

// (async () => {
//   const finalPrice = await calculateDiscount('turtle', 4);
//   console.log(finalPrice);
//   console.log(`Final price for "turtle" with 4 invites: ${finalPrice}`);
// })();

module.exports = calculateDiscount;
