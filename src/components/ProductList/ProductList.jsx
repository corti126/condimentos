import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct, updateProductPrice } from '../../services/productService';
import AgregarCondimentoModal from '../AgregarCondimentoModal/AgregarCondimentoModal';
import EliminarCondimentoModal from '../EliminarCondimentoModal/EliminarCondimentoModal';
import EditarPrecioModal from '../EditarPrecioModal/EditarPrecioModal';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al conectar con la base de datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para abrir el modal de edición
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Función que procesa la actualización desde el modal
  const confirmPriceUpdate = async (id, nombre, nuevoPrecio) => {
    const loadingToast = toast.loading("Actualizando precio...");
    try {
      await updateProductPrice(id, nuevoPrecio);
      toast.dismiss(loadingToast);
      toast.success(`Precio de ${nombre} actualizado`);
      fetchProducts();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error al actualizar");
    }
  };

  // Abrir modal de eliminación
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const loadingToast = toast.loading("Eliminando...");
    try {
      await deleteProduct(selectedProduct.id);
      toast.dismiss(loadingToast);
      toast.success(`${selectedProduct.nombre} eliminado`);
      fetchProducts();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("No se pudo eliminar");
      throw error;
    }
  };

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h2>Lista de precios</h2>
        <button className="btn-add-main" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} strokeWidth={2.5} /> 
          Agregar Condimento
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Cargando especias...</div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th className="col-nombre">Nombre</th>
              <th className="col-precio">Precio por Kg</th>
              <th className="col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id}>
                  <td className="name-cell">{p.nombre}</td>
                  <td className="price-cell">${p.precioKilo.toLocaleString('es-AR')}</td>
                  <td className="actions-cell">
                    <div className="actions-wrapper">
                      <button 
                        className="btn-edit" 
                        onClick={() => openEditModal(p)}
                      >
                        Editar Precio
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => openDeleteModal(p)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>No hay condimentos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* MODAL AGREGAR */}
      <AgregarCondimentoModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onProductAdded={fetchProducts} 
      />

      {/* MODAL ELIMINAR */}
      <EliminarCondimentoModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        nombreProducto={selectedProduct?.nombre}
      />

      {/* MODAL EDITAR PRECIO */}
      <EditarPrecioModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        producto={selectedProduct}
        onConfirm={confirmPriceUpdate}
      />
    </div>
  );
};

export default ProductList;