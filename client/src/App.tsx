import { useAuth } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Items from "./pages/Items";

function App() {
  function AppRoutes() {
    const { authenticated } = useAuth();

    return (
      <Routes>
        <Route
          path="/login"
          element={authenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={authenticated ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/"
          element={authenticated ? <Items /> : <Navigate to="/login" />}
        />
      </Routes>
    );
  }

  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
