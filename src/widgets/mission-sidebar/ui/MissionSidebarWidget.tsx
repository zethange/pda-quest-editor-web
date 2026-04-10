import EditMissionSideBar from "@/components/Chapter/EditMission/EditMissionSideBar";

interface MissionSidebarWidgetProps {
  handleUpdate: () => void;
}

export function MissionSidebarWidget({ handleUpdate }: MissionSidebarWidgetProps) {
  return <EditMissionSideBar handleUpdate={handleUpdate} />;
}
