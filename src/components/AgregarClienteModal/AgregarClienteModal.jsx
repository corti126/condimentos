import React, { useState } from 'react';
import { addCustomer } from '../../services/productService';
import toast from 'react-hot-toast';
import './AgregarClienteModal.css';

const AgregarClienteModal = ({ isOpen, onClose, onCustomerAdded }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim() || !direccion.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Guardando cliente...");

    try {
      await addCustomer(nombre, direccion);
      toast.dismiss(loadingToast);
      toast.success("Cliente guardado con éxito");
      
      // Limpiar y cerrar
      setNombre('');
      setDireccion('');
      onCustomerAdded(); // Refresca la lista
      onClose();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error al guardar el cliente");
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
          <h3>Nuevo Cliente</h3>
          
          <div className="form-group">
            <label>Nombre / Razón Social</label>
            <input 
              type="text" 
              placeholder="Ej: Ichiban" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input 
              type="text" 
              placeholder="Ej: Donado 2000" 
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-save-customer" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cliente"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgregarClienteModal;