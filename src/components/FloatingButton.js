import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

const FloatingButton = ({ onPress }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Load count from AsyncStorage when the component mounts
    const loadCount = async () => {
      try {
        const savedCount = await AsyncStorage.getItem('count');
        if (savedCount !== null) {
          setCount(parseInt(savedCount, 10)); // Set the saved count value
        }
      } catch (error) {
        console.error('Error loading count from AsyncStorage', error);
      }
    };

    loadCount();
  }, []);

  const handlePress = async () => {
    const newCount = count + 1;
    setCount(newCount);
    try {
      // Save the new count to AsyncStorage
      await AsyncStorage.setItem('count', newCount.toString());
    } catch (error) {
      console.error('Error saving count to AsyncStorage', error);
    }
    onPress && onPress(); // Optional: Call the parent component's onPress function
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>Clicks: {count}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 15,
    backgroundColor: '#6200ee',
    borderRadius: 50,
    elevation: 5,
  },
  text: { color: '#fff', fontWeight: 'bold' },
});

// Prop validation
FloatingButton.propTypes = {
  onPress: PropTypes.func, // Validate that onPress is a function
};

export default FloatingButton;
