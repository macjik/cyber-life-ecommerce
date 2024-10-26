'use client';

import { useState } from 'react';
import Button from './button';

export default function CopyButtonLink({ item, children = 'Copy product Link', className = '' }) {
  const productLink = `${process.env.NEXT_PUBLIC_FRONTEND_HOST}${item.toString()}`;
  const [buttonText, setButtonText] = useState(children); // state to track button text

  function handleCopy() {
    navigator.clipboard.writeText(productLink).then(() => {
      setButtonText('Link Copied!');
      setTimeout(() => {
        setButtonText(children);
      }, 2000);
    });
  }

  return (
    <Button className={`${className}`} id={`copy-button-${item.toString()}`} onClick={handleCopy}>
      {buttonText}
    </Button>
  );
}
