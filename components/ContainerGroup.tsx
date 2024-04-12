import { View, Text } from "react-native";
import Styles from "@/constants/Styles";

type ContainerGroupProps = {
  title: string | "";
  children: any;
};

export default function ContainerGroup({
  title,
  children,
}: ContainerGroupProps) {
  return (
    <View style={Styles.containerGroup}>
      {title && <Text style={Styles.containerGroupTitle}>{title}</Text>}
      {children}
    </View>
  );
}
