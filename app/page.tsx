"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/navbar";
import Video from "@/components/ip/video";

const intelRows = [
  { label: "IP", key: "ip" },
  { label: "CITY", key: "city" },
  { label: "ZIP", key: "zipCode" },
  { label: "COUNTRY", key: "country" },
  { label: "LAT", key: "lat" },
  { label: "LON", key: "lon" },
  { label: "HOST", key: "host" },
] as const;

type IpInfo = {
  ip: string;
  city: string;
  country: string;
  zipCode: string;
  lat: string;
  lon: string;
  host: string;
};

const EMPTY_INFO: IpInfo = {
  ip: "-",
  city: "-",
  country: "-",
  zipCode: "-",
  lat: "-",
  lon: "-",
  host: "-",
};

function normalizeInfo(data: Partial<IpInfo> | null | undefined): IpInfo {
  return {
    ip: data?.ip?.trim() || "-",
    city: data?.city?.trim() || "-",
    country: data?.country?.trim() || "-",
    zipCode: data?.zipCode?.trim() || "-",
    lat: data?.lat?.trim() || "-",
    lon: data?.lon?.trim() || "-",
    host: data?.host?.trim() || "-",
  };
}

function hasUsefulInfo(data: IpInfo): boolean {
  return Object.values(data).some((value) => value !== "-");
}

export default function Home() {
  const [info, setInfo] = useState<IpInfo>(EMPTY_INFO);
  const [buttonText, setButtonText] = useState("COPY APOLOGY");

  useEffect(() => {
    const fetchIPDetails = async () => {
      const applyInfo = (data: Partial<IpInfo> | null | undefined) => {
        setInfo(normalizeInfo(data));
      };

      const fetchJson = async (input: string) => {
        const response = await fetch(input, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Request failed for ${input}`);
        }
        return response.json();
      };

      try {
        const internalData = normalizeInfo(await fetchJson("/api/ip-info"));
        if (hasUsefulInfo(internalData)) {
          setInfo(internalData);
          return;
        }
      } catch (error) {
        console.error("Error fetching internal IP details:", error);
      }

      try {
        const publicIpData = await fetchJson("https://api.ipify.org?format=json");
        const publicIp =
          typeof publicIpData?.ip === "string" ? publicIpData.ip.trim() : "";

        if (!publicIp) {
          applyInfo(null);
          return;
        }

        try {
          const lookup = await fetchJson(`https://ipwho.is/${encodeURIComponent(publicIp)}`);
          if (lookup?.success !== false) {
            applyInfo({
              ip: publicIp,
              city: typeof lookup?.city === "string" ? lookup.city : "-",
              country: typeof lookup?.country === "string" ? lookup.country : "-",
              zipCode: typeof lookup?.postal === "string" ? lookup.postal : "-",
              lat:
                lookup?.latitude !== undefined && lookup?.latitude !== null
                  ? String(lookup.latitude)
                  : "-",
              lon:
                lookup?.longitude !== undefined && lookup?.longitude !== null
                  ? String(lookup.longitude)
                  : "-",
              host:
                typeof lookup?.connection?.isp === "string"
                  ? lookup.connection.isp
                  : "-",
            });
            return;
          }
        } catch (error) {
          console.error("Error fetching ipwho.is details:", error);
        }

        try {
          const fallbackLookup = await fetchJson(`https://ipapi.co/${encodeURIComponent(publicIp)}/json/`);
          applyInfo({
            ip: publicIp,
            city: typeof fallbackLookup?.city === "string" ? fallbackLookup.city : "-",
            country:
              typeof fallbackLookup?.country_name === "string"
                ? fallbackLookup.country_name
                : "-",
            zipCode: typeof fallbackLookup?.postal === "string" ? fallbackLookup.postal : "-",
            lat:
              fallbackLookup?.latitude !== undefined && fallbackLookup?.latitude !== null
                ? String(fallbackLookup.latitude)
                : "-",
            lon:
              fallbackLookup?.longitude !== undefined && fallbackLookup?.longitude !== null
                ? String(fallbackLookup.longitude)
                : "-",
            host: typeof fallbackLookup?.org === "string" ? fallbackLookup.org : "-",
          });
          return;
        } catch (error) {
          console.error("Error fetching ipapi.co details:", error);
        }

        applyInfo({ ip: publicIp });
      } catch (error) {
        console.error("Error fetching IP details:", error);
        applyInfo(null);
      }
    };

    fetchIPDetails();
  }, []);

  const copyText = () => {
    const text = "I am very sorry. You were right.";
    navigator.clipboard.writeText(text).then(() => {
      setButtonText("COPIED");

      setTimeout(() => {
        setButtonText("COPY APOLOGY");
      }, 2000);
    });
  };

  return (
    <main className="page-shell">
      <div className="page-noise" />
      <NavBar />

      <section className="tracker-grid">
        <div className="video-panel">
          <Video />
        </div>

        <aside className="intel-panel">
          <ul className="intel-list">
            {intelRows.map((row) => (
              <li key={row.key}>
                <span>{row.label}</span>
                <strong>{info[row.key]}</strong>
              </li>
            ))}
          </ul>

          <button className="primary-btn" onClick={copyText} type="button">
            {buttonText}
          </button>
        </aside>
      </section>
    </main>
  );
}
