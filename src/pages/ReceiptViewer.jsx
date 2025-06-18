import { useEffect, useState } from "react";
import { FaTimes, FaExternalLinkAlt, FaDownload } from "react-icons/fa";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";

export default function ReceiptViewer({ pdfUrl, onClose }) {
    const [isPdfLoaded, setIsPdfLoaded] = useState(false);

    const handleOpenInNewTab = () => {
        window.open(pdfUrl, "_blank");
    };


    const handleDownload = async () => {
        try {
            // solicitud GET para obtener el PDF desde la URL
            const response = await fetch(pdfUrl);

            //blob (archivo binario)
            const blob = await response.blob();

            //creamos una URL temporal que apunta al blob en memoria
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            //URL temporal como destino del enlace
            link.href = blobUrl;
            link.download = "recibo.pdf";

            // Agregamos el enlace al DOM (no visible)
            document.body.appendChild(link);

            //clic en el enlace para disparar la descarga
            link.click();

            //se quita el enlace del DOM después de usarlo
            document.body.removeChild(link);

            // liberado del url en memoria
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error("Error al descargar el PDF:", err);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-5xl h-[90%] rounded-lg shadow-lg flex flex-col overflow-hidden">

                {/* animacion de carga y luego pdf*/}
                <div className="flex-1 overflow-hidden relative bg-gray-100">
                    {!isPdfLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                            <Lottie animationData={loadingAnimation} loop className="w-40 h-40" />
                        </div>
                    )}
                    <iframe
                        src={pdfUrl}
                        title="Recibo PDF"
                        className="w-full h-full"
                        onLoad={() => setIsPdfLoaded(true)}
                    />
                </div>

                {/* footer del popup*/}
                <div className="flex justify-between items-center px-6 py-4 bg-[#1b1e20] border-t border-gray-600">
                    <button
                        onClick={onClose}
                        className="bg-blue-700 text-white font-semibold px-6 py-2 rounded hover:bg-blue-800"
                    >
                        CERRAR
                    </button>
                    <div className="flex items-center gap-5 text-xl">
                        <button
                            onClick={handleOpenInNewTab}
                            className="text-blue-500 hover:text-blue-300"
                            title="Abrir en nueva pestaña"
                        >
                            <FaExternalLinkAlt />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="text-blue-500 hover:text-blue-300"
                            title="Descargar PDF"
                        >
                            <FaDownload />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
