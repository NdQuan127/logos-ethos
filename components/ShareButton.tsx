'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareButtonProps {
  title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (typeof navigator !== 'undefined' && navigator.share) {
      // Native share sheet (mobile)
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled — not an error
      }
    } else {
      // Desktop fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard not available
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 hover:text-[var(--accent-primary)] transition-colors"
      aria-label={copied ? 'Đã sao chép liên kết' : 'Chia sẻ bài viết'}
    >
      {copied ? (
        <>
          <Check size={16} className="text-[var(--accent-primary)]" aria-hidden="true" />
          <span>Đã sao chép!</span>
        </>
      ) : (
        <>
          <Share2 size={16} aria-hidden="true" />
          <span>Chia sẻ</span>
        </>
      )}
    </button>
  );
}
