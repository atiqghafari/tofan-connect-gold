/**
 * Full-page ambience: real-looking lightning flashes anywhere on the screen
 * plus slow drifting dust. Purely decorative, pointer-events none.
 */
export function StormAmbience() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <div className="page-flash page-flash-1 absolute inset-0" />
      <div className="page-flash page-flash-2 absolute inset-0" />
      <div className="page-flash page-flash-3 absolute inset-0" />
      <div className="dust-layer dust-a absolute inset-[-20%]" />
      <div className="dust-layer dust-b absolute inset-[-20%]" />
      <div className="dust-layer dust-c absolute inset-[-20%]" />
    </div>
  );
}