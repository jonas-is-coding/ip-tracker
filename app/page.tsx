"use client";
import React, { useState, useEffect } from "react";
import Video from "@/components/ip/video";
import NavBar from "@/components/navbar";

export default function Home() {
  const [ip, setIp] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
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
    <main className="bg-black h-screen overflow-hidden">
      <NavBar />
      <div className="flex items-center justify-between w-full h-screen px-20">
      <div className="w-full h-[600px] pt-10">
        <Video />
      </div>
      <div className="w-[450px] text-center flex flex-col items-center ">
        <h2 className="text-white text-4xl font-semibold">Your information:</h2>
        <ul className="h-full">
          <li>
            Ip Adress: {ip}
          </li>
        </ul>
      </div>
      </div>
    </main>
  );
}
