"use client";
// vendorcontext.jsx

import React, { createContext, useState } from "react";

export const FarmContext = createContext();

export const FarmProvider = ({ children }) => {

    const [username, setUsername] = useState('Kuldeep Vinod Aher');
    const [userid, setUserid] = useState('8');
    const [surveyNo, setSurveyNo] = useState('123');
    const [location, setLocation] = useState('');

	

	// console.log("Hello context is running");
	return (
		<FarmContext.Provider
			value={{
                username, setUsername,
                surveyNo, setSurveyNo,
                location, setLocation,
                userid, setUserid,
			}}
		>
			{children}
		</FarmContext.Provider>
	);
};
