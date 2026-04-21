import React, { useState, useEffect } from 'react';
import { updateCustomer } from '../../services/productService';
import toast from 'react-hot-toast';
import './EditarClienteModal.css';

const EditarClienteModal = ({ isOpen, onClose, onCustomerUpdated, cliente }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(false);

  // Sincronizar los campos con el cliente seleccionado
  useEffect(() => {
    if (cliente) {
      setNombre(cliente.nombre || '');
      setDireccion(cliente.direccion || '');
    }
  }, [cliente]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !direccion.trim()) {
      toast.error("Los campos no pueden estar vacíos");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Actualizando cliente...");

    try {
      await updateCustomer(cliente.id, { nombre, direccion });
      toast.dismiss(loadingToast);
      toast.success("Cliente actualizado con éxito");
      onCustomerUpdated(); 
      onClose();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error al actualizar cliente");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal">
        <button className="modal-close-x" onClick={onClose}>&times;</button>
        
        <form className="customer-form" onSubmit={handleSubmit}>
          <h3>Editar Cliente</h3>
          <p className="modal-subtitle">Modificando los datos de la cuenta</p>
          
          <div className="form-group">
            <label>Nombre / Razón Social</label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del cliente"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input 
              type="text" 
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección del cliente"
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-cancel-edit" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-confirm-update" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarClienteModal;