import { map } from "d3-array";

export default function MapStage({ data }: { data: any }) {
  let mapString: string = "загрузка...";
  let mapImg: string = "https://files.artux.net";

  if (data?.map === "0") {
    mapString = "Ч-4";
    mapImg = "https://files.artux.net/static/maps/map_ch_4.png";
  } else if (data?.map === "1") {
    mapString = "Кордоне";
    mapImg = "https://files.artux.net/static/maps/map_escape.png";
  } else if (data?.map === "2") {
    mapString = "Свалка";
    mapImg = "https://files.artux.net/static/maps/map_garbage.png";
  } else if (data?.map === "3") {
    mapString = "Бар";
    mapImg = "https://files.artux.net/static/maps/map_bar.png";
  } else if (data?.map === "4") {
    mapString = "Дикая территория";
  } else if (data?.map === "5") {
    mapString = "Темная долина";
    mapImg = "https://files.artux.net/static/maps/map_darkvalley.png";
  } else if (data?.map === "6") {
    mapString = "Янтарь";
    mapImg = "https://files.artux.net/static/maps/map_yantar.png";
  } else if (data?.map === "7") {
    mapString = "Армейские склады";
    mapImg = "https://files.artux.net/static/maps/map_military.png";
  } else if (data?.map === "8") {
    mapString = "НИИ Агропром";
    mapImg = "https://files.artux.net/static/maps/map_agroprom.png";
  }

  return (
    <div className="stage-card">
      Переход на локацию: {mapString}
      <div>
        <img
          src={mapImg}
          alt={mapString}
          style={{ width: "340px", borderRadius: "5px", marginTop: "5px" }}
        />
      </div>
      <div>Позиция: {data.pos}</div>
    </div>
  );
}
