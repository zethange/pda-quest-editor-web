import { useParams } from "react-router-dom";

const Story = () => {
  const { id } = useParams();
  return <div>{id}</div>;
};

export default Story;
