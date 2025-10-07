
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function PrivateRoute() {
  const { user, token, ready } = useAuth()
  const location = useLocation()

 
  if (!ready) return <div className="p-6">Loading…</div>

  
  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }


  return <Outlet />
}
