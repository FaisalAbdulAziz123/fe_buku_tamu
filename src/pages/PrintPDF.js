// src/pages/PrintPDF.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Sidebar from "./sidebar";
import BPSLogo from "../assets/BPS.png";
import "../styles/PrintReport.css"; // Gunakan CSS baru yang lebih sesuai

// --- Komponen Ikon ---
const IconShow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <path
      fillRule="evenodd"
      d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.404a1.651 1.651 0 0 1 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.404ZM10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
      clipRule="evenodd"
    />
  </svg>
);
const IconPrint = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5 2.5a2.5 2.5 0 0 1 5 0V5h2.5A2.5 2.5 0 0 1 15 7.5v5A2.5 2.5 0 0 1 12.5 15H10v3.5a1.5 1.5 0 0 1-3 0V15H4.5A2.5 2.5 0 0 1 2 12.5v-5A2.5 2.5 0 0 1 4.5 5H7V2.5ZM10 6.5H4.5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1H14a1 1 0 0 0 1-1V7.5a1 1 0 0 0-1-1H11.5a1.5 1.5 0 0 1-3 0V5a1 1 0 0 0-1-1H8.5a1 1 0 0 0-1 1v1.5ZM8.5 7a.5.5 0 0 0-1 0v1.5a.5.5 0 0 0 1 0V7Z"
      clipRule="evenodd"
    />
  </svg>
);
const IconFilter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.59L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z"
      clipRule="evenodd"
    />
  </svg>
);
const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5h10.5a.75.75 0 0 0 0-1.5H4.75a.75.75 0 0 0 0 1.5Z"
      clipRule="evenodd"
    />
  </svg>
);
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <span>Memuat data...</span>
  </div>
);

const PrintPDF = () => {
  const [allGuests, setAllGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getTodayString = () => new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    startDate: getTodayString(),
    endDate: getTodayString(),
    keperluan: "semua",
    status: "semua",
  });

  const [appliedFilters, setAppliedFilters] = useState(null);
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/tamu")
      .then((response) => {
        setAllGuests(response.data || []);
      })
      .catch((err) => {
        console.error("Error fetching guests:", err);
        setError("Gagal memuat data tamu. Pastikan server backend berjalan.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!appliedFilters) return;

    let result = allGuests.filter((guest) => {
      if (!guest.tanggal_kehadiran) return false;
      const start = new Date(
        `${appliedFilters.startDate}T00:00:00.000Z`
      ).getTime();
      const end = new Date(`${appliedFilters.endDate}T23:59:59.999Z`).getTime();
      const guestDate = new Date(guest.tanggal_kehadiran).getTime();
      return guestDate >= start && guestDate <= end;
    });

    if (appliedFilters.keperluan !== "semua") {
      result = result.filter(
        (guest) => guest.keperluan === appliedFilters.keperluan
      );
    }

    if (appliedFilters.status !== "semua") {
      if (appliedFilters.status === "Belum Diproses") {
        result = result.filter(
          (guest) =>
            guest.status === "Belum Diproses" ||
            guest.status === "Menunggu" ||
            guest.status === null ||
            guest.status === ""
        );
      } else {
        result = result.filter(
          (guest) => guest.status === appliedFilters.status
        );
      }
    }

    setFilteredGuests(result);
  }, [allGuests, appliedFilters]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleGenerateReport = () => {
    setAppliedFilters(filters);
    setIsReportGenerated(true);
  };

  const handlePrint = () => window.print();

  const reportStats = useMemo(
    () => ({
      total: filteredGuests.length,
      konsultasi: filteredGuests.filter(
        (g) => g.keperluan === "konsultasi_statistik"
      ).length,
      mitra: filteredGuests.filter((g) => g.keperluan === "mitra_statistik")
        .length,
      umum: filteredGuests.filter((g) => g.keperluan === "tamu_umum").length,
      selesai: filteredGuests.filter((g) => g.status === "Selesai").length,
    }),
    [filteredGuests]
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const getKeperluanLabel = (keperluan) => {
    const labels = {
      konsultasi_statistik: "Konsultasi Statistik",
      mitra_statistik: "Kegiatan Mitra",
      tamu_umum: "Tamu Umum",
    };
    return labels[keperluan] || keperluan;
  };

  const getStatusBadge = (status) => {
    const statusText = status || "Belum Diproses";
    const statusConfig = {
      Selesai: "status-completed",
      Diproses: "status-processing",
      "Belum Diproses": "status-pending",
      Menunggu: "status-pending",
    };
    const statusClass = statusConfig[statusText] || "status-pending";
    return <span className={`status-badge ${statusClass}`}>{statusText}</span>;
  };

  return (
    <div
      className={`dashboard-layout ${isSidebarOpen ? "sidebar-visible" : ""}`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="main-content-area">
        <div className="print-page-wrapper">
          <div className="page-header screen-only">
            <h1 className="page-title">Laporan Rekapitulasi Tamu</h1>
            <p className="page-subtitle">
              Generate dan cetak laporan kunjungan tamu berdasarkan periode dan
              kriteria tertentu.
            </p>
          </div>

          <div className="filter-panel screen-only">
            <div className="filter-panel__header">
              <IconFilter />
              <h2>Filter Laporan</h2>
            </div>
            <div className="filter-panel__body">
              <div className="filter-group">
                <label htmlFor="startDate">Tanggal Mulai</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="form-input"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="endDate">Tanggal Selesai</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="form-input"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="keperluan">Jenis Keperluan</label>
                <select
                  id="keperluan"
                  name="keperluan"
                  value={filters.keperluan}
                  onChange={handleFilterChange}
                  className="form-select"
                >
                  <option value="semua">Semua Keperluan</option>
                  <option value="konsultasi_statistik">
                    Konsultasi Statistik
                  </option>
                  <option value="mitra_statistik">Kegiatan Mitra</option>
                  <option value="tamu_umum">Tamu Umum</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="status">Status Kunjungan</label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="form-select"
                >
                  <option value="semua">Semua Status</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Belum Diproses">
                    Belum Diproses/Menunggu
                  </option>
                </select>
              </div>
            </div>
            <div className="filter-panel__footer">
              <button
                onClick={handleGenerateReport}
                className="btn btn-primary"
                disabled={isLoading}
              >
                <IconShow /> {isLoading ? "Memuat..." : "Tampilkan Data"}
              </button>
            </div>
          </div>

          {isReportGenerated && (
            <div className="report-container">
              <div className="report-actions screen-only">
                <button onClick={handlePrint} className="btn btn-secondary">
                  <IconPrint /> Cetak Laporan
                </button>
              </div>

              <div className="report-area" id="report-to-print">
                <header className="report-header">
                  <img src={BPSLogo} alt="Logo BPS" className="report-logo" />
                  <div className="report-title">
                    <h1>BADAN PUSAT STATISTIK</h1>
                    <h2>Laporan Rekapitulasi Kunjungan Tamu</h2>
                    <div className="report-period">
                      <strong>
                        Periode: {formatDate(appliedFilters.startDate)} -{" "}
                        {formatDate(appliedFilters.endDate)}
                      </strong>
                    </div>
                  </div>
                </header>

                <section className="report-table-section">
                  <h3>📋 Detail Data Tamu</h3>
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : error ? (
                    <div className="error-state">{error}</div>
                  ) : filteredGuests.length > 0 ? (
                    <div className="table-wrapper">
                      <table className="report-table">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Tanggal</th>
                            <th>Nama Lengkap</th>
                            <th>Pekerjaan/Instansi</th>
                            <th>Keperluan</th>
                            <th>Detail</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredGuests.map((guest, index) => (
                            <tr key={guest.id}>
                              <td className="text-center">{index + 1}</td>
                              <td>{formatDate(guest.tanggal_kehadiran)}</td>
                              <td className="font-semibold">
                                {guest.nama_lengkap}
                              </td>
                              <td>{guest.pekerjaan || "-"}</td>
                              <td>{getKeperluanLabel(guest.keperluan)}</td>
                              <td className="detail-cell">
                                {guest.topik_konsultasi ||
                                  guest.tujuan_kunjungan ||
                                  "-"}
                              </td>
                              <td className="text-center">
                                {getStatusBadge(guest.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📄</div>
                      <h4>Tidak Ada Data</h4>
                      <p>
                        Tidak ditemukan data yang sesuai dengan kriteria filter
                        yang Anda pilih.
                      </p>
                    </div>
                  )}
                </section>

                <footer className="report-footer">
                  <div className="footer-content">
                    <div className="print-info">
                      <strong>Dicetak pada:</strong>{" "}
                      {new Date().toLocaleString("id-ID", {
                        dateStyle: "full",
                        timeStyle: "short",
                      })}
                    </div>
                    <div className="signature-area">
                      <p>Mengetahui,</p>
                      <div className="signature-space"></div>
                      <p className="signature-name">
                        (........................................)

                        
                      </p>
                      <p className="signature-title">Kepala BPS</p>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PrintPDF;
