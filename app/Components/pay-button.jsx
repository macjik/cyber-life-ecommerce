import Link from '@/node_modules/next/link';
import Button from './button';

export default async function PayButton({ orderId, className = '', children = 'Pay', ...props }) {
  // async function handleClick(event) {
  //   event.preventDefault();
  //   window.location.href = `https://t.me/mimi_uz_bot?start=${orderId}`;
  // }

  return (
    <Button className={`${className} text-white bg-orange-500`}>
      <Link href={`https://t.me/mimi_uz_bot?start=${orderId}`} className="w-full" target="_blank">
        {children}
      </Link>
    </Button>
  );
}
