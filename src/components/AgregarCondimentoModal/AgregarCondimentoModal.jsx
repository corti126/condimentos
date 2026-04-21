import React, { useState } from 'react';
import { addProduct } from '../../services/productService';
import toast from 'react-hot-toast';
import './AgregarCondimentoModal.css';

const AgregarCondimentoModal = ({ isOpen, onClose, onProductAdded }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre || !precio) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Guardando condimento...");

    try {
      await addProduct(nombre, precio);
      
      toast.dismiss(loadingToast);
      toast.success(`${nombre} agregado con éxito`, {
        duration: 4000,
      });

      // Limpiar y cerrar
      setNombre('');
      setPrecio('');
      onProductAdded(); // Refresca la lista en el padre
      onClose();        // Cierra el modal
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Hubo un error al guardar");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-x" onClick={onClose}>×</button>
        <form className="product-form" onSubmit={handleSubmit}>
          <h3>Nuevo Condimento</h3>
          
          <div className="form-group">
            <label>Nombre de la especia</label>
            <input 
              type="text" 
              placeholder="Ej: Pimentón Ahumado" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Precio por Kilo ($)</label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={precio} 
              onChange={(e) => setPrecio(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="btn-save" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Condimento"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgregarCondimentoModal;