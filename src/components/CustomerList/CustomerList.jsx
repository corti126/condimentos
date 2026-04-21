import React, { useEffect, useState } from 'react';
import { getCustomers, deleteCustomer } from '../../services/productService';
import AgregarClienteModal from '../AgregarClienteModal/AgregarClienteModal';
import EditarClienteModal from '../EditarClienteModal/EditarClienteModal';
import EliminarClienteModal from '../EliminarClienteModal/EliminarClienteModal';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import './CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error al buscar clientes:", error);
      toast.error("Error al cargar la lista de clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Lógica para Editar
  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  // Lógica para Eliminar
  const handleOpenDelete = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const loadingToast = toast.loading("Eliminando cliente...");
    try {
      await deleteCustomer(selectedCustomer.id);
      toast.dismiss(loadingToast);
      toast.success("Cliente eliminado correctamente");
      setIsDeleteModalOpen(false);
      fetchCustomers();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("No se pudo eliminar el cliente");
    }
  };

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h2>Administración de Clientes</h2>
        <button className="btn-add-main" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} strokeWidth={2.5} /> 
          Nuevo Cliente
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Cargando base de clientes...</div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th className="col-nombre">Nombre / Razón Social</th>
              <th className="col-precio">Dirección</th>
              <th className="col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <tr key={c.id}>
                  <td className="name-cell">{c.nombre}</td>
                  <td className="price-cell">{c.direccion}</td>
                  <td className="actions-cell">
                    <div className="actions-wrapper">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleOpenEdit(c)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleOpenDelete(c)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>No hay clientes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* MODAL AGREGAR */}
      <AgregarClienteModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onCustomerAdded={fetchCustomers}
      />

      {/* MODAL EDITAR */}
      <EditarClienteModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        cliente={selectedCustomer}
        onCustomerUpdated={fetchCustomers}
      />

      {/* MODAL ELIMINAR */}
      <EliminarClienteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        nombreCliente={selectedCustomer?.nombre}
      />
    </div>
  );
};

export default CustomerList;