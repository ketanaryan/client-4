import { useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([]);

  const toast = ({ title, description, variant }: any) => {
    // Mock implementation for now
    console.log(`[Toast] ${variant === 'destructive' ? 'ERROR' : 'INFO'}: ${title} - ${description}`);
    if (typeof window !== 'undefined') {
      window.alert(`${title}\n\n${description}`);
    }
  };

  return { toast, toasts };
}
