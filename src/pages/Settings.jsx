import { useState } from "react";
import Lottie from "lottie-react";
import Sidebar from "../pages/Sidebar";
import mantenimientoAnimation from "../assets/mantenimiento.json";
import { FaBars } from "react-icons/fa";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-[#1b1e20] text-white">
      {/* Sidebar fijo en desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Sidebar flotante en mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      <main className="flex-1 px-4 md:px-10 py-8">
        {/* Botón hamburguesa en mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-white text-2xl mb-6"
        >
          <FaBars />
        </button>

        {/* Contenido de mantenimiento */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center gap-6">
          <Lottie animationData={mantenimientoAnimation} loop className="w-72 h-72" />
          <h2 className="text-xl font-semibold text-gray-300">
            Esta sección se encuentra en mantenimiento.
            <br />
            Estamos trabajando para ofrecerte una mejor experiencia.
          </h2>
        </div>
      </main>
    </div>
  );
}
