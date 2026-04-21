import React, { useEffect, useState } from 'react';
import { getRemitosHistory } from '../../services/productService';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getRemitosHistory();
      setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) return <p>Cargando historial...</p>;

  return (
    <div className="product-list-container">
      <h2>Historial de Remitos</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Productos</th>
          </tr>
        </thead>
        <tbody>
          {history.map((r) => (
            <tr key={r.id}>
              <td>{r.fechaFormateada}</td>
              <td>{r.clienteNombre}</td>
              <td>${r.total.toLocaleString()}</td>
              <td>
                {r.items.map(item => `${item.nombre} (${item.cantidad}kg)`).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;