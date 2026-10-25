import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from './component/login';
import Details from './component/details';
import Categories from './component/categories';
import Newcat from './component/newcat';
import Updatecat from './component/updatecat';
import Customers from './component/customers';
import Sidebar from './component/Sidebar';

// Admin pages share the sidebar layout and need a token
function AdminLayout({ children }) {
  if (!localStorage.getItem("adminToken")) return <Navigate to="/" replace />;
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/details" element={<AdminLayout><Details /></AdminLayout>} />
        <Route path="/details/categories" element={<AdminLayout><Categories /></AdminLayout>} />
        <Route path="/details/newcat" element={<AdminLayout><Newcat /></AdminLayout>} />
        <Route path="/details/updatecat/:id" element={<AdminLayout><Updatecat /></AdminLayout>} />
        <Route path="/details/customers" element={<AdminLayout><Customers /></AdminLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
