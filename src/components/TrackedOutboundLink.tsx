"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "@vercel/analytics";

type TrackedOutboundLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  eventName: string;
  eventProperties?: Record<string, string | number | boolean | null>;
};

export function TrackedOutboundLink({
  children,
  eventName,
  eventProperties,
  onClick,
  ...props
}: TrackedOutboundLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        track(eventName, eventProperties);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
