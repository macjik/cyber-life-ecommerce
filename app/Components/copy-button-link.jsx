'use client';

import Button from './button';

export default function CopyButtonLink({ item }) {
  const productLink = `${process.env.NEXT_PUBLIC_FRONTEND_HOST}${item.toString()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(productLink).then(() => {
      const button = document.getElementById(`copy-button-${item.toString()}`);
      if (button) {
        button.textContent = 'Link Copied!';
        setTimeout(() => {
          button.textContent = 'Copy Product Link';
        }, 2000);
      }
    });
  };

  return (
    <div>
      <Button className='max-w-max' id={`copy-button-${item.toString()}`} onClick={handleCopy}>
        Copy Product Link
      </Button>
    </div>
  );
}
