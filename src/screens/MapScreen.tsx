import { MapScreenWidget } from "@/widgets/map-screen";

interface Props {
  path: string[];
  isReady: boolean;
}

const MapScreen = ({ path, isReady }: Props) => {
  return <MapScreenWidget path={path} isReady={isReady} />;
};

export default MapScreen;
