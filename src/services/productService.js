import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { db } from "../firebase";

// --- SECCIÓN: PRODUCTOS (CONDIMENTOS) ---

export const getProducts = async () => {
  const productsCol = collection(db, "condimentos");
  const q = query(productsCol, where("activo", "==", true));
  const productSnapshot = await getDocs(q);
  return productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addProduct = async (nombre, precio) => {
  await addDoc(collection(db, "condimentos"), {
    nombre: nombre,
    precioKilo: Number(precio),
    activo: true
  });
};

export const deleteProduct = async (id) => {
  const productRef = doc(db, "condimentos", id);
  await updateDoc(productRef, { activo: false });
};

export const updateProductPrice = async (id, nuevoPrecio) => {
  const productRef = doc(db, "condimentos", id);
  await updateDoc(productRef, {
    precioKilo: Number(nuevoPrecio)
  });
};

// --- SECCIÓN: CLIENTES ---

export const getCustomers = async () => {
  const customersCol = collection(db, "clientes");
  const q = query(customersCol, where("activo", "==", true));
  const customerSnapshot = await getDocs(q);
  return customerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addCustomer = async (nombre, direccion) => {
  await addDoc(collection(db, "clientes"), {
    nombre: nombre, // Usamos 'nombre' como quedamos para que sea prolijo
    direccion: direccion,
    activo: true
  });
};

export const deleteCustomer = async (id) => {
  const customerRef = doc(db, "clientes", id);
  await updateDoc(customerRef, { activo: false });
};

// --- SECCIÓN: REMITOS (HISTORIAL) ---

export const saveRemito = async (remitoData) => {
  try {
    const docRef = await addDoc(collection(db, "remitos"), {
      ...remitoData,
      fecha: new Date().toISOString(), // Fecha técnica para ordenar
      fechaFormateada: new Date().toLocaleDateString('es-AR'), // Fecha legible
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar el remito:", error);
    throw error;
  }
};

export const getRemitosHistory = async () => {
  const remitosCol = collection(db, "remitos");
  // Los traemos ordenados por fecha, del más nuevo al más viejo
  const q = query(remitosCol, orderBy("fecha", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};