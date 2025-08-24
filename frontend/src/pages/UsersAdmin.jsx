import React, { useEffect, useState } from 'react'
import api from '../utils/api.js'

export default function UsersAdmin() {
  const [users, setUsers] = useState([])
  useEffect(() => { api.get('/users').then(res => setUsers(res.data)) }, [])
  return (
    <div className="card">
      <h2>All Users</h2>
      <table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{new Date(u.createdAt).toLocaleDateString()}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
