import { View, Text } from "react-native";
import Styles from "@/constants/Styles";

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
    <View style={Styles.containerGroup}>
      {title.length > 0 && (
        <Text style={Styles.containerGroupTitle}>{title} WTFA</Text>
      )}
      {children}
    </View>
  );
};

export default ContainerGroup;
