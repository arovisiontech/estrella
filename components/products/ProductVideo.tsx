import type { ProductImage } from "@/lib/types/product";

type ProductVideoProps = {
  videoUrl: string;
  poster: ProductImage;
};

export default function ProductVideo({ videoUrl, poster }: ProductVideoProps) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-black">
      <video
        className="h-full w-full object-cover"
        src={videoUrl}
        poster={poster.src}
        controls
        playsInline
        preload="metadata"
        aria-label="Product video"
      />
    </div>
  );
}
