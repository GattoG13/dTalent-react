import { useState, useEffect } from "react";
import { FaEdit, FaBars } from "react-icons/fa";
import Sidebar from "../pages/Sidebar";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";
import errorAnimation from "../assets/error.json";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Más reciente");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const filterOptions = [
    "Tipo de remuneración", "Cargo", "Sector", "Turno", "Activo", "Nacionalidad", "Rol",
  ];

  const getFilterField = (label) => {
    const map = {
      "Tipo de remuneración": "remunerationType",
      Cargo: "position",
      Sector: "section",
      Turno: "workShift",
      Activo: "isActive",
      Nacionalidad: "nationality",
      Rol: "role",
    };
    return map[label];
  };

  const getUniqueValues = (field) => {
    return [...new Set(users.map((u) => u[field]).filter(Boolean))];
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch("https://api.schneck.dlab.software/api/users/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setUsers(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) => {
      if (!filterValue) return true;
      const val = (user[getFilterField(selectedFilter)] || "").toString().toLowerCase();
      return val === filterValue.toLowerCase();
    })
    .filter((u) => {
      const term = searchTerm.toLowerCase();
      return (
        u.firstName.toLowerCase().includes(term) ||
        u.lastName?.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Más reciente": return new Date(b.createdAt) - new Date(a.createdAt);
        case "Más antiguos": return new Date(a.createdAt) - new Date(b.createdAt);
        case "Número": return a.employeeNumber - b.employeeNumber;
        case "Nombre": return a.firstName.localeCompare(b.firstName);
        case "Apellido": return (a.lastName || "").localeCompare(b.lastName || "");
        case "Email": return a.email.localeCompare(b.email);
        default: return 0;
      }
    });

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

      <main className="flex-1 px-4 md:px-10 py-8 w-full">
        {/* Botón hamburguesa en mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-white text-2xl mb-4"
        >
          <FaBars />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            Lista de empleados
            <span className="text-sm bg-blue-600 px-2 rounded-full">
              {filteredUsers.length}
            </span>
          </h1>
          <div className="flex gap-2">
            <button className="bg-[#2f2f2f] px-4 py-2 rounded-md text-sm hover:bg-[#3a3a3a]">
              IMPORTAR
            </button>
            <button className="bg-blue-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-800">
              + NUEVO EMPLEADO
            </button>
          </div>
        </div>

        {/* Filtros + y busqueda */}
        <div className="flex flex-wrap items-start justify-between mb-4 gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm relative">
            <span className="text-gray-400">Ordenar por</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#1b1e20] border border-gray-600 px-2 py-1 rounded-md text-white"
            >
              <option>Más reciente</option>
              <option>Más antiguos</option>
              <option>Número</option>
              <option>Nombre</option>
              <option>Apellido</option>
              <option>Email</option>
            </select>

            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="text-blue-400 hover:underline"
            >
              Agregar filtro +
            </button>

            {filterMenuOpen && (
              <div className="absolute z-10 top-8 left-0 bg-[#111314] border border-[#2a2a2a] rounded-md w-64 shadow-lg">
                <ul className="py-2">
                  {filterOptions.map((opt) => (
                    <li
                      key={opt}
                      onClick={() => {
                        setSelectedFilter(opt);
                        setFilterValue("");
                        setFilterMenuOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-[#1f1f1f] flex justify-between cursor-pointer"
                    >
                      {opt} <span className="text-gray-400">+</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedFilter && (
              <select
                value={filterValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "removefilter") {
                    setSelectedFilter(null);
                    setFilterValue("");
                  } else {
                    setFilterValue(val);
                  }
                }}
                className="bg-blue-800 text-white px-2 py-1 rounded-md text-sm"
              >
                <option value="">{selectedFilter}</option>
                {getUniqueValues(getFilterField(selectedFilter)).map((v) => (
                  <option key={v} value={v}>
                    {typeof v === "boolean" ? (v ? "Activo" : "Inactivo") : v}
                  </option>
                ))}
                <option value="removefilter">Remover filtro</option>
              </select>
            )}
          </div>

          <div className="w-full md:w-64 ml-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar empleados"
                className="w-full bg-[#1b1e20] text-white border border-gray-600 rounded-md px-4 py-2 pr-10 placeholder-gray-400 focus:outline-none"
              />
              <svg
                className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387-1.414 1.414-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabla / loading / error */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Lottie animationData={loadingAnimation} loop className="h-40 w-40 mb-6" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Lottie animationData={errorAnimation} loop className="h-40 w-40 mb-6" />
            <p className="text-center text-gray-400 text-lg">
              No se encontraron empleados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-3">Número</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Correo</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[#2b2b2b] hover:bg-[#161a1c]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                          {u.firstName.toUpperCase().split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span>#{u.employeeNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">{u.firstName}</td>
                    <td className="px-4 py-4">{u.email}</td>
                    <td className="px-4 py-4">{u.phoneNumber || "-"}</td>
                    <td className="px-4 py-4">
                      <span className={`${u.isActive ? "bg-green-700" : "bg-red-700"} text-white text-xs px-2 py-1 rounded-full`}>
                        {u.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-blue-400 hover:text-white">
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
