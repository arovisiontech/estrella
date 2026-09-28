"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className="inline-flex items-center border border-zinc-300">
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-11 w-11 items-center justify-center text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus size={16} />
      </button>

      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        aria-label="Quantity"
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isNaN(next)) return;
          onChange(Math.min(max, Math.max(min, next)));
        }}
        className="h-11 w-12 border-x border-zinc-300 text-center text-sm font-medium text-black [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-11 w-11 items-center justify-center text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
