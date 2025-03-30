import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet,Pressable,ScrollView } from "react-native";
//import DateTimePicker from "@react-native-community/datetimepicker";
import Geolocation from "react-native-geolocation-service";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import axios from "axios";
import { StackActions } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const PlanTrip = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Set Dates");
  const [location, setLocation] = useState("Fetching location...");
  const [weather, setWeather] = useState("Fetching weather...");
  const navigation = useNavigation(); // Hook to access navigation
  const router = useRouter(); 
  // Request location permission and fetch the current location
  useEffect(() => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
      if (result === RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation(`📍 ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            fetchWeather(latitude, longitude);
          },
          (error) => setLocation("Location unavailable"),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        setLocation("Permission denied");
      }
    });
  }, []);

  // Fetch weather data
  const fetchWeather = async (lat, lon) => {
    const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your API key
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeather(`🌤 ${response.data.main.temp}°C, ${response.data.weather[0].description}`);
    } catch (error) {
      setWeather("Weather data unavailable");
    }
  };
  const [tripName, setTripName] = useState('');


  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Plan Your Trip</Text>

      {/* Trip Name Input */}
      <View style={{ marginTop: 10 ,padding:20,borderColor:"white",}}>
            <TextInput
              value={tripName}
              onChangeText={(text) => setTripName(text)}
              style={{ fontSize: 25, fontWeight: 'bold', color: '#c19d6',borderColor:"white" }}
              placeholderTextColor="#c19d6"
              placeholder="Trip Name"
            />
          </View>

      {/* Calendar Icon + Itinerary Box */}
      <TouchableOpacity style={styles.box} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.boxText}>📅 Itinerary</Text>
        <Text style={styles.subText}>{selectedDate}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date.toDateString());
          }}
        />
      )}

      {/* Current Location Box */}
      <View style={styles.box}>
        <Text style={styles.boxText}>🌍 TimeZone</Text>
        <Text style={styles.subText}>{location}</Text>
      </View>

      {/* Weather Forecast Box (Replacing "Choose Image") */}
      <View style={styles.box}>
        <Text style={styles.boxText}>🌤 Weather</Text>
        <Text style={styles.subText}>{weather}</Text>
      </View>
      <View style={styles.box}>
      <Pressable onPress={() => router.push('/newpage')}>
        <Text style={styles.boxText}>🧳To pack</Text>
        <Text style={styles.subText}> Add items </Text>
        </Pressable>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
                 
        <Pressable style={styles.button} onPress={() => router.push('/trip')}>
        <Text style={styles.buttonText}>Create</Text>
        </Pressable>
                    
      </View>
    </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  box: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3, // Shadow effect
  },
  boxText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  
});

export default PlanTrip;