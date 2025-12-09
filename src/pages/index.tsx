import { useHomeData } from "../hooks/useHomeData";

export default function Home() {
  const { data, isLoading, error } = useHomeData();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {(error as Error).message}</div>;
  if (!data || data.meetings.length === 0)
    return <div>Nenhum dado encontrado</div>;

  const { meetings, sessionResults } = data;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "grid", gap: "16px" }}>
        {meetings.map((meeting) => (
          <div
            key={meeting.meeting_key}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <h2>{meeting.meeting_name}</h2>
            <p>
              <strong>País:</strong> {meeting.country_name}
            </p>
            <p>
              <strong>Circuito:</strong> {meeting.circuit_short_name} (
              {meeting.location})
            </p>
            <p>
              <strong>Data:</strong>{" "}
              {new Date(meeting.date_start).toLocaleDateString("pt-BR")}
            </p>
            <p>
              <strong>Código:</strong> {meeting.meeting_code}
            </p>
          </div>
        ))}
      </div>
      <div>
        <h2>Resultados</h2>
        <div style={{ display: "grid", gap: "16px" }}>
          {sessionResults.map(({ driverInfo, result }) => (
            <div
              key={result.driver_number + result.position}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div>
                {result.dnf ? (
                  <p>
                    <strong>DNF</strong>
                  </p>
                ) : (
                  <strong>{result.position}</strong>
                )}
              </div>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  borderRadius: "8px",
                  backgroundColor: `#${driverInfo.team_colour}`,
                  minWidth: "40px",
                  textAlign: "center",
                }}
              >
                <strong>{driverInfo.name_acronym}</strong>
              </div>
              <p>+{result.gap_to_leader}</p>
              <p>
                <strong>Lap: {result.number_of_laps}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
