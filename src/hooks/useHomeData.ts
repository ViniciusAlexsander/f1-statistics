import { useEffect, useState } from "react";
import api from "../services/api";
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
    sessionResults: ISessionResults[];
  }>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([getLatestMeeting(MEETING_KEY), getSessionResults(MEETING_KEY)])
      .then(([meetings, sessionResults]) => {
        if (mounted) {
          setData({ meetings, sessionResults });
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
