'use client';

import { useState } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Button from './button';

axiosRetry(axios, { retries: 3 });

export default function InviteLinkGenerator({
  category,
  product,
  inviterId,
  children,
  className = '',
}) {
  const [buttonText, setButtonText] = useState(children);

  async function handleLinkGenerate(event) {
    event.preventDefault();
    try {
      let res = await axios.post('/api/invite', { inviterId });
      res = res.data;

      const newInviteLink = `${process.env.NEXT_PUBLIC_FRONTEND_HOST}/${category}/${product}/?invite=${res.inviteCode}`;

      await navigator.clipboard.writeText(newInviteLink);
      setButtonText('Link Copied!');
    } catch (err) {
      console.error('Error generating invite link:', err);
      setButtonText('Error');
    } finally {
      setTimeout(() => setButtonText(children), 2000);
    }
  }

  return (
    <Button onClick={handleLinkGenerate} className={`${className} mt-2`}>
      {buttonText}
    </Button>
  );
}
