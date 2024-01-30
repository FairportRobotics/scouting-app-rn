import { View, Text } from "react-native";
import themes from "@/themes/themes";

interface ContainerGroupProps {
  title: string | "";
  children: any;
  style?: {};
}

const ContainerGroup: React.FC<ContainerGroupProps> = ({
  title,
  children,
  style,
}) => {
  return (
    <View style={themes.containerGroup}>
      <Text style={themes.containerGroupTitle}>{title}</Text>
      {children}
    </View>
  );
};

export default ContainerGroup;
