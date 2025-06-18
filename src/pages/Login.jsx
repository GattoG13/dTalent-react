import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/dTalentLogo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    //refresh errores y form
    e.preventDefault();
    setError("");

    //campos vacíos
    if (!username.trim() || !password.trim()) {
      setError("Por favor, completá todos los campos.");
      return;
    }

    try {
      const res = await fetch("https://api.schneck.dlab.software/api/users/demo_login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", username);
      navigate("/Users");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#1b1e20] flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-[#111314] text-white w-full max-w-md p-8 rounded-xl shadow-lg space-y-6"
      >
        <div className="flex justify-center">
          <img src={logo} alt="dTalent" className="h-10" />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-400">Número de documento</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="1.234.567-8"
            className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-400">Contraseña</label>
          <div className="relative">
            <input
            //condicional de mostrar/ocultar password
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2 pr-10 bg-transparent border border-blue-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-400 transition duration-200"
            >
              {/* candado abierto/cerrado */}
              {showPassword ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 8h-1V6a5 5 0 10-10 0h2a3 3 0 116 0v2H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v2H3v8h14v-8h-1V8a6 6 0 00-6-6zM8 8a2 2 0 114 0v2H8V8z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          INICIAR SESIÓN
        </button>

        {error && (
          <p className="text-red-500 text-center text-sm mt-2">{error}</p>
        )}

        <div className="text-center">
          <a href="#" className="text-sm text-blue-400 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </form>
    </div>
  );
}
