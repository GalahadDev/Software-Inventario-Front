'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ExternalLink, Tag, Search } from 'lucide-react';
import { usePedidosContext } from '../Context/PedidosContext';

interface WorkImage {
  id: number;
  url: string;
  title: string;
  category: string;
  description: string;
}

export default function ImageGallery() {
  const { pedidos } = usePedidosContext(); // Acceder al contexto de pedidos
  const [selectedImage, setSelectedImage] = useState<WorkImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Verificar que pedidos esté definido
  if (!pedidos) {
    return <div>Cargando pedidos...</div>;
  }

  // Generar workImages
  const workImages: WorkImage[] = pedidos.flatMap((pedido) => {
    if (!pedido) {
      return [];
    }

    // Convertir Imagen (string | null) en un array
    const imagenes: string[] = pedido.Imagen ? [pedido.Imagen] : [];

    // Mapear las imágenes
    return imagenes.map((imagen, index) => ({
      id: pedido.ID * 1000 + index, // Generar un ID único para cada imagen
      url: imagen, // Usar el string directamente como URL
      title: `Imagen `, // Usar un título genérico
      category: 'Sin categoría', // Usar una categoría genérica
      description: 'Sin descripción', // Usar una descripción genérica
    }));
  });

  // Verificar que workImages tenga datos
  if (workImages.length === 0) {
    return <div className="text-center text-gray-600 dark:text-gray-400">No hay imágenes para mostrar.</div>;
  }

  const categories = Array.from(new Set(workImages.map((img) => img.category)));

  const filteredImages = selectedCategory
    ? workImages.filter((img) => img.category === selectedCategory)
    : workImages;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Galería de imágenes
        </h1>

       
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative h-64 w-full">
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Search className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  {image.category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {image.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {image.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}