import React, { useState } from 'react';
import './EliminarCondimentoModal.css';

const EliminarCondimentoModal = ({ isOpen, onClose, onConfirm, nombreProducto }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <div className="delete-icon">⚠️</div>
        <h3>¿Eliminar condimento?</h3>
        <p>
          Estás por eliminar <strong>{nombreProducto}</strong>. 
          Esta acción no se puede deshacer.
        </p>
        
        <div className="modal-actions">
          <button 
            className="btn-cancel" 
            onClick={onClose} 
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            className="btn-confirm-delete" 
            onClick={handleConfirm} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarCondimentoModal;