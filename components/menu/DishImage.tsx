import Image from "next/image";
import { DishIcon } from "@/components/ui/icons";
import type { Locale } from "@/lib/i18n";
import type { MenuImage } from "@/types/menu";

const defaultFrame = "relative aspect-[4/3] overflow-hidden";
const zoom = "transition-transform duration-700 ease-out group-hover:scale-[1.05]";

export function DishImage({
  image,
  locale,
  pendingLabel,
  priority,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  frame = defaultFrame,
}: {
  image?: MenuImage;
  locale: Locale;
  pendingLabel: string;
  priority?: boolean;
  sizes?: string;
  frame?: string;
}) {
  if (image?.lowResolution) {
    // Small source: show the photo at about its native size, centred, over a
    // softened copy of itself that fills the frame. No upscaling to the full
    // card width, so it does not look blurry on large screens.
    return (
      <div className={`${frame} flex items-center justify-center bg-line`}>
        <Image
          src={image.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="200px"
          className="scale-110 object-cover opacity-60 blur-xl"
        />
        <Image
          src={image.src}
          alt={image.alt[locale]}
          width={image.width}
          height={image.height}
          sizes="180px"
          priority={priority}
          className={`relative h-full max-h-[259px] w-auto shadow-lg ${zoom}`}
        />
      </div>
    );
  }

  if (image) {
    return (
      <div className={`${frame} bg-line`}>
        <Image
          src={image.src}
          alt={image.alt[locale]}
          fill
          sizes={sizes}
          priority={priority}
          // Uploaded photos come through /api/img (a redirect to S3); they
          // are resized when uploaded, so they are served as-is.
          unoptimized={image.remote}
          className={`object-cover ${zoom}`}
        />
      </div>
    );
  }

  // Neutral placeholder for dishes without a photo. Deliberately plain:
  // no logo, no stand-in food image.
  return (
    <div className={`${frame} flex flex-col items-center justify-center gap-2 bg-cream text-muted`}>
      <span className="flex size-12 items-center justify-center rounded-full bg-surface/70">
        <DishIcon className="size-6" />
      </span>
      <span className="text-xs font-medium">{pendingLabel}</span>
    </div>
  );
}
