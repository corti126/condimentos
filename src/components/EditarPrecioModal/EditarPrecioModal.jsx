import React, { useState, useEffect } from 'react';
import './EditarPrecioModal.css';

const EditarPrecioModal = ({ isOpen, onClose, onConfirm, producto }) => {
  const [nuevoPrecio, setNuevoPrecio] = useState('');

  // Sincronizar el estado local cuando cambia el producto seleccionado
  useEffect(() => {
    if (producto) {
      setNuevoPrecio(producto.precioKilo);
    }
  }, [producto]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoPrecio !== "" && !isNaN(nuevoPrecio)) {
      onConfirm(producto.id, producto.nombre, Number(nuevoPrecio));
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal">
        <h3>Actualizar Precio</h3>
        <p className="modal-subtitle">
          Modificando precio para: <strong>{producto?.nombre}</strong>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Precio por Kg ($)</label>
            <input 
              type="number" 
              step="0.01"
              value={nuevoPrecio}
              onChange={(e) => setNuevoPrecio(e.target.value)}
              autoFocus
              placeholder="Ej: 1500"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-confirm-edit">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPrecioModal;