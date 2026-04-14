import { NextResponse } from "next/server";

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

function toText(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }
  const text = String(value).trim();
  return text.length > 0 ? text : "-";
}

async function fetchFromIpApiCo(): Promise<IpInfo | null> {
  const response = await fetch("https://ipapi.co/json/", {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return {
    ip: toText(data.ip),
    city: toText(data.city),
    country: toText(data.country_name),
    zipCode: toText(data.postal),
    lat: toText(data.latitude),
    lon: toText(data.longitude),
    host: toText(data.org),
  };
}

async function fetchFromIpWhoIs(): Promise<IpInfo | null> {
  const response = await fetch("https://ipwho.is/", {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (data.success === false) {
    return null;
  }

  return {
    ip: toText(data.ip),
    city: toText(data.city),
    country: toText(data.country),
    zipCode: toText(data.postal),
    lat: toText(data.latitude),
    lon: toText(data.longitude),
    host: toText(data.connection?.isp),
  };
}

export async function GET() {
  try {
    const primary = await fetchFromIpApiCo();
    if (primary) {
      return NextResponse.json(primary, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const fallback = await fetchFromIpWhoIs();
    if (fallback) {
      return NextResponse.json(fallback, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json(EMPTY_INFO, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(EMPTY_INFO, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
