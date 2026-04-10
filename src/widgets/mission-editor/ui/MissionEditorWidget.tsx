import EditMission from "@/components/Chapter/EditMission/EditMission";

interface MissionEditorWidgetProps {
  handleUpdate: () => void;
}

export function MissionEditorWidget({ handleUpdate }: MissionEditorWidgetProps) {
  return <EditMission handleUpdate={handleUpdate} />;
}
