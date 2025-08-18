import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { apiFetch } from "../src/api";

export default function LocationsScreen() {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/locations/nearby?lat=51.51&lng=-0.12&radiusKm=10")
      .then(setLocations)
      .catch(() => setLocations([]));
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 22 }}>Nearby Collection Points</Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 6 }}>
            <Text>{item.name}</Text>
            <Text>{item.address}, {item.city}</Text>
          </View>
        )}
      />
    </View>
  );
}