import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  Alert, StyleSheet, Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { db } from "./firebaseconfig"; // Update path if needed
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp
} from "firebase/firestore";

// Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CreateTrip = () => {
  const [tripName, setTripName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);

  useEffect(() => {
    requestNotificationPermission();
    fetchTrips();
  }, []);

  // Request Notification Permission
  const requestNotificationPermission = async () => {
    if (Device.isDevice) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please enable notifications.");
      }
    } else {
      Alert.alert("Must use physical device for notifications");
    }
  };

  // Fetch trips from Firestore
  const fetchTrips = async () => {
    const querySnapshot = await getDocs(collection(db, "trips"));
    const tripsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTrips(tripsData);
  };

  // Schedule Notification 1 hour before trip
  const scheduleTripNotification = async (tripTime, place) => {
    const notificationTime = new Date(tripTime.getTime() - 60 * 60 * 1000); // 1 hour before
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Tour Buddy 🧳",
        body: `Your trip to ${place} starts in 1 hour! Get ready!`,
        sound: true,
      },
      trigger: notificationTime,
    });
  };

  // Save or update trip in Firestore
  const handleSaveTrip = async () => {
    if (!tripName.trim()) {
      Alert.alert("Enter a trip name");
      return;
    }

    if (date <= new Date()) {
      Alert.alert("Pick a future date and time");
      return;
    }

    try {
      if (editingTrip) {
        const tripRef = doc(db, "trips", editingTrip.id);
        await updateDoc(tripRef, {
          name: tripName,
          date: Timestamp.fromDate(date),
        });
        setEditingTrip(null);
      } else {
        await addDoc(collection(db, "trips"), {
          name: tripName,
          date: Timestamp.fromDate(date),
        });
        await scheduleTripNotification(date, tripName);
      }

      setTripName("");
      fetchTrips();
    } catch (error) {
      Alert.alert("Error", "Failed to save trip");
    }
  };

  // Delete trip from Firestore
  const handleDeleteTrip = async (id) => {
    try {
      await deleteDoc(doc(db, "trips", id));
      fetchTrips();
    } catch (error) {
      Alert.alert("Error", "Failed to delete trip");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create & Manage Your Trips 🧳</Text>

      <TextInput
        placeholder="Enter Trip Name"
        value={tripName}
        onChangeText={setTripName}
        style={styles.input}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
        <Text style={styles.dateText}>Select Date: {date.toLocaleString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTrip}>
        <Text style={styles.saveButtonText}>{editingTrip ? "Update Trip" : "Save Trip"}</Text>
      </TouchableOpacity>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tripItem}>
            <Text style={styles.tripText}>
              {item.name} - {item.date?.toDate().toLocaleString()}
            </Text>
            <View style={styles.icons}>
              <TouchableOpacity onPress={() => {
                setTripName(item.name);
                setDate(item.date.toDate());
                setEditingTrip(item);
              }}>
                <FontAwesome name="pencil" size={20} color="blue" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTrip(item.id)}>
                <FontAwesome name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 10,
    padding: 10, marginBottom: 10, backgroundColor: "#FFF"
  },
  datePickerButton: {
    padding: 10, backgroundColor: "#ADD8E6",
    borderRadius: 10, marginBottom: 10, alignItems: "center"
  },
  dateText: { fontSize: 16, color: "#333" },
  saveButton: {
    backgroundColor: "#1E90FF", padding: 12,
    borderRadius: 10, alignItems: "center", marginBottom: 10
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  tripItem: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", backgroundColor: "#FFF",
    padding: 10, borderRadius: 10, marginBottom: 10
  },
  tripText: { fontSize: 16, color: "#333", flex: 1 },
  icons: { flexDirection: "row", gap: 10 },
  icon: { marginRight: 10 },
});

export default CreateTrip;
