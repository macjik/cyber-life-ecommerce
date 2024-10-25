'use client';

import axios from 'axios';
import Button from './button';

export default function PayButton({ orderId, className = '', children = 'Pay', ...props }) {
  async function handleClick(event) {
    event.preventDefault();
    try {
      let res = await axios.post('/api/pay', { orderId: orderId });
      res = res.data;

      window.location.href = `https://t.me/mimi_uz_bot?start=${res.orderId}`;
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Button className={`${className}`} onClick={handleClick}>
      {children}
    </Button>
  );
}
