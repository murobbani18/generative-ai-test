// /src/hooks/useChatApi.ts
import { useState } from 'react';

interface SendMessagePayload {
  text: string;
  file?: File | null;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async ({ text, file }: SendMessagePayload): Promise<string | string[]> => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (file) formData.append('file', file);

      const res = await fetch( API_URL +'/chat', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      return data.reply || 'Tidak ada balasan';
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
};
