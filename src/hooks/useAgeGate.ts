"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "rarecandy_age_confirmed";

export function useAgeGate() {
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setConfirmed(stored === "true");
  }, []);

  const confirmAge = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setConfirmed(true);
  }, []);

  return {
    showAgeGate: confirmed === false,
    isLoading: confirmed === null,
    confirmAge,
  };
}
