import React, { useCallback, useState } from 'react'
import api from '../utils/api.js'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name:'', email: '', password: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true); setErr(''); setMsg('')
    try {
      await api.post('/auth/register', form)
      setMsg('Registered! You can now login.')
      setTimeout(() => nav('/login'), 700)
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed')
    } finally { setLoading(false) }
  }, [form, nav])

  return (
    <div className="card">
      <h2>Register</h2>
      <form className="grid" onSubmit={onSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <select name="role" value={form.role} onChange={onChange}>
          <option value="user">user</option>
          <option value="read-only">read-only</option>
        </select>
        {msg && <div style={{ color: 'lightgreen' }}>{msg}</div>}
        {err && <div style={{ color: 'salmon' }}>{err}</div>}
        <button className="btn" disabled={loading}>{loading ? '...' : 'Create account'}</button>
      </form>
    </div>
  )
}
