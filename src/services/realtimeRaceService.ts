import { IMeeting } from "../types/meetings";
import { IPosition } from "../types/position";
import { ISessionResults } from "../types/sessionResults";
import api from "./api";

export async function getLatestMeeting(
  meeting_key: string
): Promise<IMeeting[]> {
  const { data } = await api.get(
    `https://api.openf1.org/v1/meetings?year=2025&meeting_key=${meeting_key}`
  );
  return data;
}

export async function fetchPositions(): Promise<IPosition[]> {
  const { data } = await api.get(
    `https://api.openf1.org/v1/position?session_key=latest`
  );
  console.log("Fetched positions:", data);
  return data;
  // if (data.length > 0) lastPosDate.current = data[data.length - 1].date;
  // setPositions((prev) => mergeUpdates(prev, data, "driver_number"));
}

export async function fetchLaps() {
  const url = `https://api.openf1.org/v1/laps?session_key=latest`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  // if (data.length > 0) lastLapDate.current = data[data.length - 1].date;
  // setLaps((prev) => mergeUpdates(prev, data, "driver_number"));
}

export async function fetchPits() {
  const url = `https://api.openf1.org/v1/pit?session_key=latest`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  // if (data.length > 0) lastPitDate.current = data[data.length - 1].date;
  // setPits((prev) => {
  //   const key = (p) => `${p.driver_number}-${p.lap_number}`;
  //   const map = new Map(prev.map((p) => [key(p), p]));
  //   data.forEach((p) => map.set(key(p), p));
  //   return [...map.values()];
  // });
}

export async function fetchStints() {
  const url = `https://api.openf1.org/v1/stints?session_key=latest`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  //if (data.length > 0) lastStintDate.current = data[data.length - 1].date;
}

export async function fetchDrivers() {
  const url = `https://api.openf1.org/v1/drivers?session_key=latest`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  //setDriversInfo((prev) => mergeUpdates(prev, data, "driver_number"));
}

// function mergeUpdates(prev, updates, key) {
//   const map = new Map(prev.map((item) => [item[key], item]));
//   updates.forEach((u) => map.set(u[key], { ...map.get(u[key]), ...u }));
//   return Array.from(map.values());
// }
