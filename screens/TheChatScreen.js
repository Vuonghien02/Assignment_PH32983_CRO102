import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { accelerometer } from 'react-native-sensors';
import { LineChart } from 'react-native-chart-kit';

const TheChatScreen = ({ navigation }) => {
  const [steps, setSteps] = useState(0);
  const [lastMagnitude, setLastMagnitude] = useState(0);
  const [stepsPerDay, setStepsPerDay] = useState([300, 450, 400, 250, 200, 1200, 700]);

  useEffect(() => {
    const accSubscription = accelerometer.subscribe(({ x, y, z }) => {
      handleAccelerometerData(x, y, z);
    });

    return () => {
      accSubscription.unsubscribe();
    };
  }, []);

  const handleAccelerometerData = (x, y, z) => {
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const threshold = 1.2;
    // if (magnitude > threshold && Math.abs(magnitude - lastMagnitude) > 0.1) {
    //   setSteps(prevSteps => prevSteps + 1);
    // }
    setLastMagnitude(magnitude);
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../images/backicon.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
        <View style={{ width: 40 }} />
      </View>
      <Text style={styles.title}>Bạn đã đi bao nhiêu!</Text>
      <Text style={styles.today}>Today</Text>
      <View style={styles.stepContainer}>
        <Text style={styles.stepText}>Số bước chân</Text>
        <Text style={styles.stepCount}>{steps}/1200</Text>
        <Text style={styles.progressText}>{Math.round((steps / 1200) * 100)}%</Text>
      </View>
      <LineChart
        data={{
          labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          datasets: [
            {
              data: stepsPerDay,
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <Text style={styles.weekText}>Tuần vừa qua của bạn</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#e0f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 16,
  },
  backIcon: {
    width: 40,
    height: 40,
    marginLeft: -20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
    textAlign: 'center',
  },
  today: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
    textAlign: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  stepText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  stepCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  weekText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default TheChatScreen;
