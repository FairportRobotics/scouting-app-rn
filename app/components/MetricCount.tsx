import { Text } from "react-native";

interface MetricCountProps {
  count: number | 0;
  style?: {};
}

const MetricCount: React.FC<MetricCountProps> = ({ count, style }) => {
  return <Text style={{ fontSize: 24, fontWeight: "800" }}>{count}</Text>;
};

export default MetricCount;
