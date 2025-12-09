import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { fetchPositions } from "../services/realtimeRaceService";

export default function LiveRace() {
  const [positions, setPositions] = useState([]);
  const [laps, setLaps] = useState([]);
  const [pits, setPits] = useState([]);
  const [stints, setStints] = useState([]);
  const [driversInfo, setDriversInfo] = useState([]);

  const lastPosDate = useRef(0);
  const lastLapDate = useRef(0);
  const lastPitDate = useRef(0);
  const lastStintDate = useRef(0);

  useEffect(() => {
    const i = setInterval(() => {
      console.log("Fetching positions...");
      fetchPositions();
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
      <div>Live race</div>
      {/* <div>
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
      </div> */}
    </div>
  );
}
