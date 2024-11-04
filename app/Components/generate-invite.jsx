'use client';

import { useState } from 'react';
import Button from './button';
import { Spinner } from './spinner';
import { generateInviteLink } from '../form-actions/copy-link';

export default function InviteLinkGenerator({
  category,
  product,
  inviterId,
  children,
  className = '',
}) {
  const [buttonText, setButtonText] = useState(children);
  const [loading, setLoading] = useState(false);

  async function handleLinkGenerate(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await generateInviteLink(inviterId);
      if (response.status === 500 || !response.inviteCode) {
        setButtonText('Error');
        return;
      }

      const newInviteLink = `${process.env.NEXT_PUBLIC_FRONTEND_HOST}/${category}/${product}/?invite=${response.inviteCode}`;

      const successful = await copyToClipboard(newInviteLink);
      setButtonText(successful ? 'Link Copied!' : 'Copy Failed');
    } catch (err) {
      console.error('Error generating invite link:', err);
      setButtonText('Error');
    } finally {
      setLoading(false);
      setTimeout(() => setButtonText(children), 2000);
    }
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        return false;
      }
    } else {
      console.warn('Clipboard API not supported');
      return false;
    }
  }

  return (
    <Button onClick={handleLinkGenerate} className={`${className}`} disabled={loading}>
      {loading ? <Spinner /> : buttonText}
    </Button>
  );
}
