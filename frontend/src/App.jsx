import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SessionPage from "./pages/SessionPage.jsx";
import PinnedQuestions from "./pages/PinnedQuestions.jsx";
import Navbar from "./components/Navbar.jsx";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}

      <Routes>
       

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/session/:id"
          element={
            <PrivateRoute>
              <SessionPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/pinned"
          element={
            <PrivateRoute>
              <PinnedQuestions />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}