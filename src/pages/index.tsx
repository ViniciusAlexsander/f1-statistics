import { useHomeData } from "../hooks/useHomeData";

export default function Home() {
  const { data, isLoading, error } = useHomeData();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {(error as Error).message}</div>;
  if (!data || data.meetings.length === 0)
    return <div>Nenhum dado encontrado</div>;

  const { meetings, positions } = data;

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
        <h2>Posições Atuais</h2>
        <div style={{ display: "grid", gap: "16px" }}>
          {positions.map((position) => (
            <div key={position.driver_number + position.position}>
              <p>
                <strong>Número do piloto:</strong> {position.driver_number}
              </p>
              <p>
                <strong>Posição atual:</strong> {position.position}
              </p>
              <p>
                <strong>Código:</strong> {position.meeting_key}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
