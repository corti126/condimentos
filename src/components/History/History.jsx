import React, { useEffect, useState } from 'react';
import { getRemitosHistory } from '../../services/productService';
import DetalleRemitoModal from '../DetalleRemitoModal/DetalleRemitoModal';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRemito, setSelectedRemito] = useState(null); // Para el modal

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getRemitosHistory();
      setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const openModal = (remito) => setSelectedRemito(remito);
  const closeModal = () => setSelectedRemito(null);

  if (loading) return <div className="history-loader">Cargando historial...</div>;

  return (
    <div className="history-container">
      <div className="history-card">
        <h2>Historial de Remitos</h2>
        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>FECHA</th>
                <th>CLIENTE</th>
                <th>TOTAL</th>
                <th className="text-center">PRODUCTOS</th>
                <th className="text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.id}>
                  <td>{r.fechaFormateada || r.fechaManual}</td>
                  <td className="client-name">{r.clienteNombre}</td>
                  <td className="total-cell">${r.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                  <td className="text-center">
                    <span className="product-badge">
                      {r.items.length} {r.items.length === 1 ? 'ítem' : 'ítems'}
                    </span>
                  </td>
                  <td className="text-center">
                    <button className="btn-view-details" onClick={() => openModal(r)} title="Ver detalles">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRemito && (
        <DetalleRemitoModal
          remito={selectedRemito}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default History;