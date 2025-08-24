import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'

export default function IncomeVsExpenseBar({ totals }) {
  const data = [{ name: 'Total', income: totals.incomeTotal, expense: totals.expenseTotal }]
  return (
    <div className="card">
      <h3>Income vs Expense</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" />
            <Bar dataKey="expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
