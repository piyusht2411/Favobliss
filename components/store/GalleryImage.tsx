import Image from "next/image";

const images = [
  {
    href: "/",
    src: "/assets/gallery/juice-small.jpg",
    srcSet:
      "/assets/gallery/juice-small.jpg 1x, /assets/gallery/juice-mid.jpg 2x",
    alt: "Mixer Grinder",
    width: 300,
    height: 400,
  },
  {
    href: "/",
    src: "/assets/gallery/boat-small.jpg",
    srcSet:
      "/assets/gallery/boat-small.jpg 1x, /assets/gallery/boat-mid.jpg 2x",
    alt: "BoAt Speaker",
    width: 600,
    height: 600,
  },
  {
    href: "/",
    src: "/assets/gallery/cattle-small.jpg",
    srcSet:
      "/assets/gallery/cattle-small.jpg 1x, /assets/gallery/cattle-mid.jpg 2x",
    alt: "Fashionable Watches",
    width: 300,
    height: 400,
  },
  {
    href: "/",
    src: "/assets/gallery/juice-small.jpg",
    srcSet:
      "/assets/gallery/juice-small.jpg 1x, /assets/gallery/juice-mid.jpg 2x",
    alt: "Mixer Grinder",
    width: 300,
    height: 400,
  },
];

const Gallery = () => {
  return (
    <div className="w-full max-w-full mx-auto p-4 py-0">
      <div className="sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        {images.map((img, index) => (
          <a
            key={index}
            href={img.href}
            className="block overflow-hidden rounded-lg shadow-md bg-white transition-transform duration-300 flex-shrink-0 w-[36%] sm:w-auto snap-start mr-3 sm:mr-0"
          >
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 36vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
