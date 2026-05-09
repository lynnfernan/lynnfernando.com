"use client";

import { useState, useEffect } from "react";

const DROP_DATE = new Date("2026-05-17T00:00:00");

function getTimeLeft() {
  const diff = DROP_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: "Days", value: timeLeft?.days ?? 0 },
    { label: "Hrs", value: timeLeft?.hours ?? 0 },
    { label: "Min", value: timeLeft?.minutes ?? 0 },
    { label: "Sec", value: timeLeft?.seconds ?? 0 },
  ];

  return (
    <div className="flex gap-6 sm:gap-10 justify-center">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-start">
          <div className="flex flex-col items-center">
            <span
              className="text-5xl sm:text-7xl text-[#FF0080] leading-none tabular-nums"
              style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
            >
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[11px] text-gray-500 uppercase tracking-[0.3em] mt-1">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span
              className="text-3xl sm:text-5xl text-gray-700 mx-1 sm:mx-2 leading-none mt-1"
              style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
