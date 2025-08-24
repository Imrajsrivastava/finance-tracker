import React from 'react'
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts'

export default function CategoryPieChart({ data }) {
  return (
    <div className="card">
      <h3>Category-wise Expenses</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
