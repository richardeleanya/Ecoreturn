import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { apiFetch, setAccessToken } from "../../src/api";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    try {
      const { accessToken } = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await SecureStore.setItemAsync("accessToken", accessToken);
      setAccessToken(accessToken);
      router.replace("/");
    } catch (e) {
      Alert.alert("Login failed", (e as Error).message);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>EcoReturn</Text>
      <Text style={{ marginVertical: 10 }}>Sign in to continue</Text>
      <TextInput
        placeholder="Email"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          width: 260,
          marginVertical: 4,
          padding: 8,
        }}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          width: 260,
          padding: 8,
          marginVertical: 4,
        }}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}