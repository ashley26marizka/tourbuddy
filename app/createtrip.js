import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "./firebaseconfig.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const CreateTrip = () => {
    const [tripName, setTripName] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [trips, setTrips] = useState([]);
    const [editingTrip, setEditingTrip] = useState(null);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        const querySnapshot = await getDocs(collection(db, "trips"));
        const tripsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTrips(tripsData);
    };

    const handleSaveTrip = async () => {
        if (!tripName.trim()) {
            Alert.alert("Error", "Please enter a trip name");
            return;
        }
        try {
            if (editingTrip) {
                const tripRef = doc(db, "trips", editingTrip.id);
                await updateDoc(tripRef, { name: tripName, date: Timestamp.fromDate(date) });
                setEditingTrip(null);
            } else {
                await addDoc(collection(db, "trips"), { name: tripName, date: Timestamp.fromDate(date) });
            }
            setTripName("");
            fetchTrips();
        } catch (error) {
            Alert.alert("Error", "Failed to save trip");
        }
    };

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
            <Text style={styles.header}>Manage Your Trips</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Trip Name"
                value={tripName}
                onChangeText={setTripName}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <Text style={styles.dateText}>Select Date: {date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
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
                        <Text style={styles.tripText}>{item.name} - {item.date?.toDate().toDateString()}</Text>
                        <TouchableOpacity onPress={() => { setTripName(item.name); setEditingTrip(item); }}>
                            <FontAwesome name="pencil" size={20} color="blue" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteTrip(item.id)}>
                            <FontAwesome name="trash" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: "#FFF" },
    datePickerButton: { padding: 10, backgroundColor: "#ADD8E6", borderRadius: 10, marginBottom: 10, alignItems: "center" },
    dateText: { fontSize: 16, color: "#333" },
    saveButton: { backgroundColor: "#1E90FF", padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
    saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
    tripItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFF", padding: 10, borderRadius: 10, marginBottom: 10 },
    tripText: { fontSize: 16, color: "#333" }
});

export default CreateTrip;
