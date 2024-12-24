import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Dimensions, ActivityIndicator } from 'react-native';
import { Canvas, Path, SkPath, Paint, Skia } from '@shopify/react-native-skia';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

// Get device dimensions
const { width, height } = Dimensions.get('window');

const ColoringScreen = ({ route }) => {
  const { title, image } = route.params; // Receive passed data
  const [currentColor, setCurrentColor] = useState('#FF0000'); // Default selected color
  const [paths, setPaths] = useState([]); // Store drawn paths
  const [colorPalette, setColorPalette] = useState([]); // Dynamic color palette
  const [loading, setLoading] = useState(true); // Loading state for API data


  useEffect(() => {
    const fetchColorPalette = async () => {
      try {
        const response = await fetch('http://www.colourlovers.com/api/colors/top?format=json&numResults=30'); // Fetch 30 colors
        const data = await response.json();
        const colors = data.map((color) => `#${color.hex}`); // Extract hex values and format them
        setColorPalette(colors);
      } catch (error) {
        console.error('Error fetching color palette:', error);
        // Fallback to default palette in case of an error
        setColorPalette([
          '#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#00FFFF', 
          '#0000FF', '#800080', '#000000', '#FFC0CB', '#D2691E', 
          '#FFD700', '#8A2BE2', '#FF4500', '#00CED1', '#48D1CC',
          '#7FFF00', '#BA55D3', '#DC143C', '#FF8C00', '#00FA9A'
        ]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchColorPalette();
  }, []);
  

  // Handle touch drawing
  const handleTouch = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const path = Skia.Path.Make(); // Create a path
    path.moveTo(locationX, locationY);
    // Use the current color to add to the path
    setPaths(prevPaths => [...prevPaths, { path, color: currentColor }]);
  };

 
  const handleMove = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setPaths((prevPaths) => {
      const updatedPaths = [...prevPaths];
      updatedPaths[updatedPaths.length - 1].path.lineTo(locationX, locationY);
      return updatedPaths;
    });
  };

  // Clear all drawings
  const clearCanvas = () => {
    setPaths([]); // Clear all paths
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000FF" />
        <Text>Loading color palette...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={clearCanvas}>
          <MaterialIcons name="delete" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.templateImage} resizeMode="contain" />
        <Canvas
          style={styles.canvas}
          onTouchStart={handleTouch}
          onTouchMove={handleMove}
        >
          {paths.map((p, index) => (
            <Path key={index} path={p.path} style="stroke" strokeWidth={5} color={p.color} />
          ))}
        </Canvas>
      </View>

      {/* Color Palette */}
      <View style={styles.paletteContainer}>
        <Text style={styles.paletteTitle}>Pick a Color:</Text>
        <View style={styles.palette}>
          {colorPalette.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.colorButton, { backgroundColor: color }, currentColor === color && styles.selectedColor]}
              onPress={() => setCurrentColor(color)} // Set selected color
            />
          ))}
        </View>
      </View>
    </View>
  );
};

// Prop Validation
ColoringScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      title: PropTypes.string.isRequired,
      image: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateImage: {
    width: '100%',
    height: '60%',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height * 0.6,
  },
  paletteContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  paletteTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default ColoringScreen;
