"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

type ToastProps = {
  message: string;
  variant?: "success" | "error";
  visible: boolean;
};

export default function Toast({ message, variant = "success", visible }: ToastProps) {
  const Icon = variant === "success" ? CheckCircle2 : XCircle;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4 sm:justify-end sm:right-6 sm:left-auto"
      aria-live="polite"
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-lg ${
              variant === "success" ? "bg-black" : "bg-red-600"
            }`}
            role="status"
          >
            <Icon size={18} className={variant === "success" ? "text-red-500" : "text-white"} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
