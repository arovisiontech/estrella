"use client";

export default function ContactBadge() {
  return (
    <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-red-600 shadow-xl" />

      {/* Rotating outer text */}
      <svg
        className="absolute inset-0 h-full w-full animate-spin"
        style={{ animationDuration: "12s" }}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="circlePath"
            d="M 60, 60 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
            fill="none"
          />
        </defs>
        <text
          fontSize="8"
          fontWeight="700"
          fill="white"
          letterSpacing="2"
        >
          <textPath href="#circlePath" startOffset="0%" method="stretch">
            CONTACT NOW · CONTACT NOW · CONTACT NOW ·
          </textPath>
        </text>
      </svg>

      {/* Fixed center arrow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="h-5 w-5 text-white sm:h-6 sm:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l10 10M17 7v10H7" />
        </svg>
      </div>
    </div>
  );
}
