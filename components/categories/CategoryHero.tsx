import Image from "next/image";
import { ReactNode } from "react";

type CategoryHeroProps = {
  categoryName: string;
  bannerSrc: string;
  bannerAlt: string;
  children?: ReactNode;
};

export default function CategoryHero({
  categoryName,
  bannerSrc,
  bannerAlt,
  children,
}: CategoryHeroProps) {
  return (
    <div className="relative w-full overflow-hidden bg-black">
      {/* Hero background image */}
      <div className="relative h-[280px] w-full sm:h-[320px] lg:h-[380px]">
        <Image
          src={bannerSrc}
          alt={bannerAlt}
          fill
          priority
          className="object-contain sm:object-cover"
          sizes="100vw"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero content - positioned over image */}
      <div className="absolute inset-0 flex flex-col items-start justify-end pb-6 sm:pb-8 lg:pb-10">
        <div className="site-container w-full">
          {/* Breadcrumb will be passed as children */}
          {children && <div className="mb-4">{children}</div>}

          {/* Category title */}
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl uppercase tracking-tight">
            {categoryName}
          </h1>
        </div>
      </div>
    </div>
  );
}
