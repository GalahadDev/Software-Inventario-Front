'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ExternalLink, Tag, Search } from 'lucide-react';
import { usePedidosContext } from '../Context/PedidosContext';
import { Header } from '../ReusableComponents/Header';
interface WorkImage {
  id: number;
  url: string;
  title: string;
  category: string;
  description: string;
}

export default function ImageGallery() {
  const { pedidos } = usePedidosContext();
  const [selectedImage, setSelectedImage] = useState<WorkImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const navigation = [
    { name: "Ver Vendedores", href: "/listaVendedores" },
    { name: "Ver Pedidos", href: "/pedidosGenerales" },
    { name: "Crear Usuario", href: "/crearVendedor" },
    { name: "Crear Pedido", href: "/vendedorAdm" },
    { name: "Usuarios", href: "/listaUsuarios" },
    { name: "Galeria", href: "/galeria" }
  ];

  if (!pedidos) {
    return <div>Cargando pedidos...</div>;
  }

  // Generar workImages con URLs completas
  const workImages: WorkImage[] = pedidos.flatMap((pedido) => {
    if (!pedido || !pedido.Imagen) {
      return [];
    }

    const imagenes: string[] = Array.isArray(pedido.Imagen) ? pedido.Imagen : [pedido.Imagen];

    return imagenes.map((imagen, index) => {
      const urlCompleta = imagen.startsWith("http") 
        ? imagen 
        : `https://wduloqcugbdlwmladawq.supabase.co/storage/v1/object/public/imagenes-pedidos/pedidos/${imagen}`;

      return {
        id: pedido.ID + index,
        url: urlCompleta,
        title: `Imagen ${pedido.ID}`,
        category: 'Sin categoría',
        description: pedido.Descripcion || 'Sin descripción',
      };
    });
  });

  console.log("Imágenes procesadas:", workImages);

  if (workImages.length === 0) {
    return <div className="text-center text-gray-600 dark:text-gray-400">No hay imágenes para mostrar.</div>;
  }

  const categories = Array.from(new Set(workImages.map((img) => img.category)));

  const filteredImages = selectedCategory
    ? workImages.filter((img) => img.category === selectedCategory)
    : workImages;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-40">
      <Header navigation={navigation} />
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          Galería de imágenes
        </h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 shadow-2xl"
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
