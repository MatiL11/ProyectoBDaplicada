// Tipos para la base de datos
export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  contraseña_encriptada: string;
}

export interface Empresa {
  id_empresa: number;
  nombre: string;
}

export interface Sucursal {
  id_sucursal: number;
  id_empresa: number;
  nombre: string;
  ubicacion: string;
}

export interface Producto {
  id_producto: number;
  nombre: string;
  categoria: string;
  precio: number;
}

export interface Venta {
  id_venta: number;
  id_sucursal: number;
  id_producto: number;
  fecha: string;
  cantidad: number;
  total: number;
}

// Tipos para el dashboard
export interface IndicadorEstado {
  estado: 'verde' | 'amarillo' | 'rojo';
  valor: number;
  meta: number;
  descripcion: string;
}

export interface NivelDrillDown {
  nivel: 'empresa' | 'sucursal' | 'producto';
  id: number;
  nombre: string;
  datos: any;
}
