import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCloudArrowUp,
  faQrcode,
  faShareFromSquare,
  faEdit,
  faCloud,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";

type ResultsButtonProps = {
  label: string;
  faIcon: "edit" | "upload" | "qr" | "share" | "json";
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  showUploadExists?: boolean | false;
  onPress: () => void;
};

export default function ResultsButton({
  label,
  faIcon,
  active,
  disabled,
  showUploadExists,
  onPress,
}: ResultsButtonProps) {
  active = active ?? true;
  disabled = disabled ?? false;

  const iconLookup = {
    edit: faEdit,
    upload: faCloudArrowUp,
    qr: faQrcode,
    share: faShareFromSquare,
    json: faMagnifyingGlass,
  };

  const renderBadge = () => {
    if (showUploadExists) {
      return (
        <View
          style={{
            zIndex: 100,
            position: "absolute",
            top: -2,
            right: -2,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: Colors.uploaded,
            borderWidth: 2,
            borderColor: Colors.uploaded,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={faCloud}
            size={18}
            style={{
              color: "white",
            }}
          />
        </View>
      );
    } else {
      return <></>;
    }
  };

  if (disabled) {
    return (
      <View
        style={[
          Styles.baseButton,
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
        {
          flex: 1,
          flexDirection: "row",
          gap: 8,
          backgroundColor: active ? Colors.primary : Colors.secondary,
        },
      ]}
      onPress={() => onPress()}
    >
      {renderBadge()}
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
