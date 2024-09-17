import { Text, View, ActivityIndicator } from "react-native";

export default function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Loading...</Text>
      <ActivityIndicator size="large" color="#ffa50a" />
    </View>
  );
}
