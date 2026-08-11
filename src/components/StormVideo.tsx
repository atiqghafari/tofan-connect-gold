import { useEffect, useRef } from "react";
import stormVideo from "@/assets/storm.mp4.asset.json";

type Props = { className?: string; rate?: number; fade?: number };

/**
 * Seamless storm loop: two offset video layers cross-fade into each other so the
 * clip never visibly restarts, played back slower for a heavier, more real motion.
 */
export function StormVideo({ className, rate = 0.55, fade = 2.2 }: Props) {
  const aRef = useRef<HTMLVideoElement | null>(null);
  const bRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    let raf = 0;
    let ready = false;

    const start = () => {
      if (ready || !a.duration || !isFinite(a.duration)) return;
      ready = true;
      a.playbackRate = rate;
      b.playbackRate = rate;
      b.currentTime = a.duration / 2;
      void a.play().catch(() => {});
      void b.play().catch(() => {});
    };

    const tick = () => {
      const d = a.duration;
      if (ready && d && isFinite(d)) {
        // fade each layer in/out around its own loop seam
        const weight = (v: HTMLVideoElement) => {
          const tIn = v.currentTime;
          const tOut = d - v.currentTime;
          return Math.min(1, tIn / fade, tOut / fade);
        };
        const wa = weight(a);
        const wb = weight(b);
        const sum = wa + wb || 1;
        a.style.opacity = String(wa / sum);
        b.style.opacity = String(wb / sum);
      }
      raf = requestAnimationFrame(tick);
    };

    a.addEventListener("loadedmetadata", start);
    b.addEventListener("loadedmetadata", start);
    start();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      a.removeEventListener("loadedmetadata", start);
      b.removeEventListener("loadedmetadata", start);
    };
  }, [rate, fade]);

  const shared =
    "pointer-events-none absolute inset-0 h-full w-full object-cover will-change-[opacity]";

  return (
    <div className={className} aria-hidden="true">
      <video ref={aRef} className={shared} src={stormVideo.url} autoPlay muted loop playsInline preload="auto" />
      <video ref={bRef} className={shared} src={stormVideo.url} autoPlay muted loop playsInline preload="auto" style={{ opacity: 0 }} />
    </div>
  );
}
