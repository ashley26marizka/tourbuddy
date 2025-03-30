import React from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import { StackActions } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
export default function HomeScreen() {
  const navigation = useNavigation(); // Hook to access navigation
  const router = useRouter(); 
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View
          style={{
            padding: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderColor:'skyblue',
          }}>
               <Pressable onPress={() => router.push('/login')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
      </View>
        {/* App Title */}
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>MyTrip</Text>
        </View>

        {/* Year Display */}
        <View style={styles.yearWrapper}>
          <Text style={styles.yearText}>2025</Text>
        </View>

        {/* Home Image */}
        <View style={styles.imageWrapper}>
          <Image source={require('../assets/home.jpg')} style={styles.image} />
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleWrapper}>
          <Text style={styles.subtitleText}>Organize your next trip</Text>
        </View>

        {/* Create Trip Button */}
        <View style={styles.buttonWrapper}>
          <Pressable onPress={() => router.push('/plan')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Create your Trip</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


// Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleWrapper: {
    padding: 6,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  yearWrapper: {
    padding: 6,
  },
  yearText: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '600',
    color: 'skyblue',
  },
  imageWrapper: {
    padding: 5,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  subtitleWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  subtitleText: {
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginTop: 25,
    alignItems: 'center',
  },
  button: {
    borderRadius: 10,
    backgroundColor: 'skyblue',
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});