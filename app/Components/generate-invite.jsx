'use client';

import { useState } from 'react';
import axios from 'axios';
import Button from './button';
import { v4 as uuidv4 } from 'uuid';

export default function InviteLinkGenerator({
  category,
  product,
  inviterId,
  children = 'Generate Link',
  className = '',
}) {
  const [buttonText, setButtonText] = useState(children);

  async function handleLinkGenerate(event) {
    event.preventDefault();

    const uid = uuidv4();
    const inviteLink = `${process.env.NEXT_PUBLIC_FRONTEND_HOST}/${category}/${product}/?invite=${uid}`;

    setButtonText('Link Copied!');
    await copyToClipboard(inviteLink);

    axios.post('/api/invite', { inviterId, uid }).catch((err) => {
      console.error('Error saving invite to database:', err);
    });

    // Reset the button text to default after 2 seconds
    setTimeout(() => {
      setButtonText(children);
    }, 2000);
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback: Unable to copy', err);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  }

  return (
    <Button onClick={handleLinkGenerate} className={className}>
      {buttonText}
    </Button>
  );
}
