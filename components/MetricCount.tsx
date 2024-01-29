import { Text } from "react-native";

interface MetricCountProps {
  count: number | 0;
}

const MetricCount: React.FC<MetricCountProps> = ({ count }) => {
  return <Text style={{ fontSize: 24, fontWeight: "800" }}>{count}</Text>;
};

export default MetricCount;
