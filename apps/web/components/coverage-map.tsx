"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// viewBox size of /map.svg. Pin coordinates below live in this space, so the
// pins stay glued to the artwork at every screen size.
const MAP_W = 1675;
const MAP_H = 795;
const MIN_SCALE = 1;
const MAX_SCALE = 4;

// Pin coordinates are in map viewBox units (x: 0-1675, y: 0-795).
// To move a pin, just change its x/y — nothing else needs touching.
const LOCATIONS = [
  { name: "Jakarta Selatan", x: 555, y: 345 },
  { name: "Bandung", x: 680, y: 470 },
  { name: "Semarang", x: 1195, y: 455 },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type View = { scale: number; fx: number; fy: number };

export function CoverageMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Active pointers (mouse/touch/pen) driving pan & pinch.
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; midX: number; midY: number } | null>(
    null,
  );
  const rectRef = useRef<DOMRect | null>(null);

  // fx/fy are pan offsets stored as fractions of the container size, so the
  // view stays valid when the container resizes (responsive breakpoints).
  const [view, setView] = useState<View>({ scale: 1, fx: 0, fy: 0 });

  // Zoom around a point given in container fractions (0..1). Offsets are
  // clamped so the map always covers the container — anything past the edges
  // is simply cropped by overflow-hidden.
  const zoomAt = useCallback((rx: number, ry: number, factor: number) => {
    setView((v) => {
      const scale = clamp(v.scale * factor, MIN_SCALE, MAX_SCALE);
      const ratio = scale / v.scale;
      return {
        scale,
        fx: clamp(rx - (rx - v.fx) * ratio, 1 - scale, 0),
        fy: clamp(ry - (ry - v.fy) * ratio, 1 - scale, 0),
      };
    });
  }, []);

  // React registers onWheel as passive, so preventDefault wouldn't work from
  // a React handler — attach a native non-passive listener instead.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(
        (e.clientX - rect.left) / rect.width,
        (e.clientY - rect.top) / rect.height,
        Math.exp(-e.deltaY * 0.0015),
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Let taps on a location pin through — hover/focus drives its tooltip.
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    rectRef.current = e.currentTarget.getBoundingClientRect();
    const pointers = pointersRef.current;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()] as [
        { x: number; y: number },
        { x: number; y: number },
      ];
      pinchRef.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        midX: (a.x + b.x) / 2,
        midY: (a.y + b.y) / 2,
      };
    } else {
      pinchRef.current = null;
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = rectRef.current;
    if (!rect) return;
    const pointers = pointersRef.current;
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.set(e.pointerId, cur);

    if (pointers.size === 1) {
      // Single pointer: drag to pan.
      const dx = (cur.x - prev.x) / rect.width;
      const dy = (cur.y - prev.y) / rect.height;
      setView((v) => ({
        ...v,
        fx: clamp(v.fx + dx, 1 - v.scale, 0),
        fy: clamp(v.fy + dy, 1 - v.scale, 0),
      }));
      return;
    }

    // Two pointers: pinch-zoom around the midpoint of the gesture.
    const pinch = pinchRef.current;
    if (pointers.size === 2 && pinch) {
      const [a, b] = [...pointers.values()] as [
        { x: number; y: number },
        { x: number; y: number },
      ];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const rx = (midX - rect.left) / rect.width;
      const ry = (midY - rect.top) / rect.height;
      const lastRx = (pinch.midX - rect.left) / rect.width;
      const lastRy = (pinch.midY - rect.top) / rect.height;
      setView((v) => {
        const scale = clamp(v.scale * (dist / pinch.dist), MIN_SCALE, MAX_SCALE);
        const ratio = scale / v.scale;
        return {
          scale,
          fx: clamp(rx - (rx - v.fx) * ratio + (rx - lastRx), 1 - scale, 0),
          fy: clamp(ry - (ry - v.fy) * ratio + (ry - lastRy), 1 - scale, 0),
        };
      });
      pinchRef.current = { dist, midX, midY };
    }
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-[900px] md:mt-12 min-[1920px]:mt-16">
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        className={`relative aspect-[1675/795] w-full touch-none select-none overflow-hidden overscroll-none ${
          view.scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
      >
        {/* The "world": map artwork + pins, translated & scaled together.
            overflow-hidden on the parent crops whatever leaves the box. */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${view.fx * 100}%, ${view.fy * 100}%) scale(${view.scale})`,
            transformOrigin: "0 0",
          }}
        >
          <Image
            src="/mapclean.svg"
            alt="Peta wilayah jangkauan layanan Esensi Indonesia"
            fill
            unoptimized
            draggable={false}
            className="pointer-events-none select-none"
          />
          {LOCATIONS.map((location) => (
            <div
              key={location.name}
              className="group absolute"
              style={{
                left: `${(location.x / MAP_W) * 100}%`,
                top: `${(location.y / MAP_H) * 100}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <button
                type="button"
                aria-label={location.name}
                className="relative block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                <Image
                  src="/location.svg"
                  alt=""
                  width={180}
                  height={180}
                  unoptimized
                  className="size-10 sm:size-12 md:size-16 min-[1920px]:size-20"
                />
                {/* Tooltip bubble, counter-scaled so its text stays the
                    same size no matter how far the map is zoomed in. */}
                <div
                  className="pointer-events-none absolute right-[calc(100%+2px)] top-1/2 hidden group-hover:block"
                  style={{
                    transform: `translate(0, -50%) scale(${1 / view.scale})`,
                    transformOrigin: "100% 50%",
                  }}
                >
                  <div className="relative z-10 rounded-lg bg-white px-2.5 py-1.5 shadow-lg">
                    <p className="whitespace-nowrap text-center font-display text-sm font-normal leading-[130%] text-esensi min-[1920px]:text-base">
                      {location.name}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="absolute left-full top-1/2 z-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] bg-white"
                  />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
