import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

export default StyleSheet.create({
  app: {
    backgroundColor: Colors.appBackground,
    flex: 1,
    padding: 20,
  },

  text: { fontSize: 20 },
  textSubscript: { fontSize: 18 },
  textSuperscript: { fontSize: 24 },

  containerGroup: {
    backgroundColor: Colors.containerBackground,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  inputGroup: {
    backgroundColor: Colors.containerBackground,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  containerGroupTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  baseButton: {
    borderRadius: 8,
    backgroundColor: Colors.primary,
    color: "white",
    fontWeight: "900",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    minWidth: 50,
  },
  minusPlusButton: {
    borderRadius: 8,
    backgroundColor: Colors.primary,
    color: "white",
    fontWeight: "900",
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    height: 50,
  },
  labelText: {
    fontSize: 20,
  },
  allianceBlueButton: {
    borderRadius: 8,
    backgroundColor: Colors.allianceBlue,
    fontWeight: "900",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
  },
  allianceRedButton: {
    borderRadius: 8,
    backgroundColor: Colors.allianceRed,
    fontWeight: "900",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
  },
  textInput: {
    width: "100%",
    fontSize: 20,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "darkgray",
  },

  optionGroupDefault: {
    backgroundColor: Colors.textDisabled,
  },
  optionGroupActive: {
    backgroundColor: Colors.primary,
  },
});
