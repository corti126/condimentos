import React from 'react';
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Importamos el contenedor
import Navbar from './components/navbar/navbar';
import ProductList from './components/ProductList/ProductList';
import CustomerList from './components/CustomerList/CustomerList';
import RemitoBuilder from './components/RemitoBuilder/RemitoBuilder';
import History from './components/History/History';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Este componente maneja todas las notificaciones de la app */}
        <Toaster position="top-right" reverseOrder={false} />
        
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/clientes" element={<CustomerList />} />
            <Route path="/remitos" element={<RemitoBuilder />} />
            <Route path="/historial" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;