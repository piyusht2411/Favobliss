import Image from "next/image";

const images = [
  {
    href: "https://www.favobliss.com/mixer-juicer-grinder",
    src: "https://www.favobliss.com/image/cache/catalog/carousel/mixer-grinder-juice-300x400.png",
    srcSet:
      "https://www.favobliss.com/image/cache/catalog/carousel/mixer-grinder-juice-300x400.png 1x, https://www.favobliss.com/image/cache/catalog/carousel/mixer-grinder-juice-600x800.png 2x",
    alt: "Mixer Grinder",
    width: 300,
    height: 400,
  },
  {
    href: "https://www.favobliss.com/Speakers",
    src: "https://www.favobliss.com/image/cache/catalog/boat-spiker-600x600.jpg",
    srcSet:
      "https://www.favobliss.com/image/cache/catalog/boat-spiker-600x600.jpg 1x, https://www.favobliss.com/image/cache/catalog/boat-spiker-1200x1200.jpg 2x",
    alt: "BoAt Speaker",
    width: 600,
    height: 600,
  },
  {
    href: "https://www.favobliss.com/Latest-Trendy-Fashionable-Watches",
    src: "https://www.favobliss.com/image/cache/catalog/carousel/favobliss-fastival-offer%20(7)-300x400w.jpg",
    srcSet:
      "https://www.favobliss.com/image/cache/catalog/carousel/favobliss-fastival-offer%20(7)-300x400w.jpg 1x, https://www.favobliss.com/image/cache/catalog/carousel/favobliss-fastival-offer%20(7)-600x800w.jpg 2x",
    alt: "Fashionable Watches",
    width: 300,
    height: 400,
  },
  {
    href: "https://www.favobliss.com/mixer-juicer-grinder",
    src: "https://www.favobliss.com/image/cache/catalog/carousel/mixer-grinder-juice-300x400.png",
    srcSet:
      "https://www.favobliss.com/image/cache/catalog/carousel/mixer-grinder-juice-300x400.png 1x, https://www.favobliss.com/image/cache/catalog/carousel/mixer-grinder-juice-600x800.png 2x",
    alt: "Mixer Grinder",
    width: 300,
    height: 400,
  },
];

const Gallery = () => {
  return (
    <div className="w-full max-w-full mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <a
            key={index}
            href={img.href}
            className="block overflow-hidden rounded-lg shadow-md bg-white hover:scale-105 transition-transform duration-300"
          >
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
