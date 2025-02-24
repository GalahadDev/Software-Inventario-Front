"use client"
import React, { useEffect, useState } from 'react';
import { BankData } from 'app/ReusableComponents/BankData';
import { Header } from 'app/ReusableComponents/Header';
import { getCurrentUser } from 'app/functions/getUserBankInfo';
import { MostrarInfoBank } from 'app/ReusableComponents/MostarInfoBank';
import { SuccessModal } from 'app/ReusableComponents/Exito';

function Page() {
  const navigation = [
    { name: "Ver Pedidos", href: "/vistapedidosvendedor" },
    { name: "Informacion Bancaria", href: "/bankData" },
  ];

  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState<any>(null);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);

  // Estado para manejar la visibilidad del modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  }, []);

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Mostrar un mensaje de error si algo falla
  if (error) {
    return <div>{error}</div>;
  }

  // Función que se llamará cuando la actualización bancaria sea exitosa
  const handleSuccess = () => {
    setShowSuccessModal(true);
  };

  return (
    <div>
      <Header navigation={navigation} />
      <div className="flex flex-col items-center gap-0 pt-20">
        {/* 
          Pasamos la función handleSuccess como prop al componente BankData.
          Cuando se actualice correctamente la información bancaria,
          BankData llamará a esta función.
        */}
        <BankData onSuccess={handleSuccess} />

        <MostrarInfoBank bankInfo={userData} />

        {/* Modal de Éxito controlado por el estado showSuccessModal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message="¡Información bancaria actualizada exitosamente!"
        />
      </div>
    </div>
  );
}

export default Page;
