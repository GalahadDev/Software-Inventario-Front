"use client"
import React, { useEffect, useState } from 'react';
import { BankData } from 'app/ReusableComponents/BankData';
import { Header } from 'app/ReusableComponents/Header';
import { getCurrentUser } from 'app/functions/getUserBankInfo';
import { MostrarInfoBank } from '../ReusableComponents/MostarInfoBank';

function Page() {
  const navigation = [
    { name: "Ver Pedidos", href: "/vistapedidosvendedor" },
    { name: "Informacion Bancaria", href: "/bankData" }
  ];

  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState<any>(null);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);

  // useEffect para obtener los datos del usuario cuando el componente se monte
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser("/users/me"); // Llamar a la función para obtener los datos
        setUserData(data); // Actualizar el estado con los datos del usuario
      } catch (error) {
        setError("Error al obtener los datos del usuario"); // Manejar errores
        console.error(error);
      } finally {
        setLoading(false); // Finalizar el estado de carga
      }
    };

    fetchUserData(); // Llamar a la función
  }, []); // El arreglo vacío asegura que el efecto se ejecute solo una vez

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Mostrar un mensaje de error si algo falla
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Header navigation={navigation} />
      {/* Agregamos padding-top para compensar la altura del header y aseguramos que el contenido esté por debajo */}
      <div className="flex flex-col items-center gap-0 pt-20">
        <BankData />
        <MostrarInfoBank bankInfo={userData} />
      </div>
    </div>
  );
}

export default Page;
