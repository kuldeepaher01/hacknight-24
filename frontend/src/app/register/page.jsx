"use client"
import React, { useState } from 'react';
import { setUserData , createUser} from '@/lib/db';
const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [landsOwned, setLandsOwned] = useState('');
  const [vehiclesOwned, setVehiclesOwned] = useState('');
  const [cattles, setCattles] = useState('');
  const [wells, setWells] = useState('');
  const [borewell, setBorewell] = useState(0);
  const [borewellCheckbox, setBorewellCheckbox] = useState(false);


  const handleSubmit =  (e) => {
    e.preventDefault();
    try {
      // await createUser(name,email,phoneNumber);
      // console.log("!");
      // await setUserData(wells, vehiclesOwned,cattles, borewell, gender, landsOwned);
      // window.alert('User created successfully');
      // Handle success (e.g., update UI or show a success message)
      createUser(name,email,phoneNumber).then(() => {
        setUserData(wells, vehiclesOwned,cattles, borewell, gender, landsOwned).then(() => {
          window.alert('User created successfully');
          window.location.href = '/login';
        }
        ).catch(err => {
          window.alert('Error creating user');
        });
      }
      ).catch(err => {
        window.alert('Error creating user');
      });

    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error inserting values:', error);
    }
  };

  return (
    <section className="flex flex-col items-center pt-6">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create an account
          </h1>
          <form className="space-y-4 md:space-y-6" method="POST" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your full name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter your name "
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="+91 123-456-7890"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className='flex flex-row justify-between'>

            <div>
              <label
                htmlFor="landsOwned"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Number of Lands Owned
              </label>
              <input
                type="number"
                name="landsOwned"
                id="landsOwned"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={landsOwned}
                onChange={(e) => setLandsOwned(e.target.value)}
              />
            </div>
            
            <div>
              <label
                htmlFor="vehiclesOwned"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Number of Vehicles Owned
              </label>
              <input
                type="number"
                name="vehiclesOwned"
                id="vehiclesOwned"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={vehiclesOwned}
                onChange={(e) => setVehiclesOwned(e.target.value)}
              />
            </div>
            </div>
           
            <div className='flex flex-row justify-between'>
          <div>
              <label
                htmlFor="cattles"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Number of Cattles
              </label>
              <input
                type="number"
                name="cattles"
                id="cattles"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={cattles}
                onChange={(e) => setCattles(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="wells"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Number of Wells
              </label>
              <input
                type="number"
                name="wells"
                id="wells"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={wells}
                onChange={(e) => setWells(e.target.value)}
              />
            </div>
           
          </div>
          <div className='flex flex-row justify-between'>
          <div>
              <label
                htmlFor="borewellCheckbox"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Borewell
              </label>
              <input
                type="checkbox"
                name="borewellCheckbox"
                id="borewellCheckbox"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                checked={borewellCheckbox}
                onChange={(e) => setBorewellCheckbox(e.target.checked)}
              />
            </div>

            {borewellCheckbox && (
             <div>
             <label
               htmlFor="wells"
               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
             >
               Number of borewells
             </label>
             <input
               type="number"
               name="borewell"
               id="borewell"
               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               required
               value={borewell}
               onChange={(e) => setBorewell(e.target.value)}
             />
           </div>) }
          </div>
         
            
            
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Create an account
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <a
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                href="/login"
              >
                Sign in here
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
