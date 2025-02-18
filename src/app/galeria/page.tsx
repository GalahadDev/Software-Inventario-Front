'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Download, X } from 'lucide-react';
import { usePedidosContext } from '../Context/PedidosContext';
import { Header } from '../ReusableComponents/Header';

export default function ImageGallery() {
  const { pedidos } = usePedidosContext();
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const navigation = [
    { name: "Ver Vendedores", href: "/listaVendedores" },
    { name: "Ver Pedidos", href: "/pedidosGenerales" },
    { name: "Crear Usuario", href: "/crearVendedor" },
    { name: "Crear Pedido", href: "/vendedorAdm" },
    { name: "Usuarios", href: "/listaUsuarios" },
    { name: "Galeria", href: "/galeria" }
  ];

  if (!pedidos || pedidos.length === 0) {
    return <div>Cargando pedidos...</div>;
  }

  // Extraer las URLs de las imágenes directamente del estado
  const workImages = pedidos.flatMap((pedido) => {
    const imagenes = Array.isArray(pedido.Imagen) ? pedido.Imagen : [pedido.Imagen];
    return imagenes.map((imagen, index) => ({
      id: pedido.ID + index,
      url: imagen.startsWith("http")
        ? imagen
        : `https://wduloqcugbdlwmladawq.supabase.co/storage/v1/object/public/imagenes-pedidos/pedidos/${imagen}`,
      title: `Imagen ${pedido.ID}`,
      category: 'Sin categoría',
      description: pedido.Descripcion || 'Sin descripción',
    }));
  });

  if (workImages.length === 0) {
    return <div className="text-center text-gray-600 dark:text-gray-400">No hay imágenes para mostrar.</div>;
  }

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
                src={decodeURIComponent(image.url)}
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

      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{selectedImage.title}</h2>
              <div className="relative w-full aspect-square mb-3">
                <Image
                  src={decodeURIComponent(selectedImage.url)}
                  alt={selectedImage.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">{selectedImage.description}</p>
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition"
                >
                  Cerrar
                </button>
                <a
                  href={decodeURIComponent(selectedImage.url)}
                  download
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md flex items-center gap-1.5 hover:bg-blue-600 transition"
                >
                  <Download className="w-4 h-4" /> Descargar Imagen
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    </div>  
  );
}

