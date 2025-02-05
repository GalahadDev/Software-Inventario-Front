
import React from 'react'
import  SalesMan  from "../salesman/page"
import { Header } from "../ReusableComponents/Header"



function DashVendedor() {

const navigation = [  
  { name: "Hacer Pedido", href: "/salesman" },
  { name: "Ver Pedidos", href: "/pedidosGenerales" },
]

  return (
    <main>
      <Header navigation={navigation} />
        <section>
            <SalesMan/>
        </section>
    </main>
  )
}

export default DashVendedor