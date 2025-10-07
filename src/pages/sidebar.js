// src/components/Sidebar.js
import React, { useEffect } from "react";
import "../styles/sidebar.css";
import BPSLogo from "../assets/BPS.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, toggleSidebar]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const menuItems = [
    { path: "/admin", icon: "📊", label: "Dashboard" },
    { path: "/pages/UserManagement", icon: "👥", label: "Kelola Pengguna" },
    { path: "/pages/PrintPDF", icon: "📄", label: "Cetak PDF" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={BPSLogo} alt="BPS Logo" />
            <span className="sidebar-logo-text">BPS Admin</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-text">{item.label}</span>
            </Link>
          ))}

          <div className="sidebar-divider"></div>

          {/* Info Card untuk mengisi ruang kosong */}
          <div className="sidebar-info-card">
            <h3>Quick Stats</h3>
            <p>Admin Portal v2.0</p>
            <p style={{ marginTop: '8px', fontSize: '12px' }}>
              Sistem Manajemen Buku Tamu BPS
            </p>
          </div>

          {/* Logout Button */}
          <button onClick={handleLogout} className="sidebar-item logout">
            <span className="sidebar-item-icon">🚪</span>
            <span className="sidebar-item-text">Keluar</span>
          </button>
        </div>
      </div>

      <div
        className={`toggle-button-container ${isOpen ? "sidebar-open" : ""}`}
      >
        {!isOpen && (
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        )}
      </div>
    </>
  );
};

export default Sidebar;