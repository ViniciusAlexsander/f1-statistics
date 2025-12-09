import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  const [positions, setPositions] = useState([]);
  const [laps, setLaps] = useState([]);
  const [pits, setPits] = useState([]);
  const [stints, setStints] = useState([]);
  const [driversInfo, setDriversInfo] = useState([]);

  const lastPosDate = useRef(0);
  const lastLapDate = useRef(0);
  const lastPitDate = useRef(0);
  const lastStintDate = useRef(0);

  async function fetchPositions() {
    const url = `https://api.openf1.org/v1/position?session_key=latest`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    if (data.length > 0) lastPosDate.current = data[data.length - 1].date;
    setPositions((prev) => mergeUpdates(prev, data, "driver_number"));
  }

  async function fetchLaps() {
    const url = `https://api.openf1.org/v1/laps?session_key=latest`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    if (data.length > 0) lastLapDate.current = data[data.length - 1].date;
    setLaps((prev) => mergeUpdates(prev, data, "driver_number"));
  }

  async function fetchPits() {
    const url = `https://api.openf1.org/v1/pit?session_key=latest`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    if (data.length > 0) lastPitDate.current = data[data.length - 1].date;
    setPits((prev) => {
      const key = (p) => `${p.driver_number}-${p.lap_number}`;
      const map = new Map(prev.map((p) => [key(p), p]));
      data.forEach((p) => map.set(key(p), p));
      return [...map.values()];
    });
  }

  async function fetchStints() {
    const url = `https://api.openf1.org/v1/stints?session_key=latest`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    if (data.length > 0) lastStintDate.current = data[data.length - 1].date;
    setStints((prev) => mergeUpdates(prev, data, "driver_number"));
  }

  async function fetchDrivers() {
    const url = `https://api.openf1.org/v1/drivers?session_key=latest`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    setDriversInfo((prev) => mergeUpdates(prev, data, "driver_number"));
  }

  function mergeUpdates(prev, updates, key) {
    const map = new Map(prev.map((item) => [item[key], item]));
    updates.forEach((u) => map.set(u[key], { ...map.get(u[key]), ...u }));
    return Array.from(map.values());
  }

  useEffect(() => {
    const i = setInterval(() => {
      fetchPositions();
      fetchLaps();
      fetchPits();
      fetchStints();
      fetchDrivers();
    }, 10000);
    return () => clearInterval(i);
  }, []);

  function getDriverInfo(driverNumber) {
    const pos = positions.find((p) => p.driver_number === driverNumber);
    const lap = laps.find((l) => l.driver_number === driverNumber);
    const stint = stints.find((s) => s.driver_number === driverNumber);
    const driver = driversInfo.find((d) => d.driver_number === driverNumber);

    return {
      position: pos?.position,
      lapNumber: lap?.lap_number,
      lapTime: lap?.lap_duration,
      pitCount: pits.filter((p) => p.driver_number === driverNumber).length,
      tyreCompound: stint?.tyre_compound || stint?.compound || "-",
      tyreAge: stint?.tyre_age || "-",
      nickname: driver?.name_acronym || driver?.broadcast_name || "-",
    };
  }

  const drivers = [...new Set([...positions.map((p) => p.driver_number)])].sort(
    (a, b) => {
      const posA =
        positions.find((p) => p.driver_number === a)?.position ?? Infinity;
      const posB =
        positions.find((p) => p.driver_number === b)?.position ?? Infinity;
      return posA - posB;
    }
  );

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {drivers.map((driver) => {
        const info = getDriverInfo(driver);
        return (
          <motion.div
            key={driver}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-2">
                  Driver #{driver} — {info.nickname}
                </h2>
                <p>
                  <strong>Position:</strong> {info.position ?? "-"}
                </p>
                <p>
                  <strong>Current Lap:</strong> {info.lapNumber ?? "-"}
                </p>
                <p>
                  <strong>Lap Time:</strong>{" "}
                  {typeof info.lapTime === "number"
                    ? info.lapTime.toFixed(3) + "s"
                    : "-"}
                </p>
                <p>
                  <strong>Pit Stops:</strong> {info.pitCount}
                </p>
                <p>
                  <strong>Tyre Compound:</strong> {info.tyreCompound}
                </p>
                <p>
                  <strong>Tyre Age:</strong> {info.tyreAge} laps
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
