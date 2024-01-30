import { Text } from "react-native";

interface MetricLabelProps {
  label: string | "";
  style?: {};
}

const MetricLabel: React.FC<MetricLabelProps> = ({ label, style }) => {
  return <Text style={{ fontSize: 14, color: "darkgray" }}>{label}</Text>;
};

export default MetricLabel;
