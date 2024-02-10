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

type ResultsButtonProps = {
  label: string;
  faIcon: "edit" | "upload" | "qr" | "share";
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  styles?: {};
  onPress: () => void;
};

export default function ResultsButton({
  label,
  faIcon,
  active,
  disabled,
  styles,
  onPress,
}: ResultsButtonProps) {
  active = active ?? true;
  disabled = disabled ?? false;

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
}
