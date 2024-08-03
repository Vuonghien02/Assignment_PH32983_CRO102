import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import SegmentedControl from '@react-native-community/segmented-control';

const allWorkouts = [
  {
    id: '1',
    title: 'Beginner Vinyasa Yoga',
    difficulty: 'Easy',
    duration: '20min',
    category: 'Weight Loss',
    videoUrl: 'https://cdn.pixabay.com/video/2024/07/16/221551_large.mp4',
    backgroundImage: 'https://cdn.pixabay.com/video/2022/02/24/108803-681686665_tiny.jpg',
  },
  {
    id: '2',
    title: 'Yoga for flexibility',
    difficulty: 'Easy',
    duration: '30min',
    category: 'Flexibility',
    videoUrl: 'https://cdn.pixabay.com/video/2023/11/21/190021-887039306_large.mp4',
    backgroundImage: 'https://cdn.pixabay.com/video/2023/11/21/190021-887039306_tiny.jpg',
  },
  {
    id: '3',
    title: 'Yoga for strength',
    difficulty: 'Medium',
    duration: '40min',
    category: 'Strength',
    videoUrl: 'https://cdn.pixabay.com/video/2020/02/27/32937-395456375_large.mp4',
    backgroundImage: 'https://cdn.pixabay.com/video/2020/02/27/32937-395456375_tiny.jpg',
  },
  {
    id: '4',
    title: 'Yoga for relaxation',
    difficulty: 'Easy',
    duration: '25min',
    category: 'Relaxation',
    videoUrl: 'https://cdn.pixabay.com/video/2022/02/24/108803-681686665_large.mp4',
    backgroundImage: 'https://cdn.pixabay.com/video/2022/02/24/108803-681686665_tiny.jpg',
  },
];

const VideoYoga = ({ navigation }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredWorkouts = selectedCategory === 'All' 
    ? allWorkouts 
    : allWorkouts.filter(workout => workout.category === selectedCategory);

  const renderWorkout = ({ item }) => (
    <TouchableOpacity
      style={styles.workoutContainer}
      onPress={() => setSelectedVideo(item.videoUrl)}
    >
      <Image source={{ uri: item.backgroundImage }} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <Image source={{ uri: item.backgroundImage }} style={styles.workoutImage} />
        <View style={styles.workoutTextContainer}>
          <Text style={styles.workoutTitle}>{item.title}</Text>
          <Text style={styles.workoutDifficulty}>{item.difficulty}</Text>
          <Text style={styles.workoutDuration}>{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../images/backicon.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>VIDEO YOGA</Text>
        <View style={{ width: 40 }}></View>
      </View>

      {selectedVideo ? (
        <Video
          source={{ uri: selectedVideo }}
          style={styles.headerImage}
          controls={true}
          resizeMode="contain"
          onEnd={() => setSelectedVideo(null)} 
        />
      ) : (
        <Image
          source={require('../images/yogapng.png')}
          style={styles.headerImage}
        />
      )}

      <SegmentedControl
        values={['All', 'Weight Loss', 'Flexibility', 'Strength', 'Relaxation']}
        selectedIndex={['All', 'Weight Loss', 'Flexibility', 'Strength', 'Relaxation'].indexOf(selectedCategory)}
        onChange={(event) => setSelectedCategory(event.nativeEvent.value)}
        style={styles.segmentedControl}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.workoutsTitle}>Video hướng dẫn</Text>
        <FlatList
          data={filteredWorkouts}
          renderItem={renderWorkout}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          style={styles.flatList} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#000', 
  },
  contentContainer: {
    flex: 1, 
    padding: 20,
    backgroundColor:'#ccc',
  },
  seriesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  seriesDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
  workoutsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  workoutContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 10,
  },
  overlay: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    width: '100%',
  },
  workoutImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  workoutTextContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  workoutDifficulty: {
    fontSize: 14,
    color: '#ccc',
  },
  workoutDuration: {
    fontSize: 14,
    color: '#ccc',
  },
  listContainer: {
    paddingBottom: 20,
  },
  segmentedControl: {
    margin: 10,
    height:50,
  },
  flatList: {
    flex: 1, 
  },
});

export default VideoYoga;
