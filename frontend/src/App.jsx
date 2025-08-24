import React, { Suspense, lazy } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleGate from './components/RoleGate.jsx'
import { useAuth } from './state/AuthContext.jsx'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Transactions = lazy(() => import('./pages/Transactions.jsx'))
const UsersAdmin = lazy(() => import('./pages/UsersAdmin.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))

export default function App() {
  const { user, logout } = useAuth()
  return (
    <div className="container">
      <header className="header">
        <h1>💸 Finance Tracker</h1>
        <nav className="nav">
          {user && <NavLink to="/" end>Dashboard</NavLink>}
          {user && <NavLink to="/transactions">Transactions</NavLink>}
          {user && user.role === 'admin' && <NavLink to="/users">Users</NavLink>}
          {!user ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <button className="btn" onClick={logout}>Logout</button>
          )}
        </nav>
      </header>

      <Suspense fallback={<div className="card">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/users" element={
              <RoleGate roles={['admin']}>
                <UsersAdmin />
              </RoleGate>
            }/>
          </Route>
        </Routes>
      </Suspense>

      <footer>Built with React 18, Express, MongoDB, Redis</footer>
    </div>
  )
}
