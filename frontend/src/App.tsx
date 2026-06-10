import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AspiranteDashboard from './pages/AspiranteDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/aspirante" element={<AspiranteDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
