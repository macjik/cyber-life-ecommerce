'use client';

import { useState } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Button from './button';
import { Spinner } from './spinner';

axiosRetry(axios, { retries: 3 });

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
      setButtonText('Link Copied!');

      let res = await axios.post('/api/invite', { inviterId });
      res = res.data;

      const newInviteLink = `${process.env.NEXT_PUBLIC_FRONTEND_HOST}/${category}/${product}/?invite=${res.inviteCode}`;

      const successful = await copyToClipboard(newInviteLink);

      if (!successful) {
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
      {loading ? <Spinner/> : buttonText}
    </Button>
  );
}
