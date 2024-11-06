'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Button from './button';
import { Spinner } from './spinner';

axiosRetry(axios, { retries: 3 });

export default function InviteLinkGeneratorWrapper(props) {
  const [key, setKey] = useState(0);

  function handleRerender() {
    setKey((prevKey) => prevKey + 1);
  }

  return <InviteLinkGenerator key={key} {...props} onRerender={handleRerender} />;
}

function InviteLinkGenerator({
  category,
  product,
  inviterId,
  children = 'Generate Link',
  className = '',
  onRerender,
}) {
  const [buttonText, setButtonText] = useState(children);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const isGenerated = useRef(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;

      async function generateLink() {
        if (isGenerated.current) return;

        try {
          let res = await axios.post('/api/invite', { inviterId });
          res = res.data;

          const newInviteLink = `${process.env.NEXT_PUBLIC_FRONTEND_HOST}/${category}/${product}/?invite=${res.inviteCode}`;
          setInviteLink(newInviteLink);
          isGenerated.current = true;
        } catch (err) {
          console.error('Error generating invite link on mount:', err);
        }
      }

      generateLink();
    }
  }, [category, product, inviterId]);

  function handleLinkGenerate(event) {
    event.preventDefault();
    setLoading(true);
    setButtonText('Copying Link...');

    if (inviteLink && copyToClipboardSync(inviteLink)) {
      setButtonText('Link Copied!');

      setTimeout(() => {
        setButtonText(children);
        onRerender();
      }, 2000);
    } else {
      setButtonText('Copy Failed');
      setTimeout(() => {
        setButtonText(children);
      }, 2000);
    }

    setLoading(false);
  }

  function copyToClipboardSync(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
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
      {loading ? <Spinner /> : buttonText}
    </Button>
  );
}
