import { useEffect, useState } from "react";
import Sidebar from "../pages/Sidebar";
import ReceiptViewer from "../pages/ReceiptViewer";
import Lottie from "lottie-react";
import errorAnimation from "../assets/error.json";
import loadingAnimation from "../assets/loading.json";
import { FaCheck, FaTimes, FaBars } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function Receipts() {
    const [receipts, setReceipts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Más recientes");
    const [filters, setFilters] = useState([]);
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            setIsLoading(true);
            const res = await fetch("https://api.schneck.dlab.software/api/receipts/", {
                headers: { Authorization: `Token ${token}` },
            });
            const data = await res.json();
            setReceipts(data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                setHasFetched(true);
            }, 300);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenPdf = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`https://api.schneck.dlab.software/api/receipts/${id}/file`, {
                headers: { Authorization: `Token ${token}` },
            });
            const data = await res.json();
            if (data?.file) setSelectedPdfUrl(data.file);
            else alert("No se pudo abrir el recibo PDF.");
        } catch (err) {
            console.error("Error al abrir el recibo:", err);
            alert("Error al abrir el recibo PDF.");
        }
    };

    const filterOptions = [
        { label: "Tipo de remuneración", field: "type" },
        { label: "Año", field: "year" },
        { label: "Mes", field: "month" },
        { label: "Enviado", field: "isSended" },
        { label: "Leído", field: "isReaded" },
    ];

    const handleAddFilter = (label, field) => {
        if (!filters.some((f) => f.field === field)) {
            setFilters([...filters, { label, field, value: "" }]);
        }
        setFilterMenuOpen(false);
    };

    const getUniqueValues = (field) =>
        [...new Set(receipts.map((r) => r[field]).filter(Boolean))];

    const filteredReceipts = receipts
        .filter((receipt) =>
            filters.every((filter) => {
                const value = filter.value;
                const field = filter.field;
                const receiptValue = receipt[field];
                if (!value || value === "Todos") return true;
                if (typeof receiptValue === "boolean") {
                    return value === "Sí" ? receiptValue : !receiptValue;
                }
                return receiptValue?.toString() === value;
            })
        )
        .filter((receipt) => {
            const term = searchTerm.trim().toLowerCase();
            if (!term) return true;
            return (
                receipt.type?.toLowerCase().includes(term) ||
                receipt.employeeFullName?.toLowerCase().includes(term)
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "Más recientes":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "Más antiguos":
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case "Tipo":
                    return a.type.localeCompare(b.type);
                default:
                    return 0;
            }
        });

    return (
        <div className="flex min-h-screen bg-[#1b1e20] text-white relative">
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
                {/* Botón de menú hamburguesa en móvil */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden text-white text-xl mb-4"
                >
                    <FaBars />
                </button>

                {/* Header */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        Lista de recibos
                        <span className="text-sm bg-blue-600 px-2 rounded-full">
                            {filteredReceipts.length}
                        </span>
                    </h1>
                    <button
                        className="bg-blue-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-800"
                        onClick={fetchData}
                    >
                        🔄 REFRESCAR LISTA DE RECIBOS
                    </button>
                </div>

                {/* Filtros, orden y busqueda */}
                <div className="flex flex-wrap items-start justify-between mb-4 gap-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm relative">
                        <span className="text-gray-400">Ordenar por</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[#1b1e20] border border-gray-600 px-2 py-1 rounded-md"
                        >
                            <option>Más recientes</option>
                            <option>Más antiguos</option>
                            <option>Tipo</option>
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
                                    {filterOptions.map((f) => (
                                        <li
                                            key={f.field}
                                            onClick={() => handleAddFilter(f.label, f.field)}
                                            className="px-4 py-2 hover:bg-[#1f1f1f] flex justify-between cursor-pointer"
                                        >
                                            {f.label} <span className="text-gray-400">+</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {filters.map((f) => {
                            const isBoolean = typeof receipts[0]?.[f.field] === "boolean";
                            const filterValues = isBoolean
                                ? ["Sí", "No"]
                                : getUniqueValues(f.field);

                            return (
                                <select
                                    key={f.field}
                                    value={f.value}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        const updated = filters.map((x) =>
                                            x.field === f.field
                                                ? {
                                                    ...x,
                                                    value: selected === "removeFilter" ? "" : selected,
                                                }
                                                : x
                                        );
                                        setFilters(
                                            selected === "removeFilter"
                                                ? updated.filter((x) => x.field !== f.field)
                                                : updated
                                        );
                                    }}
                                    className="bg-blue-800 text-white px-2 py-1 rounded-md text-sm"
                                >
                                    <option value="">{f.label}</option>
                                    {filterValues.map((val) => (
                                        <option key={val} value={val}>
                                            {val}
                                        </option>
                                    ))}
                                    <option value="removeFilter">Remover filtro</option>
                                </select>
                            );
                        })}
                    </div>

                    {/* Buscador */}
                    <div className="w-full md:w-64 ml-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar recibos"
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

                        {searchTerm && (
                            <div className="text-sm text-gray-300 mt-2 flex items-center gap-2 justify-end">
                                <span>
                                    Se muestran los resultados de la búsqueda:{" "}
                                    <span className="text-white font-medium">{searchTerm}</span>
                                </span>
                                <button
                                    className="text-gray-400 hover:text-white text-lg leading-none"
                                    onClick={() => setSearchTerm("")}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabla /loading / error */}
                {isLoading && !hasFetched ? (
                    <div className="flex justify-center py-20">
                        <Lottie animationData={loadingAnimation} loop className="h-40 w-40 mb-6" />
                    </div>
                ) : filteredReceipts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Lottie animationData={errorAnimation} loop className="h-40 w-40 mb-6" />
                        <p className="text-center text-gray-400 text-lg">
                            Lo lamentamos, no se han encontrado registros disponibles.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-800 text-white">
                                <tr>
                                    <th className="px-4 py-3">Tipo</th>
                                    <th className="px-4 py-3">Empleado</th>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Enviado</th>
                                    <th className="px-4 py-3">Leído</th>
                                    <th className="px-4 py-3">Firmado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReceipts.map((r) => (
                                    <tr
                                        key={r.id}
                                        onClick={() => handleOpenPdf(r.id)}
                                        className="border-b border-[#2b2b2b] hover:bg-[#161a1c] cursor-pointer"
                                    >
                                        <td className="px-4 py-4">{r.type}</td>
                                        <td className="px-4 py-4">
                                            <div>{r.employeeFullName || "-"}</div>
                                            <div className="text-sm text-gray-400">#{r.employeeNumber}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {r.month}/{r.year}
                                        </td>
                                        <td className="px-4 py-4">
                                            {r.isSended ? (
                                                <>
                                                    <FaCheck className="text-green-500" />
                                                    <div className="text-xs text-gray-400">
                                                        {formatDistanceToNow(new Date(r.sendedDate), {
                                                            addSuffix: true,
                                                            locale: es,
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <FaTimes className="text-red-500" />
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {r.isReaded ? (
                                                <>
                                                    <FaCheck className="text-green-500" />
                                                    <div className="text-xs text-gray-400">
                                                        {formatDistanceToNow(new Date(r.readedDate), {
                                                            addSuffix: true,
                                                            locale: es,
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <FaTimes className="text-red-500" />
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {r.isSigned ? (
                                                <FaCheck className="text-green-500" />
                                            ) : (
                                                <FaTimes className="text-red-500" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* popup pdf */}
                {selectedPdfUrl && (
                    <ReceiptViewer pdfUrl={selectedPdfUrl} onClose={() => setSelectedPdfUrl(null)} />
                )}
            </main>
        </div>
    );
}
