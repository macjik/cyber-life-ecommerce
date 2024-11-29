'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from './button';

export default function Counter({ count = 1 }) {
  const [incremented, setIncrement] = useState(count);
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('count', incremented);
    router.replace(`?${searchParams.toString()}`);
  }, [incremented, router]);

  function addItem() {
    setIncrement((prev) => prev + 1);
  }

  function removeItem() {
    setIncrement((prev) => (prev > 1 ? prev - 1 : prev));
  }

  return (
    <div className="w-max">
      <Button onClick={addItem}>+</Button>
      <Button onClick={removeItem} disabled={incremented === 1}>
        -
      </Button>
      <span>{incremented}</span>
    </div>
  );
}
