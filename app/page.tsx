"use client"
import React, { useState, useEffect, startTransition } from 'react';
import Video from "@/components/ip/video";
import { IPAddress } from "@/lib/types/type";
import NavBar from "@/components/navbar";

export default function Home() {
  const [ip, setIp] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [host, setHost] = useState('');

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("http://ip-api.com/json/?fields=61439");
        const data = await response.json();
        setIp(data.query);
        setCity(data.city);
        setCountry(data.country);
        setLat(data.lat);
        setLon(data.lon);
        setHost(data.host);
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };

    fetchIP();
  }, []);

  return (
    <main className="bg-black">
      <NavBar />
      <div>
        {ip && (
          <div className='text-white absolute top-44 left-40 font-bold text-2xl'>
            IP Address: {ip}
          </div>
        )}
        {city && (
          <div className='text-white absolute top-44 left-40 font-bold text-2xl'>
            City: {city}
          </div>
        )}
        {country && (
          <div className='text-white absolute top-44 left-40 font-bold text-2xl'>
            Country: {country}
          </div>
        )}
        {lat && (
          <div className='text-white absolute top-96 left-52 font-bold text-2xl'>
            N: {lat}
          </div>
        )}
        {lon && (
          <div className='text-white absolute top-44 right-40 font-bold text-2xl'>
            W: {lon}
          </div>
        )}
      </div>
      <Video />
    </main>
  );
}