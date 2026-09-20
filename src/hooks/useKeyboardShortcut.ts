import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifierKey?: 'ctrl' | 'meta' | 'alt' | 'shift'
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check modifier
      if (modifierKey === 'ctrl' && !(event.ctrlKey || event.metaKey)) return;
      if (modifierKey === 'alt' && !event.altKey) return;
      if (modifierKey === 'shift' && !event.shiftKey) return;

      if (event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, modifierKey]);
}
