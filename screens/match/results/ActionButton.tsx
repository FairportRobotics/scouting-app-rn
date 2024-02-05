import { Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCloudArrowUp,
  faQrcode,
  faShareFromSquare,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import themes from "@/themes/themes";

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
  //   const iconLookup = (icon) => {
  //     console.log("iconLookup icon:", icon, "wtf");
  //     switch (icon) {
  //       case "pencil":
  //         return faEdit;
  //       case "upload":
  //         console.log("switch upload");
  //         return faCloudArrowUp;
  //       case "qr":
  //         return faQrcode;
  //       case "share":
  //         return faShareFromSquare;
  //       default:
  //         return faEdit;
  //     }
  //   };

  const iconLookup = {
    edit: faEdit,
    upload: faCloudArrowUp,
    qr: faQrcode,
    share: faCloudArrowUp,
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
