"use client";
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import DynamicMap from '@/components/DynamicMap';


function page() {
    // const today date
    const today = new Date().toISOString().split("T")[0];
    // oneyear ago date
    const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split("T")[0];
    
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coordinates, setCoordinates] = useState([]);
    const timeInterval = [oneYearAgo, today];






  return (
    <div className="App">
      <h2 className="text-center text-2xl font-extrabold dark:text-white">Mark your farmland</h2>
      {/* instructions for mapping */}
        <ol className="p-2 list-decimal list-inside">
             <li>Make Sure you are standing inside your farm</li>
            <li>Click on the layer icon on right to select appropriate layer (satellite/map)</li>
            <li>Click on the "Draw a polygon" icon to mark the area</li>
            
            <li>Click on the "Submit" button to save the marked area</li>
        </ol>

        {/* map component */}

      <DynamicMap />
    </div>
  )
}

export default page