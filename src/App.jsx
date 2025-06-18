import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Receipts from "./pages/Receipts";
import Communications from "./pages/Communications";
import Settings from "./pages/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/users"
          element={token ? <Users/> : <Navigate to="/login" />}
        />
        <Route
          path="/receipts"
          element={token ? <Receipts /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={token ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/communications"
          element={token ? <Communications /> : <Navigate to="/login" />}
        />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
