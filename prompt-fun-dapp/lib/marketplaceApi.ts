const API_BASE = "http://localhost:8000/api/marketplace";

export async function storeLaunchedToken(token: {
  symbol: string;
  name: string;
  tx_hash: string;
  creator?: string;
  supply?: number;
  base_price?: number;
}) {
  const res = await fetch(`${API_BASE}/launch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(token),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function fetchLaunchedTokens() {
  const res = await fetch(`${API_BASE}/launched`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function fetchLaunchedToken(symbol: string) {
  const res = await fetch(`${API_BASE}/launched/${symbol}`);
  if (!res.ok) return null;
  return await res.json();
} 