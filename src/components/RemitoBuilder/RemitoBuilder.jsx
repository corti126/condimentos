import React, { useState, useEffect } from 'react';
import { getProducts, getCustomers, saveRemito } from '../../services/productService';
import toast from 'react-hot-toast';
import './RemitoBuilder.css';

const RemitoBuilder = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [itemsRemito, setItemsRemito] = useState([]);
  const [fechaRemito, setFechaRemito] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [p, c] = await Promise.all([getProducts(), getCustomers()]);
        setProducts(p);
        setCustomers(c);
      } catch (error) {
        toast.error("Error al cargar datos");
      }
    };
    loadData();
  }, []);

  const handleAddItem = () => {
    if (!selectedProductId || !cantidad || cantidad <= 0) {
      toast.error("Revisar producto y cantidad");
      return;
    }
    const producto = products.find(p => p.id === selectedProductId);
    const nuevoItem = {
      id: producto.id,
      nombre: producto.nombre,
      precioKilo: producto.precioKilo,
      cantidad: Number(cantidad),
      subtotal: producto.precioKilo * Number(cantidad)
    };
    setItemsRemito([...itemsRemito, nuevoItem]);
    setCantidad('');
    setSelectedProductId('');
  };

  const removeItem = (index) => {
    setItemsRemito(itemsRemito.filter((_, i) => i !== index));
  };

  const totalFinal = itemsRemito.reduce((acc, item) => acc + item.subtotal, 0);

  const formatCurrency = (num) => {
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleProcessRemito = async () => {
    if (!selectedCustomer || itemsRemito.length === 0) {
      toast.error("Completar cliente y productos");
      return;
    }

    const data = {
      clienteNombre: selectedCustomer.nombre,
      clienteDireccion: selectedCustomer.direccion,
      items: itemsRemito,
      total: totalFinal,
      fechaManual: fechaRemito
    };

    const loadingToast = toast.loading("Procesando remito...");
    try {
      await saveRemito(data);
      toast.dismiss(loadingToast);
      
      setTimeout(() => {
        window.print();
        toast.success("Remito guardado");
        setItemsRemito([]);
        setSelectedCustomer(null);
      }, 800);
    } catch (e) {
      toast.dismiss(loadingToast);
      toast.error("Error al guardar");
    }
  };

  const minRows = 5;
  const emptyRowsNeeded = Math.max(0, minRows - itemsRemito.length);

  return (
    <div className="remito-container">
      <div className="section-controls no-print">
        <h2>Generador de Remito</h2>
        <div className="remito-inline-form">
          <div className="input-group group-fecha">
            <label>Fecha</label>
            <input type="date" value={fechaRemito} onChange={(e) => setFechaRemito(e.target.value)} />
          </div>
          <div className="input-group group-cliente">
            <label>Cliente</label>
            <select value={selectedCustomer?.id || ''} onChange={(e) => setSelectedCustomer(customers.find(c => c.id === e.target.value))}>
              <option value="">Seleccionar Cliente...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="input-group group-producto">
            <label>Producto</label>
            <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
              <option value="">Elegir Producto...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.nombre} (${p.precioKilo})</option>)}
            </select>
          </div>
          <div className="input-group group-kilos">
            <label>Kilos</label>
            <input type="number" placeholder="0" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          </div>
          <button onClick={handleAddItem} className="btn-add-item-short">AGREGAR</button>
        </div>
      </div>

      <div className="remito-preview printable-content">
        <div className="remito-document-header">
          <h1>REMITO</h1>
          <div className="header-info-flex">
            <div className="customer-data">
              <p><strong>SEÑOR(ES):</strong> {selectedCustomer ? selectedCustomer.nombre : "___________________________"}</p>
              <p><strong>DOMICILIO:</strong> {selectedCustomer ? selectedCustomer.direccion : "___________________________"}</p>
            </div>
            <div className="date-data">
              <p><strong>FECHA:</strong> {fechaRemito.split('-').reverse().join('/')}</p>
            </div>
          </div>
        </div>

        <table className="remito-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>CANT.</th>
              <th>ESPECIAS / DESCRIPCIÓN</th>
              <th className="text-right" style={{ width: '120px' }}>PRECIO</th>
              <th className="text-right" style={{ width: '160px' }}>COMPRA</th>
              <th className="no-print" style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {itemsRemito.map((item, i) => (
              <tr key={i}>
                <td className="text-center">{item.cantidad}k</td>
                <td>{item.nombre}</td>
                <td className="text-right">$ {formatCurrency(item.precioKilo)}</td>
                <td className="text-right">$ {formatCurrency(item.subtotal)}</td>
                <td className="no-print text-center">
                  <button className="btn-remove-item" onClick={() => removeItem(i)}>×</button>
                </td>
              </tr>
            ))}
            
            {Array(emptyRowsNeeded).fill(0).map((_, i) => (
              <tr key={`empty-${i}`} className="empty-row">
                <td>&nbsp;</td><td></td><td></td><td></td><td className="no-print"></td>
              </tr>
            ))}

            <tr className="total-row">
              <td colSpan="3" className="text-right label-total">TOTAL</td>
              <td className="text-right amount-total">
                <div className="total-wrapper">
                  <span className="symbol">$</span>
                  <span className="value">{formatCurrency(totalFinal)}</span>
                </div>
              </td>
              <td className="no-print"></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <button onClick={handleProcessRemito} className="btn-print-action no-print">
        Guardar e Imprimir Remito
      </button>
    </div>
  );
};

export default RemitoBuilder;