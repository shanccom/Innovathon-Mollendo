import { useState, useEffect } from 'react';

function calculateTimeLeft(targetDate) {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60 * 60)) % 24),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  };
}

/**
 * Hook to calculate remaining time until a specified target date.
 * @param {string | Date} targetDate - The ISO date string or Date object for the countdown.
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, isExpired: boolean }}
 */
export function useCountdown(targetDate = '2026-12-17T09:00:00') {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}
