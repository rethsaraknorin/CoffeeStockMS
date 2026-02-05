'use client';

import { useEffect } from 'react';

const getPreferredTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('theme') || 'light';
  if (saved === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return saved;
};

export default function ThemeInitializer() {
  useEffect(() => {
    const applyTheme = () => {
      const theme = getPreferredTheme();
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const saved = localStorage.getItem('theme');
      if (saved === 'system') {
        applyTheme();
      }
    };

    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }

    // Safari fallback
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  return null;
}
