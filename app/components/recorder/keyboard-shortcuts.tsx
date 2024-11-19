"use client";

import { useEffect } from 'react';
import { KeyboardShortcut } from './types';

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
}

export const KeyboardShortcuts = ({ shortcuts }: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => s.key === event.key);
      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return null;
};