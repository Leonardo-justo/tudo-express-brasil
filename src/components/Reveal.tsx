"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type RevealProps = {
  className?: string;
  children: ReactNode;
};

export function Reveal({ className = "", children }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} reveal${visible ? " visible" : ""}`}>
      {children}
    </div>
  );
}
