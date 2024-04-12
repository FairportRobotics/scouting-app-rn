import { Text } from "react-native";

type MetricCountProps = {
  count: number | 0;
};

export default function MetricCount({ count }: MetricCountProps) {
  return <Text style={{ fontSize: 24, fontWeight: "800" }}>{count}</Text>;
}
