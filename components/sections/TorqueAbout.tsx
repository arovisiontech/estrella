import Image from "next/image";
import Link from "next/link";

export default function TorqueAbout() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24 border-t border-slate-200">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#00AEF0] bg-sky-100 px-3 py-1 rounded-full">
              Estrella International — Precision Manufacturing
            </span>

            <h2 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Crafting Excellence With Precision &amp; Innovation
            </h2>

            <p className="max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
              Estrella International is a premier global manufacturer of custom sportswear, sublimated apparel, boxing gear, soccer balls, and surgical medical instruments. We collaborate with international brands, clubs, and medical institutions to deliver certified, high-performance OEM manufacturing.
            </p>

            <div className="space-y-3">
              <p className="text-sm font-bold text-[#00AEF0]">We Proudly Offer:</p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2 items-center">
                  <span className="text-[#00AEF0] font-bold">•</span>
                  <span>On-time global door-to-door delivery</span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-[#00AEF0] font-bold">•</span>
                  <span>Competitive B2B wholesale pricing</span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-[#00AEF0] font-bold">•</span>
                  <span>High-tech full sublimation &amp; surgical forging</span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-[#00AEF0] font-bold">•</span>
                  <span>CE &amp; ISO 13485 certified quality management</span>
                </li>
              </ul>
            </div>

            <Link
              href="/about"
              className="inline-block bg-[#00AEF0] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white rounded-full transition hover:bg-[#0095ce] shadow-md shadow-sky-500/20"
            >
              Learn More About Us
            </Link>
          </div>

          {/* Right Column - Circular Badge with Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-96 w-96">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <path
                    id="circlePath"
                    d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                    fill="none"
                  />
                </defs>
                <circle cx="100" cy="100" r="85" fill="none" stroke="#00AEF0" strokeWidth="3" />

                <text fontSize="10" fontWeight="bold" fill="#00AEF0" letterSpacing="3">
                  <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                    ESTRELLA CERTIFIED QUALITY ASSURED
                  </textPath>
                </text>
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-64 w-64">
                  <Image
                    src="/estrella-logo.svg"
                    alt="Estrella certification"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
