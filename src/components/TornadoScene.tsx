import { useEffect, useRef } from "react";

type Props = { className?: string };

/**
 * Cinematic supercell + tornado scene rendered on canvas.
 *
 * Layers (back to front):
 *  1. Sky gradient (storm grey -> pale horizon light)
 *  2. Rotating mesocyclone: large soft cloud blobs orbiting a centre
 *  3. Cloud base / shelf clouds drifting across
 *  4. Tornado funnel: a wavy, tapering condensation cone touching the ground
 *  5. Ground dust swirl + debris at the touchdown point
 *  6. Rain curtains, horizon land band, lightning flashes, gold dust accents
 */
export function TornadoScene({ className }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;

    type Blob = { a: number; r: number; rr: number; sp: number; y: number; op: number; g: number };
    let meso: Blob[] = [];

    type Shelf = { x: number; y: number; rx: number; ry: number; sp: number; op: number };
    let shelf: Shelf[] = [];

    type Dust = { a: number; rad: number; sp: number; r: number; op: number; rise: number };
    let dust: Dust[] = [];

    type Rain = { x: number; y: number; len: number; sp: number; op: number };
    let rain: Rain[] = [];

    let flash = 0;
    let nextFlash = 240 + Math.random() * 420;
    let bolt: [number, number][] = [];

    // scene anchors
    let horizon = 0;
    let touchX = 0;
    let baseY = 0; // cloud base height

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      horizon = h * 0.82;
      baseY = h * 0.6;
      touchX = w * 0.63;
      const scale = Math.max(w, h);

      meso = Array.from({ length: 46 }, () => ({
        a: rand(0, Math.PI * 2),
        r: rand(0.05, 0.85) * scale * 0.7,
        rr: rand(0.12, 0.42) * scale * 0.6,
        sp: rand(0.0009, 0.0026),
        y: rand(-0.34, 0.06) * h,
        op: rand(0.08, 0.24),
        g: rand(0, 1),
      }));

      shelf = Array.from({ length: 16 }, () => ({
        x: rand(-0.2, 1.2) * w,
        y: rand(0.24, 0.56) * h,
        rx: rand(0.14, 0.42) * w,
        ry: rand(0.05, 0.13) * h,
        sp: rand(0.06, 0.22),
        op: rand(0.12, 0.3),
      }));

      dust = Array.from({ length: 150 }, () => ({
        a: rand(0, Math.PI * 2),
        rad: Math.pow(Math.random(), 0.6) * w * 0.2,
        sp: rand(0.02, 0.07),
        r: rand(0.6, 2.6),
        op: rand(0.1, 0.5),
        rise: rand(0, 1),
      }));

      rain = Array.from({ length: Math.round(Math.min(220, w * 0.25)) }, () => ({
        x: rand(0, w),
        y: rand(0, horizon),
        len: rand(14, 46),
        sp: rand(7, 16),
        op: rand(0.03, 0.12),
      }));
    };

    // ---- funnel geometry: wavy tapering cone from cloud base to ground ----
    const funnelX = (yy: number) => {
      // yy: 0 at cloud base, 1 at ground
      const sway = Math.sin(t * 0.012 + yy * 3.1) * 26 * yy +
        Math.sin(t * 0.021 + yy * 6.4) * 9 * yy;
      return touchX + sway + Math.sin(t * 0.006) * 18;
    };

    const funnelW = (yy: number) => {
      const top = Math.min(w * 0.035, h * 0.03);
      const taper = Math.pow(1 - yy, 1.25);
      const wobble = 1 + Math.sin(t * 0.03 + yy * 9) * 0.07;
      return (top * taper + 2.5) * wobble;
    };

    const drawWallCloud = () => {
      const cx = funnelX(0);
      const cy = baseY - h * 0.03;
      // several soft, overlapping lumps → organic cloud base, no hard edges
      const lumps: [number, number, number, number][] = [
        [-0.22, -0.02, 0.3, 0.5],
        [0.06, -0.05, 0.36, 0.45],
        [0.3, 0.0, 0.26, 0.42],
        [-0.46, 0.02, 0.24, 0.34],
        [0.52, 0.02, 0.24, 0.3],
        [0.0, 0.035, 0.18, 0.6],
      ];
      for (const [ox, oy, rr, op] of lumps) {
        const x = cx + ox * w + Math.sin(t * 0.004 + ox * 6) * 12;
        const y = cy + oy * h + Math.sin(t * 0.006 + ox * 3) * 5;
        const R = rr * w;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, 0.34);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
        g.addColorStop(0, `rgba(20, 21, 24, ${op})`);
        g.addColorStop(0.5, `rgba(30, 32, 36, ${op * 0.5})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const drawFunnel = () => {
      const groundY = horizon + h * 0.02;
      const steps = 46;

      // soft halo
      ctx.save();
      ctx.filter = "blur(10px)";
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const yy = i / steps;
        const y = baseY + (groundY - baseY) * yy;
        ctx.lineTo(funnelX(yy) - funnelW(yy) * 1.25, y);
      }
      for (let i = steps; i >= 0; i--) {
        const yy = i / steps;
        const y = baseY + (groundY - baseY) * yy;
        ctx.lineTo(funnelX(yy) + funnelW(yy) * 1.25, y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(120, 124, 132, 0.1)";
      ctx.fill();
      ctx.restore();

      // body
      const grd = ctx.createLinearGradient(0, baseY, 0, groundY);
      grd.addColorStop(0, "rgba(78, 82, 90, 0.72)");
      grd.addColorStop(0.45, "rgba(112, 114, 118, 0.6)");
      grd.addColorStop(1, "rgba(146, 140, 126, 0.34)");
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const yy = i / steps;
        const y = baseY + (groundY - baseY) * yy;
        ctx.lineTo(funnelX(yy) - funnelW(yy), y);
      }
      for (let i = steps; i >= 0; i--) {
        const yy = i / steps;
        const y = baseY + (groundY - baseY) * yy;
        ctx.lineTo(funnelX(yy) + funnelW(yy), y);
      }
      ctx.closePath();
      ctx.fillStyle = grd;
      ctx.fill();

      // rotating condensation striations inside the funnel
      ctx.save();
      ctx.clip();
      for (let k = 0; k < 16; k++) {
        const phase = ((t * 0.02 + k / 16) % 1);
        const yy = phase;
        const y = baseY + (groundY - baseY) * yy;
        const fw = funnelW(yy);
        const fx = funnelX(yy);
        const shift = Math.sin(t * 0.05 + k) * fw * 0.5;
        ctx.beginPath();
        ctx.ellipse(fx + shift * 0.3, y, fw * 0.85, Math.max(2, fw * 0.22), 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 208, 200, ${0.05 + 0.05 * Math.abs(Math.sin(t * 0.04 + k))})`;
        ctx.fill();
      }
      ctx.restore();
    };

    const drawMeso = () => {
      const cx = touchX + w * 0.05;
      const cy = baseY - h * 0.3;
      for (const b of meso) {
        b.a += b.sp;
        const x = cx + Math.cos(b.a) * b.r;
        const y = cy + Math.sin(b.a) * b.r * 0.34 + b.y;
        const g = ctx.createRadialGradient(x, y, 0, x, y, b.rr);
        const tint = b.g > 0.72 ? "150, 132, 96" : "104, 108, 116";
        g.addColorStop(0, `rgba(${tint}, ${b.op})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, b.rr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawShelf = () => {
      for (const s of shelf) {
        s.x += s.sp;
        if (s.x - s.rx > w) s.x = -s.rx;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.scale(1, s.ry / s.rx);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s.rx);
        g.addColorStop(0, `rgba(74, 76, 82, ${s.op})`);
        g.addColorStop(0.6, `rgba(60, 62, 68, ${s.op * 0.4})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, s.rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const drawDust = () => {
      const gy = horizon + h * 0.015;
      const fx = funnelX(1);
      for (const d of dust) {
        d.a += d.sp;
        d.rise += 0.004;
        if (d.rise > 1) d.rise = 0;
        const lift = d.rise;
        const rad = d.rad * (1 + lift * 0.9);
        const x = fx + Math.cos(d.a) * rad;
        const y = gy - lift * h * 0.1 + Math.sin(d.a) * rad * 0.16;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 166, 104, ${d.op * (1 - lift) * 0.8})`;
        ctx.fill();
      }
      // dust cloud at touchdown
      const g = ctx.createRadialGradient(fx, gy, 0, fx, gy, w * 0.16);
      g.addColorStop(0, "rgba(150, 132, 96, 0.3)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, gy - h * 0.14, w, h * 0.2);
    };

    const drawRain = () => {
      ctx.strokeStyle = "rgba(190, 196, 205, 0.5)";
      ctx.lineWidth = 0.8;
      for (const r of rain) {
        r.y += r.sp;
        r.x += r.sp * 0.18;
        if (r.y > horizon) {
          r.y = -r.len;
          r.x = rand(-40, w);
        }
        ctx.globalAlpha = r.op;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - r.len * 0.18, r.y + r.len);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const drawGround = () => {
      const g = ctx.createLinearGradient(0, horizon - h * 0.03, 0, h);
      g.addColorStop(0, "rgba(26, 26, 24, 0.9)");
      g.addColorStop(0.35, "rgba(18, 18, 16, 1)");
      g.addColorStop(1, "rgba(8, 8, 7, 1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, horizon - h * 0.03, w, h - horizon + h * 0.03);

      // pale light strip on the horizon
      const hz = ctx.createLinearGradient(0, horizon - h * 0.07, 0, horizon + h * 0.01);
      hz.addColorStop(0, "rgba(0,0,0,0)");
      hz.addColorStop(1, "rgba(198, 176, 122, 0.16)");
      ctx.fillStyle = hz;
      ctx.fillRect(0, horizon - h * 0.07, w, h * 0.08);
    };

    const makeBolt = () => {
      const x1 = funnelX(0) + rand(-w * 0.3, w * 0.3);
      const y2 = horizon - rand(0, h * 0.12);
      const segs: [number, number][] = [[x1, baseY * 0.6]];
      const steps = 8;
      for (let s = 1; s <= steps; s++) {
        segs.push([
          x1 + rand(-46, 46) + (s / steps) * rand(-60, 60),
          baseY * 0.6 + ((y2 - baseY * 0.6) / steps) * s,
        ]);
      }
      return segs;
    };

    const drawLightning = () => {
      if (!bolt.length) return;
      ctx.save();
      ctx.strokeStyle = `rgba(236, 240, 250, ${0.7 * flash})`;
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 24;
      ctx.shadowColor = `rgba(214, 226, 255, ${0.9 * flash})`;
      ctx.beginPath();
      ctx.moveTo(bolt[0]![0], bolt[0]![1]);
      for (let i = 1; i < bolt.length; i++) ctx.lineTo(bolt[i]![0], bolt[i]![1]);
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      t += 1;

      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, "#1d2126");
      sky.addColorStop(0.42, "#4c5158");
      sky.addColorStop(0.78, "#6b6f75");
      sky.addColorStop(1, "#9b9482");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, horizon + 2);

      // heavy dark cloud mass across the top for readability
      const mass = ctx.createLinearGradient(0, 0, 0, h * 0.62);
      mass.addColorStop(0, "rgba(10, 11, 13, 0.92)");
      mass.addColorStop(0.55, "rgba(16, 18, 21, 0.55)");
      mass.addColorStop(1, "rgba(0,0,0,0)");

      drawMeso();
      drawShelf();
      ctx.fillStyle = mass;
      ctx.fillRect(0, 0, w, h * 0.62);
      drawRain();
      drawWallCloud();
      drawFunnel();
      drawGround();
      drawDust();

      // lightning
      nextFlash -= 1;
      if (nextFlash <= 0) {
        flash = 1;
        nextFlash = 300 + Math.random() * 560;
        bolt = makeBolt();
      }
      if (flash > 0) {
        ctx.fillStyle = `rgba(226, 232, 245, ${0.06 * flash})`;
        ctx.fillRect(0, 0, w, h);
        drawLightning();
        flash -= 0.04;
      }

      // vignette to keep text readable
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * 0.2, w * 0.5, h * 0.5, Math.max(w, h) * 0.78);
      vg.addColorStop(0, "rgba(0,0,0,0.05)");
      vg.addColorStop(1, "rgba(0,0,0,0.38)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    build();
    draw();
    const onResize = () => build();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}