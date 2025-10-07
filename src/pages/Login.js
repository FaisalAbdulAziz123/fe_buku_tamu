import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Tamu from "../assets/Tamu2.png";  
import BPSLogo from "../assets/BPS.png";
import { QRCodeSVG } from "qrcode.react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("page-loaded");

    return () => {
      document.body.classList.remove("page-loaded");
    };
  }, []);

  return (
    <div className="login-container">
      {/* Left: Illustration - Hidden on mobile */}
      <div className="login-image">
        <div className="login-image-overlay">
          <div className="background-decoration"></div>
          <img src={Tamu} alt="Login Illustration" className="illustration-img" />
          <div className="login-image-text">
            <h2 className="main-title">BUKU TAMU DIGITAL</h2>
            <h3 className="subtitle">Sistem Informasi Tamu BPS Kota Sukabumi</h3>
            <p className="description">
              Platform digital untuk memudahkan pendataan dan pelayanan tamu di
              Badan Pusat Statistik
            </p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Pendataan tamu digital</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Proses cepat dan mudah</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Data aman terjamin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="login-form">
        <div className="login-form-content">
          {/* Mobile Header - Only visible on mobile */}
          <div className="mobile-header">
            <img src={BPSLogo} alt="BPS Logo" className="mobile-logo" />
            <h1 className="mobile-title">BUKU TAMU BPS</h1>
          </div>

          {/* Desktop Logo */}
          <div className="login-logo desktop-only">
            <img src={BPSLogo} alt="BPS Logo" />
          </div>

          <div className="welcome-section">
            <h1 className="welcome-title">Selamat Datang</h1>
            <p className="welcome-subtext">Silakan pilih metode masuk ke sistem</p>
          </div>

          <div className="button-group">
            <button 
              className="btn-guest btn-primary" 
              onClick={() => navigate("/tamu")}
              aria-label="Masuk sebagai tamu"
            >
              <span className="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
                </svg>
              </span>
              <span className="btn-text">Masuk sebagai Tamu</span>
            </button>
            
            <button
              className="btn-admin btn-secondary"
              onClick={() => navigate("/admin-login")}
              aria-label="Masuk sebagai admin"
            >
              <span className="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z"/>
                </svg>
              </span>
              <span className="btn-text">Masuk sebagai Admin</span>
            </button>
          </div>

          {/* QR Code Section */}
          <div className="qr-section">
            <div className="qr-header">
              <div className="divider">
                <span className="divider-text">Atau</span>
              </div>
            </div>
            
            <div className="qr-content">
              <p className="qr-text">Scan QR code untuk akses cepat:</p>
              <div className="qr-code-container">
                <div className="qr-code-wrapper">
                  <QRCodeSVG
                    value="https://sukabumikota.bps.go.id/id"
                    size={120}
                    level="H"
                    includeMargin={true}
                    className="qr-code"
                  />
                </div>
                <p className="qr-instruction">Arahkan kamera ke QR code</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <div className="footer-content">
              <p className="copyright">© {new Date().getFullYear()} Badan Pusat Statistik</p>
              <p className="footer-subtitle">Republik Indonesia</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="form-decorations">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;