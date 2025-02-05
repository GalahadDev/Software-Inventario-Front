import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyComponent = () => {
  const notify = () => {
    toast.info("Nuevo Pedido!");
    // También puedes usar toast.error(), toast.info(), toast.warning() según el tipo de mensaje
  };

  return (
    <div>
      <button onClick={notify}>Mostrar notificación</button>
      <ToastContainer />
    </div>
  );
};

export default MyComponent;