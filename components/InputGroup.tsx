import { View, Text } from "react-native";
import themes from "@/themes/themes";

interface InputGroupProps {
  title: string | "";
  children: any;
  style?: {};
}

const InputGroup: React.FC<InputGroupProps> = ({ title, children, style }) => {
  return (
    <View style={themes.inputGroup}>
      <Text style={themes.containerGroupTitle}>{title}</Text>
      {children}
    </View>
  );
};

export default InputGroup;
