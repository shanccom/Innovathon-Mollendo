import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../../shared/constants/storageKeys';

// Theme preference persisted in localStorage and applied to the <html> element.
export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEYS.theme) ?? 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
