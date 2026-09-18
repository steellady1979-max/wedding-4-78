import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1100ms] ease-out motion-reduce:transform-none motion-reduce:transition-none [&_.reveal-image]:transition-all [&_.reveal-image]:duration-[1400ms] [&_.reveal-image]:ease-out [&_.reveal-image]:motion-reduce:transform-none [&_.reveal-image]:motion-reduce:transition-none ${
        shown
          ? "translate-y-0 opacity-100 blur-0 [&_.reveal-image]:translate-y-0 [&_.reveal-image]:scale-100 [&_.reveal-image]:opacity-100"
          : "translate-y-8 opacity-0 blur-[2px] [&_.reveal-image]:translate-y-4 [&_.reveal-image]:scale-[0.985] [&_.reveal-image]:opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
