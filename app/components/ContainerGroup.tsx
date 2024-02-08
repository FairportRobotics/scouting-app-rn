import { View, Text } from "react-native";
import Styles from "@/constants/Styles";

interface ContainerGroupProps {
  title: string | "";
  children: any;
}

const ContainerGroup: React.FC<ContainerGroupProps> = ({ title, children }) => {
  return (
    <View style={Styles.containerGroup}>
      {title && <Text style={Styles.containerGroupTitle}>{title}</Text>}
      {children}
    </View>
  );
};

export default ContainerGroup;
