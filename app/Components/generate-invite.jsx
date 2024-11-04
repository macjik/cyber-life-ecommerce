'use client';

import { useState } from 'react';
import Button from './button';
import { Spinner } from './spinner';
import { generateInviteLink } from '../form-actions/copy-link'; // Assuming this is your server action import

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
    setButtonText('Generating Link...');

    try {
      // Await the server action to generate the invite link
      let res = await generateInviteLink(inviterId);
      if (res.status === 500) {
        throw new Error('Error generating invite link');
      }

      const newInviteLink = `${process.env.NEXT_PUBLIC_FRONTEND_HOST}/${category}/${product}/?invite=${res.inviteCode}`;

      // Copy the generated link to clipboard
      const successful = await copyToClipboard(newInviteLink);

      if (successful) {
        setButtonText('Link Copied!');
      } else {
        setButtonText('Copy Failed');
      }
    } catch (err) {
      console.error('Error generating invite link:', err);
      setButtonText('Error');
    } finally {
      setLoading(false);
      setTimeout(() => setButtonText(children), 2000);
    }
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      return false;
    }
  }

  return (
    <Button onClick={handleLinkGenerate} className={`${className}`} disabled={loading}>
      {loading ? <Spinner /> : buttonText}
    </Button>
  );
}
