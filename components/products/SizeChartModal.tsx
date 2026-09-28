"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type SizeChartModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SIZE_CHART = [
  { size: "S", chest: '36" - 38"', waist: '30" - 32"', sleeve: '24"', length: '27"' },
  { size: "M", chest: '39" - 41"', waist: '33" - 35"', sleeve: '24.5"', length: '27.5"' },
  { size: "L", chest: '42" - 44"', waist: '36" - 38"', sleeve: '25"', length: '28"' },
  { size: "XL", chest: '45" - 47"', waist: '39" - 41"', sleeve: '25.5"', length: '28.5"' },
  { size: "XXL", chest: '48" - 50"', waist: '42" - 44"', sleeve: '26"', length: '29"' },
];

export default function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-chart-title"
            className="w-full max-w-2xl bg-white p-6 sm:p-8"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h2 id="size-chart-title" className="text-lg font-semibold text-black sm:text-xl">
                Size Chart
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close size chart"
                className="rounded-full p-1.5 text-black transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              All measurements are in inches. For the best fit, compare against a jacket you already own.
            </p>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                    <th scope="col" className="py-3 pr-4 font-semibold">Size</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Chest</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Waist</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Sleeve</th>
                    <th scope="col" className="py-3 font-semibold">Jacket Length</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART.map((row) => (
                    <tr key={row.size} className="border-b border-zinc-100">
                      <th scope="row" className="py-3 pr-4 font-semibold text-black">
                        {row.size}
                      </th>
                      <td className="py-3 pr-4 text-zinc-700">{row.chest}</td>
                      <td className="py-3 pr-4 text-zinc-700">{row.waist}</td>
                      <td className="py-3 pr-4 text-zinc-700">{row.sleeve}</td>
                      <td className="py-3 text-zinc-700">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
