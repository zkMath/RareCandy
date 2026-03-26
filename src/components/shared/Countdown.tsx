"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  targetTimestamp: number; // unix seconds
  className?: string;
  onExpired?: () => void;
}

export function Countdown({ targetTimestamp, className = "", onExpired }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function update() {
      const now = Math.floor(Date.now() / 1000);
      const diff = targetTimestamp - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        setExpired(true);
        onExpired?.();
        return;
      }

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp, onExpired]);

  return (
    <span className={`font-mono ${expired ? "text-red-500" : ""} ${className}`}>
      {timeLeft}
    </span>
  );
}
