import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Dialog from 'react-native-dialog';

const UserScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('VuongHien');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const themes = {
    light: {
      background: '#FFF',
      headerBackground: '#DDF3FF',
      buttonBackground: '#DDF3FF',
      textColor: '#000',
      inputBackground: '#E8E8E8',
      navBackground: '#DDF3FF',
    },
    dark: {
      background: '#333',
      headerBackground: '#444',
      buttonBackground: '#555',
      textColor: '#FFF',
      inputBackground: '#555',
      navBackground: '#444',
    },
  };

  useEffect(() => {
    const fetchUserData = async (retryCount = 0) => {
      try {
        const user = auth().currentUser;
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setUserName(userDoc.data().name);
        }
      } catch (error) {
        if (error.code === 'firestore/unavailable' && retryCount < 3) {
          setTimeout(() => fetchUserData(retryCount + 1), 2000 * (retryCount + 1)); // Exponential backoff
        } else {
          // Alert.alert('Lỗi', 'Không thể lấy dữ liệu người dùng. Vui lòng thử lại sau.');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('SingIn');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    }
  };

  const handleChangePassword = async () => {
    setDialogVisible(true);
  };

  const handleDialogSubmit = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    try {
      const user = auth().currentUser;
      // Reauthenticate user
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPassword);
      Alert.alert('Thành công', 'Mật khẩu đã được đổi.');
      setDialogVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đổi mật khẩu. Vui lòng thử lại.');
    }
  };

  const handleChangeTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const currentTheme = themes[theme];

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={[styles.header, { backgroundColor: currentTheme.headerBackground }]}>
        <Image source={require('../images/avt.png')} style={styles.profilePic} />
        <Text style={[styles.userName, { color: currentTheme.textColor }]}>{userName}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.buttonBackground }]} onPress={handleChangePassword}>
          <Text style={[styles.buttonText, { color: currentTheme.textColor }]}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.buttonBackground }]} onPress={handleChangeTheme}>
          <Text style={[styles.buttonText, { color: currentTheme.textColor }]}>Đổi Theme</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.buttonBackground }]} onPress={handleLogout}>
          <Text style={[styles.buttonText, { color: currentTheme.textColor }]}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.navigationContainer, { backgroundColor: currentTheme.navBackground }]}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../images/homeicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('../images/topicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('../images/thongbaoicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('User')}>
          <Image source={require('../images/usericon.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>

      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Đổi mật khẩu</Dialog.Title>
        <Dialog.Input
          placeholder="Mật khẩu hiện tại"
          secureTextEntry
          onChangeText={setCurrentPassword}
          value={currentPassword}
          style={{ backgroundColor: currentTheme.inputBackground, color: currentTheme.textColor }}
        />
        <Dialog.Input
          placeholder="Mật khẩu mới"
          secureTextEntry
          onChangeText={setNewPassword}
          value={newPassword}
          style={{ backgroundColor: currentTheme.inputBackground, color: currentTheme.textColor }}
        />
        <Dialog.Input
          placeholder="Nhập lại mật khẩu mới"
          secureTextEntry
          onChangeText={setConfirmNewPassword}
          value={confirmNewPassword}
          style={{ backgroundColor: currentTheme.inputBackground, color: currentTheme.textColor }}
        />
        <Dialog.Button label="Hủy" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Đổi" onPress={handleDialogSubmit} />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
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

export default UserScreen;
