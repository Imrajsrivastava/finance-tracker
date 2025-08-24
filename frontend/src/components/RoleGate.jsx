import React from 'react'
import { useAuth } from '../state/AuthContext.jsx'

export default function RoleGate({ roles, children }) {
  const { user } = useAuth()
  if (!user || !roles.includes(user.role)) {
    return <div className="card">You do not have permission to view this page.</div>
  }
  return children
}
