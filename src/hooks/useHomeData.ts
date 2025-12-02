import { useEffect, useState } from "react";
import api from "../services/api";
import { IMeeting } from "../types/meetings";
import { IPosition } from "../types/position";

const MEETING_KEY = "latest";

export async function getLatestMeeting(
  meeting_key: string
): Promise<IMeeting[]> {
  const { data } = await api.get(
    `https://api.openf1.org/v1/meetings?year=2025&meeting_key=${meeting_key}`
  );
  return data;
}

export async function getLatestPosition(
  meeting_key: string
): Promise<IPosition[]> {
  const { data } = await api.get(
    `https://api.openf1.org/v1/position?meeting_key=${meeting_key}`
  );
  return data;
}

export function useHomeData() {
  const [data, setData] = useState<{
    meetings: IMeeting[];
    positions: IPosition[];
  }>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([getLatestMeeting(MEETING_KEY), getLatestPosition(MEETING_KEY)])
      .then(([meetings, positions]) => {
        if (mounted) {
          setData({ meetings, positions });
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
