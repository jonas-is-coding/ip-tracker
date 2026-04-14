import { NextRequest, NextResponse } from "next/server";

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

function isPublicIp(ip: string): boolean {
  const value = ip.trim().toLowerCase();
  if (!value || value === "unknown" || value === "::1" || value === "127.0.0.1") {
    return false;
  }

  if (value.startsWith("10.") || value.startsWith("192.168.") || value.startsWith("169.254.")) {
    return false;
  }

  if (value.startsWith("172.")) {
    const second = Number(value.split(".")[1]);
    if (second >= 16 && second <= 31) {
      return false;
    }
  }

  if (value === "::ffff:127.0.0.1" || value === "::ffff:0:1") {
    return false;
  }

  return true;
}

function extractClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first && isPublicIp(first)) {
      return first;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp && isPublicIp(realIp)) {
    return realIp.trim();
  }

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && isPublicIp(cfIp)) {
    return cfIp.trim();
  }

  return "";
}

async function fetchJson(url: string): Promise<unknown | null> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "ip-tracker/1.0",
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function fetchFromIpApiCo(ip: string): Promise<IpInfo | null> {
  const endpoint = ip ? `https://ipapi.co/${encodeURIComponent(ip)}/json/` : "https://ipapi.co/json/";
  const data = await fetchJson(endpoint);

  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (record.error) {
    return null;
  }

  return {
    ip: toText(record.ip ?? ip),
    city: toText(record.city),
    country: toText(record.country_name),
    zipCode: toText(record.postal),
    lat: toText(record.latitude),
    lon: toText(record.longitude),
    host: toText(record.org),
  };
}

async function fetchFromIpWhoIs(ip: string): Promise<IpInfo | null> {
  const endpoint = ip ? `https://ipwho.is/${encodeURIComponent(ip)}` : "https://ipwho.is/";
  const data = await fetchJson(endpoint);

  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (record.success === false) {
    return null;
  }

  const connection =
    typeof record.connection === "object" && record.connection !== null
      ? (record.connection as Record<string, unknown>)
      : null;

  return {
    ip: toText(record.ip ?? ip),
    city: toText(record.city),
    country: toText(record.country),
    zipCode: toText(record.postal),
    lat: toText(record.latitude),
    lon: toText(record.longitude),
    host: toText(connection?.isp),
  };
}

export async function GET(request: NextRequest) {
  const clientIp = extractClientIp(request);

  try {
    const primary = await fetchFromIpApiCo(clientIp);
    if (primary) {
      return NextResponse.json(primary, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const fallback = await fetchFromIpWhoIs(clientIp);
    if (fallback) {
      return NextResponse.json(fallback, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json(
      {
        ...EMPTY_INFO,
        ip: clientIp || "-",
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch {
    return NextResponse.json(
      {
        ...EMPTY_INFO,
        ip: clientIp || "-",
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
