import { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { apiFetch } from "../src/api";

export default function WalletScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState(0);

  async function load() {
    const bal = await apiFetch("/rewards/balance");
    setBalance(bal.balancePence / 100);
    const txs = await apiFetch("/rewards/history");
    setTransactions(txs);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleWithdraw() {
    if (amount <= 0) return;
    try {
      await apiFetch("/rewards/withdraw", {
        method: "POST",
        body: JSON.stringify({ amountPence: Math.round(amount * 100) }),
      });
      Alert.alert("Success", "Withdrawal requested.");
      load();
    } catch (e) {
      Alert.alert("Failed", (e as Error).message);
    }
  }

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Wallet</Text>
      <Text>Balance: £{balance.toFixed(2)}</Text>
      <Button title="Withdraw £1" onPress={() => { setAmount(1); handleWithdraw(); }} />
      <Text style={{ marginTop: 16, fontWeight: "bold" }}>Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 6 }}>
            <Text>
              {item.type} £{(item.amountPence / 100).toFixed(2)} {item.refType}
            </Text>
          </View>
        )}
      />
    </View>
  );
}