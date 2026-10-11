import Image from "next/image";

// public/mama-food-logo.png is 1774 x 887 with a transparent margin around
// the artwork. The file is used unchanged; this frame shows only the area
// around the artwork (x 300-1455, y 190-832) so the logo reads at small sizes.
const SOURCE = { width: 1774, height: 887 };
const CROP = { x: 300, y: 190, width: 1155, height: 642 };

/** Dark logo for light backgrounds. Size it with a height class. */
export function Logo({
  alt,
  className = "",
  priority = false,
}: {
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={`relative inline-block overflow-hidden ${className}`}
      style={{ aspectRatio: `${CROP.width} / ${CROP.height}` }}
    >
      <Image
        src="/mama-food-logo.png"
        alt={alt}
        width={SOURCE.width}
        height={SOURCE.height}
        priority={priority}
        sizes="130px"
        className="absolute h-auto max-w-none"
        style={{
          width: `${(SOURCE.width / CROP.width) * 100}%`,
          left: `${-(CROP.x / CROP.width) * 100}%`,
          top: `${-(CROP.y / CROP.height) * 100}%`,
        }}
      />
    </span>
  );
}
