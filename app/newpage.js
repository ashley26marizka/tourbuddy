import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function NewPage() {
  const [item, setItem] = useState('');
  const [packingList, setPackingList] = useState([]);

  const addItem = () => {
    if (item.trim()) {
      setPackingList([...packingList, item]);
      setItem('');
    }
  };

  return (
     <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>To Pack</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter item..."
        value={item}
        onChangeText={setItem}multiline
      />
      <Pressable style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </Pressable>
      <FlatList
        data={packingList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
      />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding:15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listItem: {
    fontSize: 18,
    padding: 5,
  },
});
