import { memo, useState } from "react";

const MapStage = ({ data }: { data: any }) => {
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

  console.log(data.pos.split(":"));

  const [diffHeight, setDiffHeight] = useState<number>(0);
  const [diffWidth, setDiffWidth] = useState<number>(0);

  const onLoadImage = (target: any) => {
    setDiffHeight(target.target.naturalHeight / target.target.clientHeight);
    setDiffWidth(target.target.naturalWidth / target.target.clientWidth);
  };

  return (
    <div className="stage-card">
      Переход на локацию: {mapString}
      <div
        style={{
          position: "relative",
        }}
      >
        <div>
          <img
            src={mapImg}
            onLoad={(target: any) => onLoadImage(target)}
            alt={mapString}
            style={{ borderRadius: "5px", marginTop: "5px", width: "340px" }}
          />
          <img
            style={{
              position: "absolute",
              left: `${data.pos.split(":")[0] / diffWidth}px`,
              bottom: `${data.pos.split(":")[1] / diffHeight}px`,
              color: "#fff",
            }}
            alt="Метка"
            src="/quest.png"
          />
        </div>
      </div>
      <div>Позиция: {data.pos}</div>
    </div>
  );
};

export default memo(MapStage);
