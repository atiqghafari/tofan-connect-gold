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

    let ready = false;
    let lastA = -1;
    let lastB = -1;

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

    // Use the browser's video-frame callback when available (synced to the
    // actual decoded frame, far cheaper than a 60fps RAF). Fall back to RAF.
    const tick = () => {
      const d = a.duration;
      if (ready && d && isFinite(d)) {
        const wa = weight(a, d);
        const wb = weight(b, d);
        const sum = wa + wb || 1;
        const oa = wa / sum;
        const ob = wb / sum;
        // only write to the DOM when the rounded opacity actually changes
        if (Math.abs(oa - lastA) > 0.01) {
          a.style.opacity = String(oa);
          lastA = oa;
        }
        if (Math.abs(ob - lastB) > 0.01) {
          b.style.opacity = String(ob);
          lastB = ob;
        }
      }
      rafLoop();
    };

    let rafLoop: () => void;
    const raf = () => requestAnimationFrame(tick);
    if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) {
      const vfcb = (_now: number, _meta: unknown) => {
        tick();
      };
      rafLoop = () => a.requestVideoFrameCallback(vfcb as never);
      rafLoop();
    } else {
      let id = 0;
      rafLoop = () => {
        id = requestAnimationFrame(tick);
      };
      rafLoop();
      return () => {
        cancelAnimationFrame(id);
        a.removeEventListener("loadedmetadata", start);
        b.removeEventListener("loadedmetadata", start);
      };
    }

    a.addEventListener("loadedmetadata", start);
    b.addEventListener("loadedmetadata", start);
    start();

    return () => {
      if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) {
        a.removeEventListener("loadedmetadata", start);
        b.removeEventListener("loadedmetadata", start);
      }
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
