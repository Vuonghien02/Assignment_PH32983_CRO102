import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { accelerometer } from 'react-native-sensors';

const TheChatScreen = () => {
  const [steps, setSteps] = useState(0);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Khởi tạo và đăng ký cảm biến gia tốc
    const accSubscription = accelerometer.subscribe(({ x, y, z }) => {
      // Xử lý dữ liệu gia tốc để đếm số bước chân
      handleAccelerometerData(x, y, z);
    });

    setSubscription(accSubscription);

    // Hủy đăng ký khi component bị unmount
    return () => {
      accSubscription.unsubscribe();
    };
  }, []);

  const handleAccelerometerData = (x, y, z) => {
    // Tính toán độ lớn của vector gia tốc
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    // Điều chỉnh ngưỡng và các điều kiện để phát hiện bước chân
    const threshold = 1.2;
    if (magnitude > threshold) {
      setSteps(prevSteps => prevSteps + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Counter</Text>
      <Text style={styles.steps}>{steps} steps</Text>
      <TouchableOpacity style={styles.button} onPress={() => setSteps(0)}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00796b',
  },
  steps: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#004d40',
  },
  button: {
    padding: 12,
    backgroundColor: '#004d40',
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default TheChatScreen;
