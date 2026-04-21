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

  useEffect(() => {
    const loadData = async () => {
      const p = await getProducts();
      const c = await getCustomers();
      setProducts(p);
      setCustomers(c);
    };
    loadData();
  }, []);

  const handleAddItem = () => {
    if (!selectedProductId || !cantidad || cantidad <= 0) {
        toast.error("Selecciona un producto y cantidad válida");
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
    toast.success(`${producto.nombre} añadido al remito`);
  };

  const removeItem = (index) => {
    setItemsRemito(itemsRemito.filter((_, i) => i !== index));
    toast.error("Item eliminado");
  };

  const totalFinal = itemsRemito.reduce((acc, item) => acc + item.subtotal, 0);

  const handleProcessRemito = async () => {
    if (!selectedCustomer || itemsRemito.length === 0) {
      toast.error("Completar cliente y productos");
      return;
    }

    const data = {
      clienteNombre: selectedCustomer.nombre,
      clienteDireccion: selectedCustomer.direccion,
      items: itemsRemito,
      total: totalFinal
    };

    const loadingToast = toast.loading("Guardando remito...");

    try {
      await saveRemito(data);
      toast.dismiss(loadingToast);
      toast.success("Remito guardado correctamente");
      window.print();
      setItemsRemito([]);
      setSelectedCustomer(null);
    } catch (e) {
      toast.dismiss(loadingToast);
      toast.error("Error al procesar el remito");
    }
  };

  return (
    <div className="remito-container">
      <div className="no-print section-controls">
        <h2>Generador de Remitos</h2>
        
        <div className="remito-header-form">
          <label>Cliente:</label>
          <select 
            value={selectedCustomer?.id || ''} 
            onChange={(e) => setSelectedCustomer(customers.find(c => c.id === e.target.value))}
          >
            <option value="">-- Seleccionar Cliente --</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div className="add-product-row">
          <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
            <option value="">-- Seleccionar Producto --</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.nombre} (${p.precioKilo}/kg)</option>)}
          </select>
          <input 
            type="number" 
            placeholder="Kilos" 
            value={cantidad} 
            onChange={(e) => setCantidad(e.target.value)} 
          />
          <button onClick={handleAddItem} className="btn-add-item">Agregar</button>
        </div>
      </div>

      <div className="remito-preview">
        <div className="remito-document-header">
          <h1>REMITO</h1>
          <div className="header-info-flex">
            {selectedCustomer ? (
              <div className="customer-data">
                <p><strong>SEÑOR(ES):</strong> {selectedCustomer.nombre}</p>
                <p><strong>DOMICILIO:</strong> {selectedCustomer.direccion}</p>
              </div>
            ) : (
              <p className="no-print" style={{color: 'red'}}>Seleccione un cliente para continuar</p>
            )}
            <div className="date-data">
              <p><strong>FECHA:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <table className="remito-table">
          <thead>
            <tr>
              <th>DESCRIPCIÓN</th>
              <th>P. UNIT.</th>
              <th>CANTIDAD</th>
              <th>SUBTOTAL</th>
              <th className="no-print"></th>
            </tr>
          </thead>
          <tbody>
            {itemsRemito.map((item, i) => (
              <tr key={i}>
                <td>{item.nombre}</td>
                <td>${item.precioKilo}</td>
                <td>{item.cantidad} kg</td>
                <td>${item.subtotal.toLocaleString()}</td>
                <td className="no-print">
                  <button className="btn-remove-item" onClick={() => removeItem(i)}>x</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="total-box">
          <h3>TOTAL: ${totalFinal.toLocaleString()}</h3>
        </div>
      </div>
      
      <button onClick={handleProcessRemito} className="btn-print no-print">
        Guardar e Imprimir
      </button>
    </div>
  );
};

export default RemitoBuilder;