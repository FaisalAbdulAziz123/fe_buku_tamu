// src/pages/EditGuestForm.js
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditGuestForm.module.css"; // Update import path
import BPSLogo from "../assets/BPS.png";
import Sidebar from "./sidebar";

const IconSpinner = () => (
  <svg
    className="loading-spinner small"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      opacity="0.3"
    ></circle>
    <path
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const EditGuestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    no_hp: "",
    alamat: "",
    pekerjaan: "",
    keperluan: "",
    tanggal_kehadiran: "",
    status: "Belum Diproses",
    isi_pertemuan: "",
    dokumentasi: "",
    diterima_oleh: "",
    jenis_kelamin: "",
    tujuan_kunjungan: "",
    topik_konsultasi: "",
    deskripsi_kebutuhan: "",
    staff: "",
    dituju: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const API_BASE_URL = "https://buku-tamu-be.vercel.app/api";

  const toggleSidebar = useCallback(() => setIsSidebarOpen((p) => !p), []);

  useEffect(() => {
    const fetchGuestData = async () => {
      if (!id) {
        setError("ID tamu tidak valid");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError("");
      console.log(`EditGuestForm: Fetching guest data for ID: ${id}`);
      
      try {
        const response = await axios.get(`${API_BASE_URL}/tamu/${id}`);
        const data = response.data;
        console.log("EditGuestForm: Guest data received:", data);
        
        if (data && typeof data === "object") {
          const formattedDate = data.tanggal_kehadiran
            ? new Date(data.tanggal_kehadiran).toISOString().split("T")[0]
            : "";
          
          setFormData({
            nama_lengkap: data.nama_lengkap || "",
            email: data.email || "",
            no_hp: data.no_hp || "",
            alamat: data.alamat || "",
            pekerjaan: data.pekerjaan || "",
            keperluan: data.keperluan || "",
            tanggal_kehadiran: formattedDate,
            status: data.status || "Belum Diproses",
            isi_pertemuan: data.isi_pertemuan || "",
            diterima_oleh: data.diterima_oleh || "",
            dokumentasi: data.dokumentasi || "",
            jenis_kelamin: data.jenis_kelamin || "",
            tujuan_kunjungan: data.tujuan_kunjungan || "",
            topik_konsultasi: data.topik_konsultasi || "",
            deskripsi_kebutuhan: data.deskripsi_kebutuhan || "",
            staff: data.staff || "",
            dituju: data.dituju || ""
          });
        } else {
          setError("Format data tamu tidak sesuai atau data kosong.");
        }
      } catch (err) {
        console.error("EditGuestForm: Error fetching guest data:", err);
        if (err.response && err.response.status === 404) {
          setError(`Data tamu dengan ID ${id} tidak ditemukan.`);
        } else if (err.response) {
          setError(
            `Gagal memuat data tamu: ${
              err.response.data?.message || err.message
            }`
          );
        } else {
          setError("Gagal memuat data tamu. Periksa koneksi atau server.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchGuestData();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nama_lengkap.trim()) {
      setError("Nama lengkap harus diisi");
      return;
    }
    if (!formData.keperluan.trim()) {
      setError("Keperluan harus diisi");
      return;
    }
    if (!formData.tanggal_kehadiran) {
      setError("Tanggal kehadiran harus diisi");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    const payloadToUpdate = { ...formData };
    delete payloadToUpdate.id;

    console.log("EditGuestForm: Updating guest data with payload:", payloadToUpdate);

    try {
      const response = await axios.put(`${API_BASE_URL}/tamu/${id}`, payloadToUpdate);
      console.log("EditGuestForm: Update response data:", response.data);
      
      if (response.status === 200 || response.status === 201) {
        setSuccess("Data tamu berhasil diperbarui!");
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        setError(`Gagal memperbarui: Server merespons dengan status ${response.status}`);
      }
    } catch (err) {
      console.error("EditGuestForm: Error updating guest:", err.response || err);
      if (err.response) {
        setError(
          `Gagal memperbarui: ${
            err.response.data?.error ||
            err.response.data?.message ||
            err.message ||
            `Error ${err.response.status}`
          }`
        );
      } else {
        setError("Gagal memperbarui data. Cek koneksi atau server.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate("/admin");

  const statusOptions = [
    { value: "Belum Diproses", label: "Belum Diproses" },
    { value: "Diproses", label: "Diproses" },
    { value: "Selesai", label: "Selesai" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className={`dashboard-layout ${isSidebarOpen ? "sidebar-visible" : "sidebar-collapsed"}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="main-content-area">
          <div className="edit-guest-form">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Memuat data tamu...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state for initial fetch
  if (error && !formData.nama_lengkap && !isLoading) {
    return (
      <div className={`dashboard-layout ${isSidebarOpen ? "sidebar-visible" : "sidebar-collapsed"}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="main-content-area">
          <div className="edit-guest-form">
            <div className="form-header">
              <div className="header-content">
                <div className="logo-title">
                  <img src={BPSLogo} alt="BPS Logo" className="bps-logo" />
                  <h1>Edit Data Tamu</h1>
                </div>
                <button className="back-btn" onClick={handleCancel} type="button">
                  ← Kembali
                </button>
              </div>
            </div>
            <div className="form-container">
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Kembali ke Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? "sidebar-visible" : "sidebar-collapsed"}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="main-content-area">
        <div className="edit-guest-form">
          {/* Header */}
          <div className="form-header">
            <div className="header-content">
              <div className="logo-title">
                <img src={BPSLogo} alt="BPS Logo" className="bps-logo" />
                <h1>Edit Data Tamu</h1>
              </div>
              <button className="back-btn" onClick={handleCancel} type="button">
                ← Kembali
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {/* Alerts */}
              {error && !success && (
                <div className="alert alert-error">
                  <span className="alert-icon">⚠️</span>
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success">
                  <span className="alert-icon">✅</span>
                  {success}
                </div>
              )}

              {/* Form Grid */}
              <div className="form-grid">
                {/* Personal Information Section */}
                <div className="form-section">
                  <h2 className="section-title">Informasi Pribadi & Kontak</h2>
                  
                  <div className="form-group">
                    <label htmlFor="nama_lengkap" className="form-label">
                      Nama Lengkap <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="nama_lengkap"
                      name="nama_lengkap"
                      value={formData.nama_lengkap}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="jenis_kelamin" className="form-label">
                      Jenis Kelamin <span className="required">*</span>
                    </label>
                    <select
                      id="jenis_kelamin"
                      name="jenis_kelamin"
                      value={formData.jenis_kelamin}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="contoh@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="no_hp" className="form-label">
                      No. HP
                    </label>
                    <input
                      type="tel"
                      id="no_hp"
                      name="no_hp"
                      value={formData.no_hp}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pekerjaan" className="form-label">
                      Pekerjaan/Instansi
                    </label>
                    <input
                      type="text"
                      id="pekerjaan"
                      name="pekerjaan"
                      value={formData.pekerjaan}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Contoh: PNS, Swasta, Mahasiswa"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="alamat" className="form-label">
                      Alamat
                    </label>
                    <textarea
                      id="alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="3"
                      placeholder="Masukkan alamat lengkap"
                    />
                  </div>
                </div>

                {/* Visit Details Section */}
                <div className="form-section">
                  <h2 className="section-title">Detail Kunjungan</h2>
                  
                  <div className="form-group">
                    <label htmlFor="tanggal_kehadiran" className="form-label">
                      Tanggal Kehadiran <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="tanggal_kehadiran"
                      name="tanggal_kehadiran"
                      value={formData.tanggal_kehadiran}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="staff" className="form-label">
                      Staff (CSO)
                    </label>
                    <input
                      type="text"
                      id="staff"
                      name="staff"
                      value={formData.staff}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nama staff yang melayani"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dituju" className="form-label">
                      Dituju (Seksi)
                    </label>
                    <input
                      type="text"
                      id="dituju"
                      name="dituju"
                      value={formData.dituju}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Seksi yang dituju"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="status" className="form-label">
                      Status Kunjungan
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tujuan_kunjungan" className="form-label">
                      Tujuan Kunjungan
                    </label>
                    <input
                      type="text"
                      id="tujuan_kunjungan"
                      name="tujuan_kunjungan"
                      value={formData.tujuan_kunjungan}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Tujuan utama kunjungan"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="topik_konsultasi" className="form-label">
                      Topik Konsultasi
                    </label>
                    <input
                      type="text"
                      id="topik_konsultasi"
                      name="topik_konsultasi"
                      value={formData.topik_konsultasi}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Topik yang dikonsultasikan"
                    />
                  </div>
                </div>

                {/* Purpose and Requirements Section */}
                <div className="form-section full-width">
                  <h2 className="section-title">Keperluan & Kebutuhan</h2>
                  
                  <div className="form-group">
                    <label htmlFor="keperluan" className="form-label">
                      Keperluan <span className="required">*</span>
                    </label>
                    <textarea
                      id="keperluan"
                      name="keperluan"
                      value={formData.keperluan}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="4"
                      placeholder="Jelaskan keperluan kunjungan secara detail"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="deskripsi_kebutuhan" className="form-label">
                      Deskripsi Kebutuhan
                    </label>
                    <textarea
                      id="deskripsi_kebutuhan"
                      name="deskripsi_kebutuhan"
                      value={formData.deskripsi_kebutuhan}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="3"
                      placeholder="Deskripsi detail kebutuhan atau permintaan"
                    />
                  </div>
                </div>

                {/* Results and Documentation Section */}
                <div className="form-section full-width">
                  <h2 className="section-title">Hasil & Dokumentasi</h2>
                  
                  <div className="form-group">
                    <label htmlFor="diterima_oleh" className="form-label">
                      Diterima Oleh (Petugas Tindak Lanjut)
                    </label>
                    <input
                      type="text"
                      id="diterima_oleh"
                      name="diterima_oleh"
                      value={formData.diterima_oleh}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nama petugas yang menangani"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="isi_pertemuan" className="form-label">
                      Isi/Hasil Pertemuan
                    </label>
                    <textarea
                      id="isi_pertemuan"
                      name="isi_pertemuan"
                      value={formData.isi_pertemuan}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="4"
                      placeholder="Ringkasan hasil atau pembahasan dalam pertemuan"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dokumentasi" className="form-label">
                      Link Dokumentasi (URL)
                    </label>
                    <input
                      type="url"
                      id="dokumentasi"
                      name="dokumentasi"
                      value={formData.dokumentasi}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://example.com/dokumentasi.jpg"
                    />
                    {formData.dokumentasi && !formData.dokumentasi.startsWith("blob:") && (
                      <div className="image-preview" style={{ marginTop: "12px" }}>
                        <img
                          src={formData.dokumentasi}
                          alt="Dokumentasi"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "150px",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            objectFit: "cover"
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <IconSpinner />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditGuestForm;