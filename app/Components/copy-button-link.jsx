'use client';

import Button from './button';

export default function CopyButtonLink({ item, children = 'Copy product Link', className = '' }) {
  const productLink = `${process.env.NEXT_PUBLIC_FRONTEND_HOST}${item.toString()}`;

  function handleCopy() {
    navigator.clipboard.writeText(productLink).then(() => {
      const button = document.getElementById(`copy-button-${item.toString()}`);
      if (button) {
        button.textContent = 'Link Copied!';
        setTimeout(() => {
          button.textContent = children;
        }, 2000);
      }
    });
  }

  return (
    <Button className={`${className}`} id={`copy-button-${item.toString()}`} onClick={handleCopy}>
      {children}
    </Button>
  );
}
