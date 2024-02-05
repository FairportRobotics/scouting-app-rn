import { Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCloudArrowUp,
  faQrcode,
  faShareFromSquare,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import themes from "@/app/themes/themes";

interface ActionButtonProps {
  label: string | "";
  faIcon: "edit" | "upload" | "qr" | "share";
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  faIcon,
  onPress,
}) => {
  const iconLookup = {
    edit: faEdit,
    upload: faCloudArrowUp,
    qr: faQrcode,
    share: faShareFromSquare,
  };

  return (
    <TouchableOpacity
      style={[themes.baseButton, { flex: 1, flexDirection: "row", gap: 8 }]}
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

export default ActionButton;
