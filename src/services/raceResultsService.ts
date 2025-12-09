import { IDriver } from "../types/driver";
import { ISessionResults } from "../types/sessionResults";
import api from "./api";

export async function getSessionResults(
  session_key: string
): Promise<ISessionResults[]> {
  const { data } = await api.get(
    `https://api.openf1.org/v1/session_result?session_key=${session_key}`
  );
  return data;
}

export async function fetchDrivers(): Promise<IDriver[]> {
  const { data } = await api.get(
    `https://api.openf1.org/v1/drivers?session_key=latest`
  );
  return data;
}
