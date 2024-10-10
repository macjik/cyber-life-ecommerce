'use client';

import { useState } from 'react';
import axios from 'axios';
import Button from './button';

export default function InviteLinkGenerator({ category, product, inviterId, children, className = '' }) {
  const [buttonText, setButtonText] = useState(children);

  async function handleLinkGenerate(event) {
    event.preventDefault();
    try {
      let res = await axios.post('/api/invite', { inviterId: inviterId });
      res = res.data;
      const newInviteLink = `${process.env.NEXT_PUBLIC_FRONTEND_HOST}/${category}/${product}/?invite=${res.inviteCode}`;

      navigator.clipboard.writeText(newInviteLink).then(() => {
        setButtonText('Link Copied!');
        setTimeout(() => {
          setButtonText(children);
        }, 2000);
      });
    } catch (err) {
      console.error('Error generating invite link:', err);
    }
  }

  return (
    <Button onClick={handleLinkGenerate} className={`${className} mt-2`}>
      {buttonText}
    </Button>
  );
}
