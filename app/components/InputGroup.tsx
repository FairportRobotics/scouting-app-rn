import { View, Text } from "react-native";
import Styles from "@/constants/Styles";

interface InputGroupProps {
  title: string | "";
  children: any;
  style?: {};
}

const InputGroup: React.FC<InputGroupProps> = ({ title, children, style }) => {
  return (
    <View style={Styles.inputGroup}>
      <Text style={Styles.labelText}>{title}</Text>
      {children}
    </View>
  );
};

export default InputGroup;
