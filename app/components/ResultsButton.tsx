import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCloudArrowUp,
  faQrcode,
  faShareFromSquare,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";

interface ResultsButtonProps {
  label: string | "";
  faIcon: "edit" | "upload" | "qr" | "share";
  active?: boolean | true;
  disabled?: boolean | false;
  styles?: {};
  onPress: () => void;
}

const ResultsButton: React.FC<ResultsButtonProps> = ({
  label,
  faIcon,
  active,
  disabled,
  styles,
  onPress,
}) => {
  const iconLookup = {
    edit: faEdit,
    upload: faCloudArrowUp,
    qr: faQrcode,
    share: faShareFromSquare,
  };

  if (disabled) {
    return (
      <View
        style={[
          Styles.baseButton,
          styles,
          {
            flex: 1,
            flexDirection: "row",
            gap: 8,
            backgroundColor: "darkgray",
          },
        ]}
      >
        <FontAwesomeIcon
          icon={iconLookup[faIcon]}
          size={32}
          style={{ color: "lightgray" }}
        />
        <Text style={{ color: "lightgray", fontSize: 18, fontWeight: "bold" }}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        Styles.baseButton,
        styles,
        {
          flex: 1,
          flexDirection: "row",
          gap: 8,
          backgroundColor: active ? Colors.primary : Colors.secondary,
        },
      ]}
      onPress={() => onPress()}
    >
      <FontAwesomeIcon
        icon={iconLookup[faIcon]}
        size={32}
        style={{ color: "white" }}
      />
      <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default ResultsButton;
