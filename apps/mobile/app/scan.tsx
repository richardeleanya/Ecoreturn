import { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { apiFetch, uploadPhoto } from "../src/api";
import * as Device from "expo-device";

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  async function handleBarCodeScanned({ type, data }: any) {
    setScanned(true);
    // Preview: validate product
    const { eligible, rewardPence } = await apiFetch("/scan/validate", {
      method: "POST",
      body: JSON.stringify({ barcode: data }),
    });
    if (!eligible) {
      Alert.alert("Not eligible", "This product is not eligible.");
      setScanned(false);
      return;
    }
    // Pick/capture photo
    let photo: any = null;
    const res = await ImagePicker.launchCameraAsync({ base64: false });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      photo = res.assets[0];
    } else {
      Alert.alert("Photo required", "Please capture a photo.");
      setScanned(false);
      return;
    }
    // Upload photo
    const photoMeta = await uploadPhoto(photo);
    // Get location
    const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
    if (locStatus !== "granted") {
      Alert.alert("Location required", "Please enable location.");
      setScanned(false);
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    // DeviceId
    const deviceId = Device.osBuildId || "simulator";
    // Submit return
    await apiFetch("/returns/create", {
      method: "POST",
      body: JSON.stringify({
        barcode: data,
        photoId: photoMeta.id,
        gpsLat: loc.coords.latitude,
        gpsLng: loc.coords.longitude,
        deviceId,
      }),
    });
    Alert.alert("Success", `Return submitted! Reward: £${(rewardPence / 100).toFixed(2)}`);
    setScanned(false);
  }

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera. Please enable in settings.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}