import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';

const ManagementScreen = ({ navigation }) => {
  const [users, setUsers] = useState([
    { id: '1', name: 'Người dùng 1' },
    { id: '2', name: 'Người dùng 2' },
  ]);
  const [doctors, setDoctors] = useState([
    { id: '1', name: 'Bác sĩ 1', specialty: 'Tim mạch' },
    { id: '2', name: 'Bác sĩ 2', specialty: 'Thần kinh' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState('');

  const handleAddDoctor = () => {
    if (newDoctorName && newDoctorSpecialty) {
      setDoctors([...doctors, { id: Date.now().toString(), name: newDoctorName, specialty: newDoctorSpecialty }]);
      setIsModalVisible(false);
      setNewDoctorName('');
      setNewDoctorSpecialty('');
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập cả tên và lĩnh vực khám.');
    }
  };

  const handleDeleteDoctor = (id) => {
    setDoctors(doctors.filter(doctor => doctor.id !== id));
  };

  const confirmLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: handleLogout,
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('SingIn');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý ứng dụng</Text>
      
      <View style={styles.gridContainer}>
        <TouchableOpacity style={[styles.square, { backgroundColor: '#cceeff' }]} onPress={() => Alert.alert('Điều hướng', 'Xem và quản lý tất cả người dùng')}>
          <Text style={styles.optionText}>Tất cả người dùng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.rectangle, { backgroundColor: '#ffcccc' }]} onPress={() => Alert.alert('Điều hướng', 'Xem và quản lý tất cả bác sĩ')}>
          <Text style={styles.optionText}>Tất cả bác sĩ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.rectangle, { backgroundColor: '#ccffcc' }]} onPress={() => Alert.alert('Điều hướng', 'Quản lý yêu cầu bác sĩ')}>
          <Text style={styles.optionText}>Yêu cầu bác sĩ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.square, { backgroundColor: '#ffcc99' }]} onPress={() => Alert.alert('Điều hướng', 'Xem thống kê người dùng')}>
          <Text style={styles.optionText}>Thống kê người dùng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.square, { backgroundColor: '#ccffff' }]} onPress={() => Alert.alert('Điều hướng', 'Xem thống kê bác sĩ')}>
          <Text style={styles.optionText}>Thống kê bác sĩ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.rectangle, { backgroundColor: '#ffd700' }]} onPress={() => Alert.alert('Điều hướng', 'Xem và quản lý tất cả video')}>
          <Text style={styles.optionText}>Tất cả video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.rectangle, { backgroundColor: '#add8e6' }]} onPress={() => navigation.navigate('MusicManager')}>
          <Text style={styles.optionText}>Tất cả âm nhạc</Text>
        </TouchableOpacity>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Thêm bác sĩ mới</Text>
          <TextInput
            placeholder="Tên bác sĩ"
            value={newDoctorName}
            onChangeText={setNewDoctorName}
            style={styles.input}
          />
          <TextInput
            placeholder="Lĩnh vực khám"
            value={newDoctorSpecialty}
            onChangeText={setNewDoctorSpecialty}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddDoctor}>
            <Text style={styles.addButtonText}>Thêm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  square: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  rectangle: {
    width: '48%',
    height: 100,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default ManagementScreen;