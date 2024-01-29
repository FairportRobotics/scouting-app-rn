import { Text } from "react-native";

interface MetricLabelProps {
  label: string | "";
}

const MetricLabel: React.FC<MetricLabelProps> = ({ label }) => {
  return <Text style={{ fontSize: 14, color: "darkgray" }}>{label}</Text>;
};

export default MetricLabel;
