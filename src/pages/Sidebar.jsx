import { NavLink } from "react-router-dom";
import { FaUsers, FaFileInvoice, FaBullhorn, FaCog, FaTimes } from "react-icons/fa";
import logo from "../assets/dTalentLogo.png";

const menuItems = [
  { label: "Empleados", path: "/users", icon: <FaUsers /> },
  { label: "Recibos", path: "/receipts", icon: <FaFileInvoice /> },
  { label: "Comunicados", path: "/communications", icon: <FaBullhorn /> },
  { label: "Configuración", path: "/settings", icon: <FaCog /> },
];

export default function Sidebar({ onClose }) {
  const username = "dLab";

  return (
    <div className="md:relative md:w-64 md:h-screen z-50">
      {/* Cierre solo visible en móvil */}
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="fixed md:static top-0 left-0 h-full w-64 bg-[#111314] text-white flex flex-col justify-between shadow-lg">
        <div className="p-4 space-y-6">
          <div className="flex justify-between items-center">
            <img src={logo} alt="dTalent" className="h-10" />
            {onClose && (
              <button onClick={onClose} className="md:hidden text-white text-xl">
                <FaTimes />
              </button>
            )}
          </div>

          <nav className="space-y-2 mt-4">
            {menuItems.map(({ label, path, icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg w-full font-medium transition duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-[#1b1e20] hover:text-white"
                  }`
                }
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-[#1f1f1f] flex items-center gap-3">
          <div className="bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
            {username[0].toUpperCase()}
          </div>
          <div className="text-sm leading-tight">
            <p className="text-gray-400">Bienvenido</p>
            <p className="text-white font-semibold">{username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
