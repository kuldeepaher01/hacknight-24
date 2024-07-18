"use client";

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FarmContext } from '@/context/farmcontext';
import { compareData } from '@/lib/db';


// ProfileCard component with Tailwind CSS
const ProfileCard = ({ username, adharNo, creditScore }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < creditScore ? "text-yellow-500" : "text-gray-300"}>
      ★
    </span>
  ));

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 h-full flex-grow mr-4">
    <div className="flex items-center mb-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-bold ml-4">{username}</h2>
    </div>
    <p className="text-gray-700 mb-2">Aadhar No: {adharNo}</p>
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <p className="mr-2">Credit Score:</p>
        <div className="flex">
          {stars} {/* Assuming 'stars' represents some form of visual credit score */}
        </div>
      </div>
      <div className="text-6xl font-bold text-right">
        {creditScore.toFixed(1)} {/* Displaying the numeric credit score here */}
      </div>
    </div>
  </div>
  
  );
};

// LineChart component using Recharts with Tailwind CSS
const InvestmentLineChart = ({ data }) => {
  const chartData = data.labels.map((label, index) => ({
    month: label,
    investments: data.investments[index],
    spendings: data.spendings[index],
  }));

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h3 className="text-lg font-bold mb-4">Investment and Spendings</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="investments" stroke="#8884d8" />
          <Line type="monotone" dataKey="spendings" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ValueDisplayWidget component
const ValueDisplayWidget = ({ title, value }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 text-center mt-4"> {/* Added mt-4 for top margin */}
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-2xl font-semibold mt-2">₹{value}</p> 
    </div>
  );
};


// Sidebar navigation component
const Sidebar = () => {
    const {username} = useContext(FarmContext);
  return (
    <div className="bg-gray-800 text-white w-64 p-4 fixed h-full">
      <div className="flex items-center mb-8">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
        <h2 className="text-xl font-bold">{username}</h2>
      </div>
      <nav>
        <ul>
          <li className="mb-4"><a href="/moneymanager" className="text-white hover:text-gray-400">Money Manager</a></li>
          <li className="mb-4"><a href="#" className="text-white hover:text-gray-400">Loan Approval</a></li>
        </ul>
      </nav>
    </div>
  );
};

// ProfileCompletionAlert component
const ProfileCompletionAlert = () => {
    const {username, userid} = useContext(FarmContext);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        console.log("UserID:",userid);
        if(userid){
            console.log("Fetching data");
            compareData(userid).then((data) => {
                console.log(data);
            }
            ).catch(err => {
                window.alert('Error fetching data');
            });
        }
        
    }, []);



  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-lg flex-shrink-0 w-1/3 animate-flash">
      <p className="font-bold">Complete Your Profile</p>
      <p>Please complete your profile to get the most out of our services.</p>
      <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg">Complete Profile</button>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
    const {username} = useContext(FarmContext);
    if(username === 'none'){
        window.location.href = '/login';
    }
  const [investmentData, setInvestmentData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    investments: [3000, 2000, 4000, 5000, 6000, 7000],
    spendings: [2000, 3000, 2500, 4000, 3500, 5000],
  });

  const income = 10000; // Replace with actual income data
  const expenses = 7000; // Replace with actual expenses data
  const savings = income - expenses; // Calculate savings

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1 lg:col-span-3 flex">
            <ProfileCard username={username} adharNo="1234-5678-9101" creditScore={4} />
            <ProfileCompletionAlert />
          </div>
          <div className="col-span-2">
            <InvestmentLineChart data={investmentData} />
          </div>
          <div className="col-span-1">
            <ValueDisplayWidget title="Income Amount" value={`${income}`} />
            <ValueDisplayWidget title="Expense Amount" value={`${expenses}`} />
            <ValueDisplayWidget title="Savings Amount" value={`${savings}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
