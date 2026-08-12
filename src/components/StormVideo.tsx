import { useEffect, useRef } from "react";
import stormVideo from "@/assets/tornado-real.mp4.asset.json";

type Props = { className?: string; rate?: number; fade?: number };

/**
 * Seamless storm loop: two offset video layers cross-fade into each other so the
 * clip never visibly restarts, played back slower for a heavier, more real motion.
 */
export function StormVideo({ className, rate = 0.45, fade = 2.2 }: Props) {
  const aRef = useRef<HTMLVideoElement | null>(null);
  const bRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    let ready = false;
    let lastA = -1;
    let lastB = -1;
    let cancelled = false;
    let rafId = 0;

    const start = () => {
      if (ready || !a.duration || !isFinite(a.duration)) return;
      ready = true;
      a.playbackRate = rate;
      b.playbackRate = rate;
      b.currentTime = a.duration / 2;
      void a.play().catch(() => {});
      void b.play().catch(() => {});
    };

    const weight = (v: HTMLVideoElement, d: number) => {
      const tIn = v.currentTime;
      const tOut = d - v.currentTime;
      return Math.min(1, tIn / fade, tOut / fade);
    };

    const tick = () => {
      if (cancelled) return;
      const d = a.duration;
      if (ready && d && isFinite(d)) {
        const wa = weight(a, d);
        const wb = weight(b, d);
        const sum = wa + wb || 1;
        const oa = wa / sum;
        const ob = wb / sum;
        // Only touch the DOM when opacity meaningfully changes — avoids
        // fighting the compositor every frame and keeps playback smooth.
        if (Math.abs(oa - lastA) > 0.01) {
          a.style.opacity = String(oa);
          lastA = oa;
        }
        if (Math.abs(ob - lastB) > 0.01) {
          b.style.opacity = String(ob);
          lastB = ob;
        }
      }
      // Sync to the actual decoded video frame when available; otherwise RAF.
      if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) {
        (a as HTMLVideoElement & {
          requestVideoFrameCallback: (cb: () => void) => number;
        }).requestVideoFrameCallback(tick);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    a.addEventListener("loadedmetadata", start);
    b.addEventListener("loadedmetadata", start);
    start();
    tick();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      a.removeEventListener("loadedmetadata", start);
      b.removeEventListener("loadedmetadata", start);
    };
  }, [rate, fade]);

  const shared =
    "pointer-events-none absolute inset-0 h-full w-full object-cover will-change-[opacity] brightness-110 contrast-110 saturate-110 sepia-[0.22]";

  return (
    <div className={className} aria-hidden="true">
      <div className="absolute inset-0 scale-[1.45]">
        <video ref={aRef} className={shared} src={stormVideo.url} autoPlay muted loop playsInline preload="auto" />
        <video ref={bRef} className={shared} src={stormVideo.url} autoPlay muted loop playsInline preload="auto" style={{ opacity: 0 }} />
      </div>
    </div>
  );
}
