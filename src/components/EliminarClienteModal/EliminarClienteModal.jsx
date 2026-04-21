import React from 'react';
import './EliminarClienteModal.css';

const EliminarClienteModal = ({ isOpen, onClose, onConfirm, nombreCliente }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal delete-modal">
        <span className="delete-icon">⚠️</span>
        <h3>¿Eliminar Cliente?</h3>
        <p>
          Estás a punto de eliminar a <strong>{nombreCliente}</strong>.<br />
          Esta acción no se puede deshacer.
        </p>
        
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-confirm-delete" onClick={onConfirm}>
            Eliminar permanentemente
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarClienteModal;