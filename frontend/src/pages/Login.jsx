import React, { useCallback, useState } from 'react'
import api from '../utils/api.js'
import { useAuth } from '../state/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true); setErr('')
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.token)
      nav('/')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }, [form, login, nav])

  return (
    <div className="card">
      <h2>Login</h2>
      <form className="grid" onSubmit={onSubmit}>
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
        {err && <div style={{ color: 'salmon' }}>{err}</div>}
        <button className="btn" disabled={loading}>{loading ? '...' : 'Login'}</button>
      </form>
    </div>
  )
}
