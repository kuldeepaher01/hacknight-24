"use client"
import React, { useState, useEffect } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function MoneyManager() {
  const getTodayDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  };

  const [spendings, setSpendings] = useState([]);
  const [income, setIncome] = useState([]);
  const [spendingForm, setSpendingForm] = useState({category: '', amount: '', date: getTodayDate()   });
  const [incomeForm, setIncomeForm] = useState({ category: '', amount: '', date: getTodayDate() });
  const [chartData, setChartData] = useState([]);
  
  const handleSpendingChange = (e) => {
    setSpendingForm({ ...spendingForm, [e.target.name]: e.target.value });
  };

  const handleIncomeChange = (e) => {
    setIncomeForm({ ...incomeForm, [e.target.name]: e.target.value });
  };

  const addSpending = (e) => {
    e.preventDefault();
    setSpendings([...spendings, spendingForm]);
    setSpendingForm({ category: '', cost: '', date: getTodayDate() });
  };

  const addIncome = (e) => {
    e.preventDefault();
    setIncome([...income, incomeForm]);
    setIncomeForm({ category: '', amount: '', date: getTodayDate() });
  };

  useEffect(() => {
    const combinedData = [...spendings, ...income].map(item => ({
      date: item.date,
      amount: item.cost || item.amount,
      type: item.cost ? 'spending' : 'income'
    }));

    const groupedData = combinedData.reduce((acc, item) => {
      const existing = acc.find(i => i.date === item.date);
      if (existing) {
        existing[item.type] = (existing[item.type] || 0) + parseFloat(item.amount);
      } else {
        acc.push({
          date: item.date,
          [item.type]: parseFloat(item.amount)
        });
      }
      return acc;
    }, []);

    setChartData(groupedData);
  }, [spendings, income]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Money Management Dashboard</h1>
      
      <Card className="mb-6 flex flex-col items-center">
        <CardHeader className="px-7">
          <CardTitle>Spendings vs Income</CardTitle>
          <CardDescription>Track your spendings and income over time.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center w-full">
          <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="spending" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="income" stroke="#82ca9d" />
          </LineChart>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Spending</h2>
          <form onSubmit={addSpending} className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Category</label>
              <input 
                type="text" 
                name="category" 
                value={spendingForm.category} 
                onChange={handleSpendingChange} 
                className="w-full p-2 border rounded" 
                placeholder="e.g. seeds, fertilizers" 
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Cost</label>
              <input 
                type="number" 
                name="cost" 
                value={spendingForm.cost} 
                onChange={handleSpendingChange} 
                className="w-full p-2 border rounded" 
                placeholder="Cost in currency" 
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Date</label>
              <input 
                type="date" 
                name="date" 
                value={spendingForm.date} 
                onChange={handleSpendingChange} 
                className="w-full p-2 border rounded" 
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Spending</button>
          </form>
          <ul className="mt-6">
            {spendings.map((spending, index) => (
              <li key={index} className="bg-gray-200 p-2 mb-2 rounded">
                {spending.category} - {spending.cost} - {spending.date}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Income</h2>
          <form onSubmit={addIncome} className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Category</label>
              <input 
                type="text" 
                name="category" 
                value={incomeForm.category} 
                onChange={handleIncomeChange} 
                className="w-full p-2 border rounded" 
                placeholder="e.g. cattle, farm" 
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Amount</label>
              <input 
                type="number" 
                name="amount" 
                value={incomeForm.amount} 
                onChange={handleIncomeChange} 
                className="w-full p-2 border rounded" 
                placeholder="Amount in currency" 
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Date</label>
              <input 
                type="date" 
                name="date" 
                value={incomeForm.date} 
                onChange={handleIncomeChange} 
                className="w-full p-2 border rounded" 
              />
            </div>
            <button type="submit" className="bg-green-500 text-white p-2 rounded">Add Income</button>
          </form>
          <ul className="mt-6">
            {income.map((inc, index) => (
              <li key={index} className="bg-gray-200 p-2 mb-2 rounded">
                {inc.category} - {inc.amount} - {inc.date}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MoneyManager;
