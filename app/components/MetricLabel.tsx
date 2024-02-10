import { Text } from "react-native";

type MetricLabelProps = {
  label: string | "";
};

export default function MetricLabel({ label }: MetricLabelProps) {
  return <Text style={{ fontSize: 14, color: "darkgray" }}>{label}</Text>;
}
