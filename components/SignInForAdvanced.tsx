import { useState } from "react";
import { Button, View, TextInput, Text } from "react-native";
import ContainerGroup from "@/components/ContainerGroup";
import Styles from "@/constants/Styles";
import * as Crypto from "expo-crypto";

type SignInForAdvancedProps = {
  onSuccessfulSignin: () => void;
};

export default function SignInForAdvanced({
  onSuccessfulSignin,
}: SignInForAdvancedProps) {
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    if (
      digest ==
      "dd623bac2553c8bfbce4f42a8bd994e12729ad530dc7108bfab97ff84a2c6858"
    )
      onSuccessfulSignin();
  };

  return (
    <View style={{ padding: 10 }}>
      <ContainerGroup title="The Blue Alliance Caches">
        <Text>Enter admin password below to access advanced functions</Text>
        <TextInput
          onChangeText={setPassword}
          style={[Styles.textInput, { width: "50%" }]}
          value={password}
          textContentType="password"
          secureTextEntry={true}
          placeholder="Password"
          keyboardType="default"
        />
        <Button title="Sign in" onPress={handleSignIn} />
      </ContainerGroup>
    </View>
  );
}
