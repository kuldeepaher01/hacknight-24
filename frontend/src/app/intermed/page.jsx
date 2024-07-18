"use client";
import React, { useContext } from 'react'
import {useState, useEffect} from 'react';
import {fetchLocation, getUserData} from '@/lib/db';
import axios from 'axios';
import { FarmContext } from '@/context/farmcontext';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


function page() {
    const {username, userid, setSurveyNo} = useContext(FarmContext);
    const [lands, setLands] = useState(0);
    const [survey_no, setSurvey_no] = useState('');
    const [flag, setFlag] = useState(false);
    const [data, setData] = useState({
        coordinates: [],
        location: [],
        area_in_ha: 0,
        survey_no: '',
    });
    useEffect(() => {
        if(userid){
            getUserData(userid).then((res) => {
                console.log("userdata",res);
                setLands(res[0].total_lands_owned);
            }).catch(err => {
                console.log(err);
            });
        }
    }
    , [userid]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(survey_no === ''){
            window.alert("Please enter the survey number");
        }
        else{
            fetchLocation(survey_no, userid).then((res) => {
                setSurveyNo(survey_no);
                console.log(res);
                setData(res[0]);
                if(res[0].polygon_list.length === 0){
                    window.alert("Coordinates not found for the survey number. Please enter the coordinates for the survey number");
                    window.location.href = '/vegetation';
                }
                else{
                    window.location.href = '/loan';
                }
            }).catch(err => {
                console.log(err);
            }
            );

        }

       
    }



  return (
    <>

    <h1 className='text-4xl font-bold text-center m-2'>
        Welcome to Advanced Loan System 
    </h1>

    <Card className="sm:col-span-2 m-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-center">Hello {username}</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
         You have {lands} lands registered with us. Please enter the survey number of the land for which you wish to take a crop loan on 
        </CardDescription>
      </CardHeader>
      <CardFooter>
        {/* form for taking input search it in database if doesnt exist for that uderid create new */}
        <form>
          <label className="block">
            <span className="text-gray-700">Survey Number</span>
            <input type="text" className="form-input mt-1 block w-full" placeholder="Survey Number" onChange={(e) => setSurvey_no(e.target.value)} />
          </label>
          <Button className="mt-4" onClick={handleSubmit}>Submit</Button>
        </form>
      </CardFooter>
    </Card>

    </>


  )
}

export default page