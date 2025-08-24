import React, { useEffect, useMemo, useState } from 'react'
import api from '../utils/api.js'
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx'
import MonthlyLineChart from '../components/charts/MonthlyLineChart.jsx'
import IncomeVsExpenseBar from '../components/charts/IncomeVsExpenseBar.jsx'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    let mounted = true
    api.get('/analytics', { params: { year } }).then(res => mounted && setData(res.data))
    return () => { mounted = false }
  }, [year])

  if (!data) return <div className="card">Loading analytics...</div>

  return (
    <div className="grid">
      <div className="card">
        <h2>Overview ({data.year})</h2>
        <div className="grid grid-2">
          <div>
            <div className="badge">Income Total</div>
            <h2>₹ {data.totals.incomeTotal.toLocaleString()}</h2>
          </div>
          <div>
            <div className="badge">Expense Total</div>
            <h2>₹ {data.totals.expenseTotal.toLocaleString()}</h2>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Year: </label>
          <input type="number" value={year} onChange={e => setYear(e.target.value)} />
          {data.cached && <span className="badge" style={{ marginLeft: 8 }}>cached</span>}
        </div>
      </div>

      <MonthlyLineChart data={data.monthly} />
      <IncomeVsExpenseBar totals={data.totals} />
      <CategoryPieChart data={data.category} />
    </div>
  )
}
