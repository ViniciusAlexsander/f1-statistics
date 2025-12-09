import { useEffect, useState } from "react";
import api from "../services/api";
import { fetchDrivers } from "../services/raceResultsService";
import { IDriver } from "../types/driver";
import { IMeeting } from "../types/meetings";
import { ISessionResults } from "../types/sessionResults";

const MEETING_KEY = "latest";

export async function getLatestMeeting(
  meeting_key: string
): Promise<IMeeting[]> {
  const { data } = await api.get(
    `https://api.openf1.org/v1/meetings?year=2025&meeting_key=${meeting_key}`
  );
  return data;
}

export async function getSessionResults(
  session_key: string
): Promise<ISessionResults[]> {
  const { data } = await api.get(
    `https://api.openf1.org/v1/session_result?session_key=${session_key}`
  );
  return data;
}

export function useHomeData() {
  const [data, setData] = useState<{
    meetings: IMeeting[];
    sessionResults: { result: ISessionResults; driverInfo: IDriver }[];
  }>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getLatestMeeting(MEETING_KEY),
      getSessionResults(MEETING_KEY),
      fetchDrivers(),
    ])
      .then(([meetings, sessionResults, drivers]) => {
        if (mounted) {
          const sessionResultsWithDriverInfo = mergeDriveInfo(
            sessionResults,
            drivers
          );
          setData({ meetings, sessionResults: sessionResultsWithDriverInfo });
        }
      })
      .catch((err) => mounted && setError(err))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading, error };
}

const mergeDriveInfo = (results: ISessionResults[], drivers: IDriver[]) => {
  return results.map((result) => {
    const driverInfo = drivers.find(
      (driver) => driver.driver_number === result.driver_number
    );
    return {
      result,
      driverInfo,
    };
  });
};
