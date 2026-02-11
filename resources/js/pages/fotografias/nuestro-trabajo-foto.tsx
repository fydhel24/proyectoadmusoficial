import { useState } from 'react';

const imageList = [
  {
    id: 1,
    title: 'Sesión de producto',
    imageUrl: '/Gflores/logo1.png',
  },
  {
    id: 2,
    title: 'Evento corporativo',
    imageUrl: '/Gflores/imagen1.jpg',
  },
  {
    id: 3,
    title: 'Backstage sesión moda',
    imageUrl: '/Gflores/imagen1.jpg',
  },
  {
    id: 4,
    title: 'Retrato profesional',
    imageUrl: '/Gflores/logo2.png',
  },
  {
    id: 5,
    title: 'Ambiente y branding',
    imageUrl: 'admus.jpeg',
  },
];

export default function NuestroTrabajoFoto() {
  const [currentImage, setCurrentImage] = useState(imageList[0]);

  return (
    <section className="bg-muted/20 py-24 border-y border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-black mb-16 text-center text-brand font-orbitron uppercase tracking-tighter" style={{ textShadow: '0 0 15px rgba(217, 26, 26, 0.3)' }}>
          NUESTRO TRABAJO FOTOGRÁFICO
        </h2>

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          {/* Miniaturas */}
          <div className="w-full md:w-1/3 grid grid-cols-3 gap-5">
            {imageList.map((image) => (
              <button
                key={image.id}
                onClick={() => setCurrentImage(image)}
                className={`focus:outline-none rounded-none overflow-hidden border-4 transition-all duration-300 ${currentImage.id === image.id
                    ? 'border-brand scale-105 shadow-2xl'
                    : 'border-transparent hover:border-brand/50 hover:scale-105'
                  }`}
                style={{ aspectRatio: '1 / 1' }}
                aria-label={`Ver imagen: ${image.title}`}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* Imagen destacada */}
          <div className="w-full md:w-2/3 flex flex-col items-center">
            <div className="relative w-full rounded-none overflow-hidden shadow-2xl border border-border">
              <img
                src={currentImage.imageUrl}
                alt={currentImage.title}
                className="w-full max-h-[600px] object-contain bg-background"
              />
            </div>
            <h3 className="mt-8 text-3xl font-black text-foreground font-orbitron uppercase tracking-widest">{currentImage.title}</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
