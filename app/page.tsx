"use client";
import React, { useState, useEffect } from "react";
import Video from "@/components/ip/video";
import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [ip, setIp] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [host, setHost] = useState('');
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        setIp(data.ip);
        console.log(data);
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };

    fetchIP();
  }, []);

  const copyText = () => {
    const text = "I am very sorry... You are right!"
    navigator.clipboard.writeText(text)
  }

  return (
    <main className="bg-black h-screen overflow-hidden">
      <NavBar />
      <div className="flex items-center justify-between w-full h-screen px-20 pt-20 gap-10">
        <div className="w-full h-[600px]">
          <Video />
        </div>
        <div className="w-[450px] text-center flex flex-col items-start justify-start gap-10">
          <h2 className="text-white text-4xl font-semibold">Your information:</h2>
          <ul className="h-full w-full text-white flex flex-col items-start gap-5 px-6">
            <li className="text-left w-full text-xl">
              Ip Adress: {ip}
            </li>
            {/* Andere Informationen hier anzeigen */}
          </ul>
          <Button variant={"outline"} className="w-full text-xl" size={"lg"} onClick={copyText}>
            Commit your fault 🤓
          </Button>
        </div>
      </div>
    </main>
  );
}