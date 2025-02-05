export interface Pedido {
    ID: number;               
    Nombre: string;          
    Descripcion: string;      
    Precio: number;           
    Observaciones: string;    
    Forma_Pago: string;       
    Direccion: string;        
    Imagen: string | null
    Monto: number | null
    Fletero:string;
    Estado: string 
    FechaCreacion: Date
    atendido: boolean
  }

  
 export type stadosModal = {
  monto:number | null
 }
 export type UserType = {
  email: string,
  contrasena: string;
}
export type formData = {
    Nombre:string,
    Email:string,
    Contrasena:string,
    Rol:string
}
export type Vendedor = {
  ID: string;  
  Nombre: string;
};
export type ModalProps = {
  pedido: Pedido; // Se pasa el pedido completo
  onClose: () => void;
  onSave: (id: number, monto: number, fletero: string, estado: string, Atendido: boolean) => void;
  loading: boolean;
};
export type Usuario = {
  Nombre: string;
  Email: string;
  Contrasena: string;
  Rol: string;
};
export type SaleForm = {
  nombre: string;
  descripcion: string;
  precio: number;
  observaciones: string;
  forma_pago: string;
  direccion: string;
  imagen: File | null; // Cambiado para aceptar un archivo
  usuario_id: string | null;
};
export type StatusColor = {
  [key in 'pendiente' | 'en proceso' | 'completado' | 'cancelado']: string;
};
export interface PageProps<T> {
  params: T;
  searchParams?: any;
}