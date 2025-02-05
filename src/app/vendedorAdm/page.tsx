import React from 'react'
import  SalesMan  from "../salesman/page"
import { Header } from "../ReusableComponents/Header"



function vendedorAdm() {

    const navigation = [
        { name: 'Ver Vendedores', href: '/listaVendedores' },
        { name: 'Ver Pedidos', href: '/pedidosGenerales' },
        { name: 'Crear Vendedor', href: '/crearVendedor' },
        { name: "Crear Pedido", href: "/salesman" },
        {name: "Usuarios", href: "/listaUsuarios"}, 
      ];

  return (
    <main>
      <Header navigation={navigation} />
        <section>
            <SalesMan/>
        </section>
    </main>
  )
}

export default vendedorAdm