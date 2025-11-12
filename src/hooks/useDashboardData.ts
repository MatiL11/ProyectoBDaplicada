import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface EmpresaData {
  id_empresa: number;
  nombre: string;
  total_ventas: number;
  total_sucursales: number;
  sucursales: SucursalData[];
}

export interface SucursalData {
  id_sucursal: number;
  nombre: string;
  ubicacion: string;
  total_ventas: number;
  productos: ProductoData[];
}

export interface ProductoData {
  id_producto: number;
  nombre: string;
  categoria: string;
  precio: number;
  total_ventas: number;
  cantidad_vendida: number;
}

export const useDashboardData = () => {
  const [empresas, setEmpresas] = useState<EmpresaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener todas las empresas
      const { data: empresasData, error: empresasError } = await supabase
        .from('empresas')
        .select('*');

      if (empresasError) throw empresasError;

      // Para cada empresa, obtener sus sucursales y calcular estadísticas
      const empresasConSucursales = await Promise.all(
        (empresasData || []).map(async (empresa) => {
          // Obtener sucursales de la empresa
          const { data: sucursalesData, error: sucursalesError } = await supabase
            .from('sucursales')
            .select('*')
            .eq('id_empresa', empresa.id_empresa);

          if (sucursalesError) throw sucursalesError;

          // Para cada sucursal, calcular ventas totales
          const sucursalesConVentas = await Promise.all(
            (sucursalesData || []).map(async (sucursal) => {
          const { data: ventasData, error: ventasError } = await supabase
            .from('ventas')
            .select(`
              id_producto,
              cantidad,
              productos (
                precio
              )
            `)
            .eq('id_sucursal', sucursal.id_sucursal);

              if (ventasError) throw ventasError;

              const totalVentas = ventasData?.reduce((sum, venta: any) => {
                const precio = venta.productos?.precio ?? 0;
                const cantidad = venta.cantidad ?? 0;
                return sum + cantidad * precio;
              }, 0) || 0;

              return {
                ...sucursal,
                total_ventas: totalVentas,
                productos: [] // Se cargarán cuando se haga drill down
              };
            })
          );

          const totalVentasEmpresa = sucursalesConVentas.reduce((sum, sucursal) => sum + sucursal.total_ventas, 0);

          return {
            ...empresa,
            total_ventas: totalVentasEmpresa,
            total_sucursales: sucursalesConVentas.length,
            sucursales: sucursalesConVentas
          };
        })
      );

      setEmpresas(empresasConSucursales);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchSucursalDetalle = async (idSucursal: number) => {
    try {
      // Obtener información de la sucursal
      const { data: sucursalData, error: sucursalError } = await supabase
        .from('sucursales')
        .select(`
          *,
          empresas (
            id_empresa,
            nombre
          )
        `)
        .eq('id_sucursal', idSucursal)
        .single();

      if (sucursalError) throw sucursalError;

      // Obtener ventas de esta sucursal
      const { data: ventasData, error: ventasError } = await supabase
        .from('ventas')
        .select(`
          id_producto,
          cantidad,
          productos (
            id_producto,
            nombre,
            categoria,
            precio
          )
        `)
        .eq('id_sucursal', idSucursal);

      if (ventasError) throw ventasError;

      // Calcular total de ventas de la sucursal
      const totalVentas = ventasData?.reduce((sum, venta: any) => {
        const cantidad = venta.cantidad ?? 0;
        const precio = venta.productos?.precio ?? 0;
        return sum + cantidad * precio;
      }, 0) || 0;

      // Agrupar productos y calcular totales
      const productosAgrupados = ventasData?.reduce((acc: any, venta: any) => {
        const producto = venta.productos;
        if (!acc[producto.id_producto]) {
          acc[producto.id_producto] = {
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: producto.precio,
            total_ventas: 0,
            cantidad_vendida: 0
          };
        }
        const cantidad = venta.cantidad ?? 0;
        const totalCalculado = cantidad * (producto.precio ?? 0);
        acc[producto.id_producto].total_ventas += totalCalculado;
        acc[producto.id_producto].cantidad_vendida += cantidad;
        return acc;
      }, {});

      return {
        ...sucursalData,
        total_ventas: totalVentas,
        productos: Object.values(productosAgrupados || {})
      };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al cargar sucursal');
    }
  };

  const fetchProductoDetalle = async (idProducto: number, idSucursal?: number) => {
    try {
      // Obtener información del producto
      const { data: productoData, error: productoError } = await supabase
        .from('productos')
        .select('*')
        .eq('id_producto', idProducto)
        .single();

      if (productoError) throw productoError;

      // Obtener ventas del producto
      let query = supabase
        .from('ventas')
        .select(`
          *,
          sucursales (
            id_sucursal,
            nombre,
            ubicacion
          )
        `)
        .eq('id_producto', idProducto);

      if (idSucursal) {
        query = query.eq('id_sucursal', idSucursal);
      }

      const { data: ventasData, error: ventasError } = await query;

      if (ventasError) throw ventasError;

      if (!ventasData || ventasData.length === 0) {
        return {
          ...productoData,
          total_ventas: 0,
          cantidad_vendida: 0,
          ventas: []
        };
      }

      const cantidadVendida = ventasData.reduce((sum, venta) => sum + (venta.cantidad ?? 0), 0);
      const totalVentas = cantidadVendida * (productoData?.precio ?? 0);

      return {
        ...productoData,
        total_ventas: totalVentas,
        cantidad_vendida: cantidadVendida,
        ventas: ventasData
      };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al cargar producto');
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  return {
    empresas,
    loading,
    error,
    fetchSucursalDetalle,
    fetchProductoDetalle,
    refetch: fetchEmpresas
  };
};
