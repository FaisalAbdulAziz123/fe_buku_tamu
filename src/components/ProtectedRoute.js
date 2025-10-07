// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Kita akan memeriksa apakah ada token admin di localStorage.
  // Token ini seharusnya disimpan saat admin berhasil login.
  const adminToken = localStorage.getItem('adminToken');

  if (!adminToken) {
    // Jika tidak ada token, artinya admin belum login.
    // Arahkan (redirect) ke halaman login admin.
    return <Navigate to="/admin-login" replace />;
  }

  // Jika token ada, tampilkan komponen yang diminta (halaman admin).
  return children;
};

export default ProtectedRoute;