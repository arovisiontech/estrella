"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ToastVariant = "success" | "error";

export function useToast(duration = 2800) {
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<ToastVariant>("success");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (nextMessage: string, nextVariant: ToastVariant = "success") => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMessage(nextMessage);
      setVariant(nextVariant);
      setVisible(true);
      timerRef.current = setTimeout(() => setVisible(false), duration);
    },
    [duration]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { message, variant, visible, showToast };
}
