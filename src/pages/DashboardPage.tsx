import React, { useState } from 'react';
import HeaderBar from '../components/HeaderBar';
import { useDashboardData, type SucursalData, type ProductoData } from '../hooks/useDashboardData';
import { supabase } from '../lib/supabase';
import type { NivelDrillDown } from '../types';

const DashboardPage: React.FC = () => {
  const [nivelActual, setNivelActual] = useState<NivelDrillDown['nivel']>('empresa');
  const [datosSeleccionados, setDatosSeleccionados] = useState<any>(null);
  const [sucursalDetalle, setSucursalDetalle] = useState<SucursalData | null>(null);
  const [productoDetalle, setProductoDetalle] = useState<ProductoData | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { empresas, loading, error, fetchSucursalDetalle, fetchProductoDetalle } = useDashboardData();

  // Obtener información del usuario autenticado
  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const getIndicadorEstado = (ventas: number, meta: number) => {
    const porcentaje = (ventas / meta) * 100;
    if (porcentaje >= 100) return { estado: 'verde', color: 'bg-green-500' };
    if (porcentaje >= 80) return { estado: 'amarillo', color: 'bg-yellow-500' };
    return { estado: 'rojo', color: 'bg-red-500' };
  };

  // Función para obtener meta fija por empresa
  const getMetaEmpresa = (nombreEmpresa: string) => {
    const metas = {
      'TechCorp Solutions': 100000,
      'RetailMax': 80000,
      'FashionStyle': 60000
    };
    return metas[nombreEmpresa as keyof typeof metas] || 50000;
  };

  // Función para obtener meta fija por sucursal
  const getMetaSucursal = (nombreSucursal: string) => {
    const metas = {
      // TechCorp Solutions
      'Sede Central': 50000,
      'Sucursal Córdoba': 30000,
      'Sucursal Rosario': 20000,
      // RetailMax
      'Tienda Principal': 60000,
      'Shopping Norte': 25000,
      'Centro Comercial': 15000,
      // FashionStyle
      'Boutique Principal': 30000,
      'Showroom Palermo': 20000,
      'Tienda Córdoba': 10000
    };
    return metas[nombreSucursal as keyof typeof metas] || 20000;
  };

  const handleDrillDown = async (item: any, nivel: NivelDrillDown['nivel']) => {
    setDatosSeleccionados(item);
    setNivelActual(nivel);
    
    if (nivel === 'sucursal') {
      setLoadingDetalle(true);
      try {
        const detalle = await fetchSucursalDetalle(item.id_sucursal);
        setSucursalDetalle(detalle);
      } catch (err) {
        console.error('Error al cargar sucursal:', err);
      } finally {
        setLoadingDetalle(false);
      }
    } else if (nivel === 'producto') {
      setLoadingDetalle(true);
      try {
        const detalle = await fetchProductoDetalle(item.id_producto, datosSeleccionados?.id_sucursal);
        setProductoDetalle(detalle);
      } catch (err) {
        console.error('Error al cargar producto:', err);
      } finally {
        setLoadingDetalle(false);
      }
    }
  };

  const handleDrillUp = () => {
    if (nivelActual === 'sucursal') {
      setNivelActual('empresa');
      setDatosSeleccionados(null);
      setSucursalDetalle(null);
    } else if (nivelActual === 'producto') {
      setNivelActual('sucursal');
      setProductoDetalle(null);
    }
  };

  const renderNivelEmpresa = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800">Error al cargar datos</h3>
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {empresas.map((empresa) => {
          const meta = getMetaEmpresa(empresa.nombre); // Meta fija por empresa
          const indicador = getIndicadorEstado(empresa.total_ventas, meta);
          
          return (
            <div key={empresa.id_empresa} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{empresa.nombre}</h2>
              
              {/* Indicador visual */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-700">Ventas Totales</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    ${empresa.total_ventas.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Meta: ${meta.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Sucursales: {empresa.total_sucursales}</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progreso hacia la meta</span>
                      <span>{Math.round((empresa.total_ventas / meta) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          indicador.estado === 'verde' ? 'bg-green-500' :
                          indicador.estado === 'amarillo' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((empresa.total_ventas / meta) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-6">
                  <div className={`w-4 h-4 rounded-full ${indicador.color}`}></div>
                  <span className="text-sm font-medium capitalize">{indicador.estado}</span>
                </div>
              </div>

              {/* Lista de sucursales */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Sucursales</h3>
                <div className="grid gap-4">
                  {empresa.sucursales.map((sucursal) => {
                    const metaSucursal = getMetaSucursal(sucursal.nombre); // Meta fija por sucursal
                    const indicadorSucursal = getIndicadorEstado(sucursal.total_ventas, metaSucursal);
                    return (
                      <div
                        key={sucursal.id_sucursal}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleDrillDown(sucursal, 'sucursal')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{sucursal.nombre}</h4>
                            <p className="text-sm text-gray-500">{sucursal.ubicacion}</p>
                            <div className="mt-2">
                              <p className="text-lg font-semibold text-gray-700">
                                ${sucursal.total_ventas.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Meta: ${metaSucursal.toLocaleString()}
                              </p>
                              <div className="mt-1">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Progreso</span>
                                  <span>{Math.round((sucursal.total_ventas / metaSucursal) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      indicadorSucursal.estado === 'verde' ? 'bg-green-500' :
                                      indicadorSucursal.estado === 'amarillo' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${Math.min((sucursal.total_ventas / metaSucursal) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <div className={`w-3 h-3 rounded-full ${indicadorSucursal.color}`}></div>
                            <span className="text-sm text-gray-500">Ver detalles →</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderNivelSucursal = () => {
    if (loadingDetalle) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    const sucursal = sucursalDetalle || datosSeleccionados;
    if (!sucursal) return null;

    const meta = getMetaSucursal(sucursal.nombre); // Meta fija por sucursal
    const indicador = getIndicadorEstado(sucursal.total_ventas, meta);
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Vista Sucursal: {sucursal.nombre}</h2>
            <button
              onClick={handleDrillUp}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              ← Volver a Empresa
            </button>
          </div>
          
          {/* Indicador visual */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">Ventas de la Sucursal</h3>
              <p className="text-3xl font-bold text-gray-900">
                ${sucursal.total_ventas.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Meta: ${meta.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Ubicación: {sucursal.ubicacion}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso hacia la meta</span>
                  <span>{Math.round((sucursal.total_ventas / meta) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      indicador.estado === 'verde' ? 'bg-green-500' :
                      indicador.estado === 'amarillo' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((sucursal.total_ventas / meta) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-6">
              <div className={`w-4 h-4 rounded-full ${indicador.color}`}></div>
              <span className="text-sm font-medium capitalize">{indicador.estado}</span>
            </div>
          </div>

          {/* Lista de productos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Productos</h3>
            <div className="grid gap-4">
              {sucursal.productos?.map((producto: any) => {
                const metaProducto = 5000; // Meta fija para productos
                const indicadorProducto = getIndicadorEstado(producto.total_ventas, metaProducto);
                return (
                  <div
                    key={producto.id_producto}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleDrillDown(producto, 'producto')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{producto.nombre}</h4>
                        <p className="text-sm text-gray-500">{producto.categoria}</p>
                        <div className="mt-2">
                          <p className="text-lg font-semibold text-gray-700">
                            ${producto.total_ventas.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Meta: ${metaProducto.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Cantidad vendida: {producto.cantidad_vendida}
                          </p>
                          <div className="mt-1">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Progreso</span>
                              <span>{Math.round((producto.total_ventas / metaProducto) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  indicadorProducto.estado === 'verde' ? 'bg-green-500' :
                                  indicadorProducto.estado === 'amarillo' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min((producto.total_ventas / metaProducto) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <div className={`w-3 h-3 rounded-full ${indicadorProducto.color}`}></div>
                        <span className="text-sm text-gray-500">Ver detalles →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNivelProducto = () => {
    if (loadingDetalle) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    const producto = productoDetalle || datosSeleccionados;
    if (!producto) return null;

    const meta = 5000; // Meta fija para productos
    const indicador = getIndicadorEstado(producto.total_ventas, meta);
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Vista Producto: {producto.nombre}</h2>
            <button
              onClick={handleDrillUp}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              ← Volver a Sucursal
            </button>
          </div>
          
          {/* Indicador visual */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">Ventas del Producto</h3>
              <p className="text-3xl font-bold text-gray-900">
                ${producto.total_ventas.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Meta: ${meta.toLocaleString()}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso hacia la meta</span>
                  <span>{Math.round((producto.total_ventas / meta) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      indicador.estado === 'verde' ? 'bg-green-500' :
                      indicador.estado === 'amarillo' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((producto.total_ventas / meta) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-6">
              <div className={`w-4 h-4 rounded-full ${indicador.color}`}></div>
              <span className="text-sm font-medium capitalize">{indicador.estado}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Información del Producto</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Nombre:</span> {producto.nombre}</p>
                <p><span className="font-medium">Categoría:</span> {producto.categoria}</p>
                <p><span className="font-medium">Precio Unitario:</span> ${producto.precio.toLocaleString()}</p>
                <p><span className="font-medium">Cantidad Vendida:</span> {producto.cantidad_vendida}</p>
                <p><span className="font-medium">Total Ventas:</span> ${producto.total_ventas.toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Estadísticas</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Promedio por Venta:</span> ${(producto.total_ventas / producto.cantidad_vendida).toFixed(2)}</p>
                <p><span className="font-medium">Rendimiento:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    indicador.estado === 'verde' ? 'bg-green-100 text-green-800' :
                    indicador.estado === 'amarillo' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {indicador.estado === 'verde' ? 'Excelente' :
                     indicador.estado === 'amarillo' ? 'Bueno' : 'Necesita Mejora'}
                  </span>
                </p>
                <p><span className="font-medium">Estado:</span> <span className="text-green-600">Activo</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar 
        title="Dashboard de Ventas y Sucursales" 
        user={user ? { 
          nombre: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario', 
          email: user.email || 'usuario@ejemplo.com' 
        } : undefined}
        onLogout={async () => {
          await supabase.auth.signOut();
        }}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {nivelActual === 'empresa' && renderNivelEmpresa()}
        {nivelActual === 'sucursal' && renderNivelSucursal()}
        {nivelActual === 'producto' && renderNivelProducto()}
      </main>
    </div>
  );
};

export default DashboardPage;
