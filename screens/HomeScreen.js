import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const activities = [
  { id: '1', name: 'Thể chất', icon: require('../images/icon1.png') },
  { id: '2', name: 'Tinh thần', icon: require('../images/icon2.png') },
  { id: '3', name: 'Nhạc thiền', icon: require('../images/icon3.png') },
  { id: '4', name: 'Ăn uống', icon: require('../images/icon4.png') },
  { id: '5', name: 'Video Yoga', icon: require('../images/icon5.png') },
  { id: '6', name: 'Tư vấn', icon: require('../images/icon6.png') },
  { id: '7', name: 'Kết bạn', icon: require('../images/icon7.png') },
  { id: '8', name: 'Thống kê', icon: require('../images/icon8.png') },
];

const ProgressView = () => {
  const steps = 300;
  const goal = 1200;
  const percentage = (steps / goal) * 100;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Image source={require('../images/steps_icon.png')} style={styles.progressIcon} />
        <Text style={styles.progressText}>Số bước chân</Text>
        <Text style={styles.progressCount}>{steps}/{goal}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.progressPercentage}>{Math.round(percentage)}%</Text>
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchText, setSearchText] = useState('');

  const renderItem = ({ item }) => (
    <View style={styles.activityWrapper}>
      <TouchableOpacity
        style={styles.activityItem}
        onPress={() => {
          if (item.id === '2') {
            navigation.navigate('TinhThan');
          }
          else if (item.id === '1') {
            navigation.navigate('TheChat');
          }
          else if (item.id === '3') {
            navigation.navigate('NguNghi');
          }
          else if (item.id === '5') {
            navigation.navigate('VideoYoga');
          }
          else if (item.id === '4') {
            navigation.navigate('AnUong');
          }
          else if (item.id === '6') {
            navigation.navigate('TuVan');
          }
          setSelectedActivity(item.id);
        }}
      >
        <Image source={item.icon} style={styles.activityIcon} />
      </TouchableOpacity>
      <Text style={styles.activityName}>{item.name}</Text>
    </View>
  );
  

  return (
    <View style={styles.container}>
      {/* Phần banner */}
      <View style={styles.banner}>
        <View style={styles.bannerLeft}>
          <Image source={require('../images/avt.png')} style={styles.profilePic} />
          <View>
            <Text style={styles.welcomeText}>welcome !</Text>
            <Text style={styles.nameText}>VuongHien</Text>
            <Text style={styles.greetingText}>How is it going today ?</Text>
          </View>
        </View>
        <Image source={require('../images/bannericon.png')} style={styles.bannerIcon} />
      </View>

      {/* Phần search */}
      <View style={styles.searchContainer}>
        <Image style={{ marginLeft: 30 }} source={require('../images/Search.png')} />
        <TextInput style={{ marginLeft: 10 }} placeholder='Search..' />
      </View>

      {/* Phần hiển thị số bước chân */}
      <ProgressView />

      {/* Phần list các hoạt động */}
      <View style={styles.activitiesContainer}>
        <FlatList 
          data={activities}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.activitiesList}
        />
      </View>

      {/* Phần button navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('../images/homeicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('../images/topicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('../images/thongbaoicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={()=> navigation.navigate('User')}>
          <Image source={require('../images/usericon.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    height: 140,
    backgroundColor: '#DDF3FF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bannerLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 16,
    color: '#888',
  },
  greetingText: {
    fontSize: 14,
    color: '#888',
  },
  bannerIcon: {
    width: 140,
    height: 140,
    //marginTop: 5,
  },
  searchContainer: {
    margin: 10,
    borderRadius: 24,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F3F1',
  },
  progressContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressIcon: {
    width: 24,
    height: 24,
    marginRight: -110,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    marginTop: 10,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8E8E8',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  progressPercentage: {
    marginTop: 5,
    textAlign: 'right',
    fontSize: 14,
    color: '#888',
  },
  activitiesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:1,
  },
  activityWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    marginBottom:40,
    width: 100,
  },
  activityItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  activityIcon: {
    resizeMode: 'contain',
  },
  activityName: {
    marginTop: -20,
    color: '#000',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#DDF3FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default HomeScreen;
