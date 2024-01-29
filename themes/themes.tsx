import { StyleSheet } from "react-native";

export default StyleSheet.create({
  app: {
    backgroundColor: "#F4F4F4",
    flex: 1,
    padding: 20,
  },
  containerGroup: {
    backgroundColor: "white",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  containerGroupTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  minusPlusButton: {
    borderRadius: 8,
    backgroundColor: "orange",
    color: "white",
    fontWeight: "900",
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    height: 50,
  },
});
