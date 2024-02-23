import { useState } from "react";
import { Button, View, TextInput, Text } from "react-native";
import ContainerGroup from "@/app/components/ContainerGroup";
import Styles from "@/constants/Styles";

type SignInForAdvancedProps = {
  onSuccessfulSignin: () => void;
};

// Lame but the crypto libraries with React Native support are seriously lacking.
const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export default function SignInForAdvanced({
  onSuccessfulSignin,
}: SignInForAdvancedProps) {
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (cyrb53(password) == 6919830735668275) onSuccessfulSignin();
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
