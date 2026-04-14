"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/navbar";
import Video from "@/components/ip/video";

export default function Home() {
  const [ip, setIp] = useState("-");
  const [city, setCity] = useState("-");
  const [country, setCountry] = useState("-");
  const [zipCode, setZipCode] = useState("-");
  const [lat, setLat] = useState("-");
  const [lon, setLon] = useState("-");
  const [host, setHost] = useState("-");
  const [buttonText, setButtonText] = useState("Commit your fault");

  useEffect(() => {
    const fetchIPDetails = async () => {
      try {
        const response = await fetch("/api/ip-info", { cache: "no-store" });
        const data = response.ok ? await response.json() : {};
        setIp(data.ip ?? "-");
        setCity(data.city ?? "-");
        setCountry(data.country ?? "-");
        setZipCode(data.zipCode ?? "-");
        setLat(data.lat ? String(data.lat) : "-");
        setLon(data.lon ? String(data.lon) : "-");
        setHost(data.host ?? "-");
      } catch (error) {
        console.error("Error fetching IP details:", error);
      }
    };

    fetchIPDetails();
  }, []);

  const copyText = () => {
    const text = "I am very sorry... You are right!";
    navigator.clipboard.writeText(text).then(() => {
      setButtonText("Copied");

      setTimeout(() => {
        setButtonText("Commit your fault");
      }, 2000);
    });
  };

  return (
    <main className="page-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <NavBar />

      <section className="content-grid">
        <div className="video-panel">
          <Video />
        </div>

        <aside className="info-panel">
          <h2>Your information</h2>

          <ul className="info-list">
            <li>
              <span>IP Address</span>
              <strong>{ip}</strong>
            </li>
            <li>
              <span>City</span>
              <strong>{city}</strong>
            </li>
            <li>
              <span>Zip Code</span>
              <strong>{zipCode}</strong>
            </li>
            <li>
              <span>Country</span>
              <strong>{country}</strong>
            </li>
            <li>
              <span>Latitude</span>
              <strong>{lat}</strong>
            </li>
            <li>
              <span>Longitude</span>
              <strong>{lon}</strong>
            </li>
            <li>
              <span>Host</span>
              <strong>{host}</strong>
            </li>
          </ul>

          <button className="primary-btn" onClick={copyText} type="button">
            {buttonText}
          </button>
        </aside>
      </section>
    </main>
  );
}
