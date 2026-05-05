import React from 'react';
import './DetalleRemitoModal.css';

const DetalleRemitoModal = ({ remito, onClose }) => {
  if (!remito) return null;

  const formatCurrency = (num) => {
    return num.toLocaleString('es-AR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title">
            <h3>Detalle del Remito</h3>
          </div>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="modal-info-grid">
            <div className="info-item">
              <label>CLIENTE</label>
              <p>{remito.clienteNombre}</p>
            </div>
            <div className="info-item">
              <label>FECHA</label>
              <p>{remito.fechaFormateada || remito.fechaManual}</p>
            </div>
          </div>

          <div className="items-section">
            <label className="section-label">PRODUCTOS DETALLADOS</label>
            <div className="modal-table-wrapper">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th className="text-right">Kilos</th>
                  </tr>
                </thead>
                <tbody>
                  {remito.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.nombre}</td>
                      <td className="text-right weight-text">{item.cantidad}kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="total-container">
            <span className="total-label">TOTAL FACTURADO</span>
            <span className="total-amount">${formatCurrency(remito.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleRemitoModal;