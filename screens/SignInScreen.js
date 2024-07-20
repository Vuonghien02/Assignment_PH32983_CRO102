import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal'; // Import thư viện Modal

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State để quản lý trạng thái của hộp thoại
  const [resetEmail, setResetEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSignIn = async () => {
    if (email === '' || password === '') {
      Alert.alert('Đăng nhập không thành công', 'Email và mật khẩu không được để trống.');
      return;
    }
    try {
      await auth().signInWithEmailAndPassword(email, password);
      //Alert.alert('Welcome', 'Đăng nhập thành công!');
  
      // Sử dụng setTimeout để điều hướng sau 1 giây (1000ms)
      setTimeout(() => {
        navigation.navigate('Home');
      }, 50); // Thay đổi thời gian nếu cần
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Login Error', 'Mật khẩu không chính xác.');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('Login Error', 'Tài khoản không tồn tại.');
      } else {
        Alert.alert('Login Error', error.message);
      }
    }
  };
  

  const handleForgotPassword = () => {
    setIsModalVisible(true); // Hiển thị hộp thoại khi nhấn vào "Forgot password"
  };

  const handlePasswordReset = async () => {
    if (resetEmail && fullName) {
      try {
        await auth().sendPasswordResetEmail(resetEmail);
        Alert.alert('Success', 'Password reset email sent!');
        setIsModalVisible(false); // Đóng hộp thoại khi thành công
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Please enter both email and full name.');
    }
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#999999']} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Image source={require('../images/backicon.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Sign In</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={25} style={styles.icon} />
            <TextInput
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={25} style={styles.icon} />
            <TextInput
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={25}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          <View style={styles.signUpContainer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SingUp')}>
              <Text style={styles.signUpText}>Sign up</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.orText}>OR</Text>
          <Text style={styles.loginWithText}>Login with</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity>
              <Image style={{ width: 40, height: 40 }} source={require('../images/image6.png')} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image style={{ width: 40, height: 40 }} source={require('../images/image7.png')} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image style={{ width: 40, height: 40 }} source={require('../images/image8.png')} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal */}
        <Modal isVisible={isModalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <TextInput
              placeholder="Enter your email"
              style={styles.modalInput}
              value={resetEmail}
              onChangeText={setResetEmail}
            />
            <TextInput
              placeholder="Enter your full name"
              style={styles.modalInput}
              value={fullName}
              onChangeText={setFullName}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handlePasswordReset}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // ... các style khác
  icon: {
    marginRight: 15,
    marginLeft: 10,
  },
  background: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  form: {
    alignItems: 'center',
    marginTop: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 25,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
    width: '97%',
    height: 60,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 50,
    width: '100%',
    marginRight: 10,
  },
  forgotPassword: {
    color: '#407CE2',
    textAlign: 'right',
  },
  signInButton: {
    backgroundColor: '#407CE2',
    borderRadius: 25,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 60,
    marginBottom: 30,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpText: {
    color: '#407CE2',
  },
  orText: {
    marginBottom: 20,
    color: '#aaa',
  },
  loginWithText: {
    marginBottom: 50,
    color: 'black',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#407CE2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    justifyContent:'center',
    alignItems:'center',
    fontSize: 16,
  },
});

export default SignInScreen;
