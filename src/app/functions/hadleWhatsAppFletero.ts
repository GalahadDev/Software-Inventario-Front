import { Pedido } from "app/types";


export const handleSendToWhatsAppFletero = (pedido: Pedido) => {
    const observaciones = pedido.Observaciones || "Sin observaciones";
    const tela = pedido.Tela || "Sin tipo de tela especificado";
    const color = pedido.Color || "Sin color especificado";
    const imagen = pedido.Imagen || "Sin imagen";
    const direccion = pedido.Direccion || "Sin Direccion";
    const fechaEntrega = pedido.Fecha_Entrega
    const fechaCreacion = pedido.FechaCreacion
    const telefono = pedido.Nro_Tlf
    const vendedor = pedido.Nombre_Vendedor 
    const mensaje = `
      Nro de Pedido: ${pedido.ID}
      Descripción: ${pedido.Descripcion}
      Observaciones: ${observaciones}
      Tipo de Tela: ${tela}
      Color: ${color}
      Direccion: ${direccion}
      Fecha de Entrega: ${fechaEntrega}
      Fecha Creacion: ${fechaCreacion}
      Telefono: ${telefono}
      Vendedor: ${vendedor}
      Imagen: ${imagen}
      Grupo de WhatsApp: https://chat.whatsapp.com/Dxiz1ImYMJaCg9ibEN58ay
    `;

    const mensajeCodificado = encodeURIComponent(mensaje);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `whatsapp://send?text=${mensajeCodificado}`
      : `https://api.whatsapp.com/send?text=${mensajeCodificado}`;

    window.open(url, "_blank");
  };