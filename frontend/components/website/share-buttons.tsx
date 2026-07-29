"use client";

import { useState } from "react";
import { Share2, Link2, Check, Facebook, Twitter, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ShareButtonsProps = {
  productName: string;
  productSlug: string;
  className?: string;
};

/**
 * Share buttons for a product — WhatsApp, Facebook, Twitter/X, Copy Link.
 * Uses the Web Share API if available (mobile), falls back to individual buttons.
 */
export function ShareButtons({ productName, productSlug, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/#products`
    : `https://canbri.co.zw/#products`;
  const shareText = `Check out ${productName} from Canbri Private Limited`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const handleShare = (platform: "whatsapp" | "facebook" | "twitter") => {
    trackEvent("whatsapp_click", "share", { platform, product: productName });
    const urls = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      trackEvent("whatsapp_click", "share_copy_link", { product: productName });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = `${shareText} ${shareUrl}`;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* ignore */
      }
      document.body.removeChild(textarea);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: productName,
          text: shareText,
          url: shareUrl,
        });
        trackEvent("whatsapp_click", "share_native", { product: productName });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Share2 className="h-3 w-3" strokeWidth={2.25} />
        Share
      </span>
      <div className="flex items-center gap-1">
        <ShareButton
          onClick={() => handleShare("whatsapp")}
          label="Share on WhatsApp"
          color="hover:bg-[#25D366] hover:text-[#06351B]"
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.25} />
        </ShareButton>
        <ShareButton
          onClick={() => handleShare("facebook")}
          label="Share on Facebook"
          color="hover:bg-[#1877F2] hover:text-white"
        >
          <Facebook className="h-3.5 w-3.5" strokeWidth={2.25} />
        </ShareButton>
        <ShareButton
          onClick={() => handleShare("twitter")}
          label="Share on Twitter/X"
          color="hover:bg-black hover:text-white"
        >
          <Twitter className="h-3.5 w-3.5" strokeWidth={2.25} />
        </ShareButton>
        <ShareButton
          onClick={handleCopyLink}
          label={copied ? "Link copied!" : "Copy link"}
          color={copied ? "bg-emerald-500 text-white" : "hover:bg-brand-accent hover:text-brand-accent-fg"}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          ) : (
            <Link2 className="h-3.5 w-3.5" strokeWidth={2.25} />
          )}
        </ShareButton>
        {/* Native share button (only shows on mobile/compatible devices) */}
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="More sharing options"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-brand-heading transition-colors hover:bg-secondary sm:hidden"
        >
          <Share2 className="h-3.5 w-3.5" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}

function ShareButton({
  onClick,
  label,
  color,
  children,
}: {
  onClick: () => void;
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-brand-heading transition-all duration-200 hover:scale-105 hover:border-transparent",
        color,
      )}
    >
      {children}
    </button>
  );
}
