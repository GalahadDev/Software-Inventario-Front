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
    Atendido: boolean
    UsuarioID: string
    nro_tlf: string,
    Pagado: string,
    Nombre_Vendedor: string,
    tela:String,
    color:string,
    sub_Vendedor:string

  }

  
 export type stadosModal = {
  monto:number | null
 }
 export type UserType = {
  email: string,
  contrasena: string;
  nombre: string;
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
  pagado: string;
};
export type Usuario = {
  Nombre: string;
  Email?: string;
  Contrasena?: string;
  Rol: string;
};
export type SaleForm = {
  nombre: string;
  descripcion: string;
  precio: number | null;
  observaciones: string;
  forma_pago: string;
  direccion: string;
  imagen: File | null; // Cambiado para aceptar un archivo
  usuario_id: string | null;
  nro_tlf: string,
  pagado: string;
  tela:string,
  color:string,
  subVendedor:string
};
export type StatusColor = {
  [key in 'pendiente' | 'en proceso' | 'completado' | 'cancelado']: string;
};
export interface PageProps<T> {
  params: T;
  searchParams?: any;
}

export interface User {
  ID: string;
  Nombre: string;
  email?: string;
  usuario?: string;
  Rol: string;
  Contrasena: string;
  Cedula:string;
  Numero_Cuenta:string;
  Tipo_Cuenta:string;
  Nombre_Banco:string;

}
