import React, { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../utils/api.js'
import { useAuth } from '../state/AuthContext.jsx'

export default function Transactions() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [filters, setFilters] = useState({ q: '', type: '', category: '' })
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ type: 'expense', category: '', amount: '', date: new Date().toISOString().slice(0,10), note: '' })
  const limit = 10

  const readOnly = user?.role === 'read-only'

  const fetchData = useCallback(async () => {
    const { data } = await api.get('/transactions', { params: { ...filters, page, limit } })
    setItems(data.items); setTotal(data.total); setPages(data.pages)
  }, [filters, page])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { api.get('/categories').then(res => setCategories(res.data)) }, [])

  const incomeTotal = useMemo(() => items.filter(i=>i.type==='income').reduce((s,i)=>s+i.amount,0), [items])
  const expenseTotal = useMemo(() => items.filter(i=>i.type==='expense').reduce((s,i)=>s+i.amount,0), [items])

  const onSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (readOnly) return
    await api.post('/transactions', { ...form, amount: Number(form.amount), date: new Date(form.date) })
    setForm(f => ({ ...f, amount: '', note: '' }))
    fetchData()
  }, [form, fetchData, readOnly])

  const onDelete = useCallback(async (id) => {
    if (readOnly) return
    await api.delete(`/transactions/${id}`)
    fetchData()
  }, [fetchData, readOnly])

  return (
    <div className="grid">
      <div className="card">
        <h2>Transactions</h2>
        <div className="grid grid-2">
          <div>
            <div className="badge">Income (page)</div>
            <h3>₹ {incomeTotal.toLocaleString()}</h3>
          </div>
          <div>
            <div className="badge">Expense (page)</div>
            <h3>₹ {expenseTotal.toLocaleString()}</h3>
          </div>
        </div>

        <div className="grid" style={{ marginTop: '1rem' }}>
          <input placeholder="Search..." value={filters.q} onChange={e => setFilters(f=>({ ...f, q: e.target.value }))} />
          <select value={filters.type} onChange={e => setFilters(f=>({ ...f, type: e.target.value }))}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filters.category} onChange={e => setFilters(f=>({ ...f, category: e.target.value }))}>
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={()=>setPage(1)} className="btn">Apply</button>
        </div>
      </div>

      <div className="card">
        <h3>Add Transaction</h3>
        <form className="grid grid-2" onSubmit={onSubmit}>
          <select value={form.type} onChange={e=>setForm(f=>({...f, type:e.target.value}))}>
            <option value="expense">expense</option>
            <option value="income">income</option>
          </select>
          <select value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))} required>
            <option value="" disabled>Select category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm(f=>({...f, amount:e.target.value}))} required />
          <input type="date" value={form.date} onChange={e=>setForm(f=>({...f, date:e.target.value}))} required />
          <input placeholder="Note" value={form.note} onChange={e=>setForm(f=>({...f, note:e.target.value}))} />
          <button className="btn" disabled={readOnly}>{readOnly ? 'Read-only' : 'Add'}</button>
        </form>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Note</th><th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td><span className="badge">{item.type}</span></td>
                <td>{item.category}</td>
                <td>₹ {item.amount.toLocaleString()}</td>
                <td>{item.note}</td>
                <td>
                  <button onClick={()=>onDelete(item._id)} disabled={readOnly}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
          <div className="badge">Page {page} / {pages}</div>
          <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Next</button>
        </div>
      </div>
    </div>
  )
}
