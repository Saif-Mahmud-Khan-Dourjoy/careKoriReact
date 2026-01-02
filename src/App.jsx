// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Login from "./pages/Login" // your existing login page
import PrivateRoute from "./routes/PrivateRoute"
import AppLayout from "./layouts/AppLayout"

import Dashboard from "./pages/Dashboard"
import UserManagement from "./pages/UserManagement"
import Complaints from "./pages/Complaints"
import Revenue from "./pages/Revenue"
import Promos from "./pages/Promos"
import Settings from "./pages/Settings"
import CategorySubcategory from "./pages/CategorySubCategory"
import Test from "./pages/Test"
import Banners from "./pages/Banners"

export default function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />

  
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/promos" element={<Promos />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/categories-subcategories"
              element={<CategorySubcategory />}
            />
            <Route
              path="/banner-management"
              element={<Banners />}
            />
          </Route>
           <Route
              path="/test"
              element={<Test />}
            />
         
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-8">Not Found</div>} />
      </Routes>
    </Router>
  )
}
