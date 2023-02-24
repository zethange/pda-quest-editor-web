export default function MapStage({ data }: { data: any }) {
  console.log(data);
  return (
    <div className="stage-card">
      Переход на локацию: {data.map}
      <div>Позиция: {data.pos}</div>
    </div>
  );
}
