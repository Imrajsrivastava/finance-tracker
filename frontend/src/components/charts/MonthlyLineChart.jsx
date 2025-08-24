import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function MonthlyLineChart({ data }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const rows = data.map((m,i) => ({ month: months[i], income: m.income, expense: m.expense }))
  return (
    <div className="card">
      <h3>Monthly Trends</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" />
            <Line type="monotone" dataKey="expense" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
