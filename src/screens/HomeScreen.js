import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingButton from '../components/FloatingButton';
import PropTypes from 'prop-types';

const drawingTemplates = [
  {
    id: 1,
    type: 'butterfly', 
    title: 'Intricate Butterfly', 
    description: 'Design your own beautiful butterfly with this detailed pattern',
    image: require('../assets/templates/butterfly.jpg'),
    status: 'Graceful'
  },
  {
    id: 2,
    type: 'cupcake', 
    title: 'Whimsical Cupcake', 
    description: 'Create your own delightful cupcake with this starry, festive design',
    image: require('../assets/templates/cupcake.png'),
    status: 'Festive'
  },
  {
    id: 3,
    type: 'dinosaur', 
    title: 'Playful Dinosaur', 
    description: 'Embark on a prehistoric adventure with this cheerful dinosaur design',
    image: require('../assets/templates/dinosaur.jpg'),
    status: 'Adventurous'    
  },
  {
    id: 4,
    type: 'gingerbread_man', 
    title: 'Festive Gingerbread Man', 
    description: 'Get into the holiday spirit with this jolly gingerbread man design',
    image: require('../assets/templates/gingerbread.jpg'),
    status: 'Holiday Cheer'
  },
  {
    id: 5,
    type: 'ladybug', 
    title: 'Cheerful Ladybugs', 
    description: 'Color these happy ladybugs in a vibrant nature scene for a delightful coloring experience',
    image: require('../assets/templates/ladybug.jpg'),
    status: 'Joyful'
  },
  {
    id: 6,
    type: 'easter_rabbits', 
    title: 'Joyful Easter Rabbits', 
    description: 'Celebrate Easter with this cheerful scene of rabbits and a decorated egg, perfect for festive coloring sessions',
    image: require('../assets/templates/rabbit.jpg'),
    status: 'Festive'
  },
  {
    id: 7,
    type: 'christmas_tree', 
    title: 'Festive Christmas Tree', 
    description: 'Get into the holiday spirit with this beautifully decorated Christmas tree, complete with ornaments, garlands, and a star on top. Perfect for cheerful and festive coloring sessions.',
    image: require('../assets/templates/christmastree.jpg'),
    status: 'Holiday Cheer'
  },
  {
    id: 8,
    type: 'sea_turtle', 
    title: 'Detailed Sea Turtle', 
    description: 'Dive into creativity with this beautifully detailed sea turtle template, perfect for a relaxing and educational coloring session',
    image: require('../assets/templates/tortoise.jpg'),
    status: 'Calm'
  },
  {
    id: 9,
    type: 'tractor', 
    title: 'Sturdy Tractor', 
    description: 'Dive into a rural adventure with this detailed tractor design, perfect for creative coloring sessions on the farm',
    image: require('../assets/templates/tractor.jpg'),
    status: 'Engaging'
  },
  {
    id: 10,
    type: 'unicorn', 
    title: 'Magical Unicorn', 
    description: 'Bring magic to life with this whimsical unicorn standing on a cloud and a rainbow background',
    image: require('../assets/templates/unicorn.png'),
    status: 'Enchanting'
  } 
];

const HomeScreen = ({ navigation, route }) => {
  const { username } = route.params;
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchData();
    loadCount();
  }, []);

  const loadCount = async () => {
    try {
      const savedCount = await AsyncStorage.getItem('clickCount');
      if (savedCount) setCount(parseInt(savedCount));
    } catch (error) {
      console.error('Error loading count:', error);
    }
  };

  const handleCount = async () => {
    const newCount = count + 1;
    setCount(newCount);
    try {
      await AsyncStorage.setItem('clickCount', newCount.toString());
    } catch (error) {
      console.error('Error saving count:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://www.colourlovers.com/api/palettes/top?format=json');
      const palettes = await response.json();

      const enhancedTemplates = drawingTemplates.map((template, index) => ({
        ...template,
        colorPalette: palettes[index]?.colors || ['#000000'], // Default if API fails
      }));
      setTemplates(enhancedTemplates);
    } catch (error) {
      console.error('Error fetching palettes:', error);
      setTemplates(drawingTemplates); // Fallback templates
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        handleCount();
        navigation.navigate('Coloring', { 
          templateType: item.type,
          title: item.title,
          image: item.image
        });
      }}
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.statusTag}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading templates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {username}!</Text>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <FloatingButton count={count} onPress={handleCount} />
    </View>
  );
};

// Adding PropTypes validation
HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    padding: 15,
    backgroundColor: '#6200ee',
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  statusTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4081',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#666',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
});

export default HomeScreen;
