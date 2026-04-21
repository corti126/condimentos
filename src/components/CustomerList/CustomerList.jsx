import React, { useEffect, useState } from 'react';
import { getCustomers, deleteCustomer, addCustomer } from '../../services/productService';
import './CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newNombre, setNewNombre] = useState('');
  const [newDireccion, setNewDireccion] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error al buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNombre || !newDireccion) {
      alert("Por favor completa todos los campos");
      return;
    }
    await addCustomer(newNombre, newDireccion);
    setNewNombre('');
    setNewDireccion('');
    setIsModalOpen(false);
    fetchCustomers();
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      await deleteCustomer(id);
      fetchCustomers();
    }
  };

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h2>Administración de Clientes</h2>
        <button className="btn-add-main" onClick={() => setIsModalOpen(true)}>
          + Nuevo Cliente
        </button>
      </div>

      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nombre / Razón Social</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.direccion}</td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDelete(c.id, c.nombre)}>
                      Eliminar
                    </button>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-x" onClick={() => setIsModalOpen(false)}>×</button>
            <form onSubmit={handleSubmit} className="product-form">
              <h3>Datos del Cliente</h3>
              <input 
                type="text" 
                placeholder="Nombre (ej: Ichiban)" 
                value={newNombre}
                onChange={(e) => setNewNombre(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Dirección (ej: Donado 2000)" 
                value={newDireccion}
                onChange={(e) => setNewDireccion(e.target.value)}
              />
              <button type="submit">Guardar Cliente</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;