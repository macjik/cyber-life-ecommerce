'use client';

import Button from './button';

export default function PayButton({ orderId, className = '', children = 'Pay', ...props }) {
  async function handleClick(event) {
    event.preventDefault();
    window.location.href = `https://t.me/mimi_uz_bot?start=${orderId}`
  }

  return (
    <Button className={`${className} text-white bg-orange-500`} onClick={handleClick}>
      {children}
    </Button>
  );
}
