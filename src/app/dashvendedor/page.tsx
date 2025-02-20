
import React from 'react'
import  SalesMan  from "../salesman/page"
import { Header } from "../ReusableComponents/Header"



function DashVendedor() {

const navigation = [  
  { name: "Ver Pedidos", href: "/vistapedidosvendedor" },
  { name: "Informacion Bancaria", href: "/bankData"}
  
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