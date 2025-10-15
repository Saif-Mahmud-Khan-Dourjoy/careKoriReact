
import React, { createContext, useState, useEffect, useContext } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)


  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    setReady(true)
  }, [])

  const login = (tokenArg, userArg) => {
    setUser(userArg)
    setToken(tokenArg)
    localStorage.setItem("user", JSON.stringify(userArg))
    localStorage.setItem("token", tokenArg)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ ready, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext
