"use client";
import Link from "next/link";
import React, { useEffect, useState, useContext } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { FarmContext } from "@/context/farmcontext";
import { fetchCoordinatesForLoan } from "@/lib/db";
import axios from "axios";
function Page() {
  // todays date
  const today = new Date().toISOString().split("T")[0];
  // last year date
  const lastYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split("T")[0];
  const timeInterval = [lastYear, today];
  const [coordinates, setCoordinates] = useState([]);
  const {userid, surveyNo} = useContext(FarmContext);
  const [crop, setCrop] = useState('');
  const [prevCrop, setPrevCrop] = useState('');
  const [amount, setAmount] = useState('');
  const [revenue, setRevenue] = useState('');
  const [greenIndex, setGreenIndex] = useState('');
  const [area, setArea] = useState('');
  const [expense, setExpense] = useState('');
  const [eligiblility, setEligibility] = useState('false');
  const [data, setData] = useState({
  });


  useEffect(() => {
    function formatCoordinates(input) {
      // Remove all whitespace
      let cleaned = input.replace(/\s/g, '');
      
      // Replace curly braces with square brackets
      cleaned = cleaned.replace(/\{/g, '[').replace(/\}/g, ']');
      
      // Remove quotation marks
      cleaned = cleaned.replace(/"/g, '');
      
      return cleaned;
    }
    if(userid){
      console.log("Survey No", surveyNo);
      fetchCoordinatesForLoan(surveyNo, userid).then((res) => {
        console.log(res);
        setArea(res[0].area_in_ha);
        let formattedData = formatCoordinates(res[0].polygon_list);
        console.log(formattedData);
        setCoordinates(formattedData);
        
        
      const someData = [[74.174285,19.319491],[74.17407,19.319633],[74.174087,19.319937],[74.174306,19.319922],[74.174382,19.320058],[74.174392,19.320261],[74.174532,19.320413],[74.174634,19.320494],[74.174805,19.320448],[74.174886,19.320362],[74.174945,19.320205],[74.174961,19.320063],[74.17502,19.319891],[74.175116,19.319552],[74.175106,19.319426],[74.174832,19.319405],[74.174634,19.319669],[74.174837,19.319755],[74.174736,19.319896],[74.174285,19.319491]];
        // call axios at localhost:5000/getveg with formattedData and timeInterval
      console.log("Some Data", someData===formattedData);
        // const result = await axios.post("http://localhost:5000/getveg", {
        //   "coordinates": someData,
        //   "timeInterval": timeInterval,
        // });
        axios.post("http://localhost:5000/getveg", {
          "coordinates": someData,
          "timeInterval": timeInterval,
        }).then(result => {
          

        setData(result.data);
        console.log("Data", result.data);
        
        }).catch(err => {
          console.log(err);
        }
      );



      }).catch(err => {
        console.log(err);
      });
    }
  }, [userid]);




 
  const handleApply = () => {

    // Crop Rating with 2 weightage
    let cropRating = 0;
    if (crop === "Tomato" || crop === "Eliachi" || crop === "Cotton" || crop === "Sugarcane") {
      cropRating = 1.8;
    } else if (crop === "Gawar" || crop === "Wheat" || crop === "Potato" || crop === "Rice") {
      cropRating = 1.3;
    } else {
      cropRating = 0.9;
    }

    // Previous Crop with 1 weightage
    let previousCrop = 1;
    if (prevCrop !== "" || prevCrop === "NONE") {
      previousCrop = 0;
    }

    // Area Score with 2 Weightage
    let areaScore = 0;
    if (area > 5000) {
      areaScore = 1.75;
    } else if (area > 2500) {
      areaScore = 1.27;
    } else {
      areaScore = 0.9;
    }
    
    // Profit with 2 Weightage
    let profit_score = Math.abs((expense / revenue) * 2);

    //Green Index with 3 Weightage
    let green_index = greenIndex;
    
    let finalCreditScore = (profit_score + green_index + areaScore + cropRating + previousCrop)

    
  };

  return (
    <Card className="mx-auto max-w-xl mt-8"> {/* Adding mt-8 for margin top */}
      <CardHeader>
        <CardTitle className="text-xl">Loan Application</CardTitle>
        <CardDescription>Enter Your Valid Information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="crop">Crop</label>
            <Select onValueChange={(value) => setCrop(value)} value={crop}>
              <SelectTrigger>
                <SelectValue placeholder="Select Crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Cotton">Cotton</SelectItem>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Tomato">Tomato</SelectItem>
                <SelectItem value="Potato">Potato</SelectItem>
                <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                <SelectItem value="Eliachi">Eliachi</SelectItem>
                <SelectItem value="Gawar">Gawar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="previous-crop">Previous Crop</label>
            <Select onValueChange={(value) => setPrevCrop(value)} value={prevCrop}>
              <SelectTrigger>
                <SelectValue placeholder="Select Previous Crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Cotton">Cotton</SelectItem>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Tomato">Tomato</SelectItem>
                <SelectItem value="Potato">Potato</SelectItem>
                <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                <SelectItem value="Eliachi">Eliachi</SelectItem>
                <SelectItem value="Gawar">Gawar</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="area">Area</label>
            <input
              id="area"
              type="text"
              placeholder="Enter in Hectors"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="GreenIndex">GreenIndex</label>
            <input
              id="greenIndex"
              type="text"
              placeholder="Up to 3"
              required
              value={greenIndex}
              onChange={(e) => setGreenIndex(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="revenue">Last Cycle Revenue</label>
            <input
              id="revenue"
              type="text"
              placeholder="Enter Total Revenue"
              required
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="expenses">Last Cycle Expenses</label>
            <input
              id="expenses"
              type="text"
              placeholder="Enter Total Expense"
              required
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="amount">Amount of Loan Required</label>
            <input
              id="amount"
              type="text"
              placeholder=""
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleApply}>
            Apply for Loan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Page;
