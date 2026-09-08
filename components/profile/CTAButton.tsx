"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

export default function CTAButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "My LinkCard",
      text: "Connect with me on LinkCard",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // This also happens when the user closes the share menu.
    }
  };

  return (
    <div className="px-5 pb-4 pt-2">
      <button
        type="button"
        onClick={handleShare}
        className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
      >
        <Share2
          size={20}
          className="transition-transform duration-300 group-hover:rotate-12"
        />

        <span>
          {copied ? "Link Copied!" : "Share My LinkCard"}
        </span>
      </button>
    </div>
  );
}