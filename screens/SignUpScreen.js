import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async () => {
    let valid = true;
    let newErrors = { name: '', email: '', password: '', phone: '' };

    if (name === '') {
      newErrors.name = 'Vui lòng nhập tên của bạn.';
      valid = false;
    }
    if (phone === '' || !validatePhone(phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ. Phải bắt đầu bằng số 0 và có 10 chữ số.';
      valid = false;
    }
    if (email === '' || !validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ. Vui lòng nhập địa chỉ email đúng định dạng.';
      valid = false;
    }
    if (password === '' || !validatePassword(password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm một chữ cái viết hoa và một chữ số.';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({
        displayName: name,
      });
      Alert.alert('Sign Up Success', 'Đăng ký thành công!', [
        { text: 'OK', onPress: () => navigation.navigate('SingIn') }
      ]);
    } catch (error) {
      Alert.alert('Sign Up Error', error.message);
    }
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#999999']} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Image source={require('../images/backicon.png')} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>Sign Up</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Icon name="person-sharp" size={25} style={styles.icon} />
              <TextInput
                placeholder="Enter your name"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

            <View style={styles.inputContainer}>
              <Icon name="call-outline" size={25} style={styles.icon} />
              <TextInput
                placeholder="Enter your phone number"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
              />
            </View>
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

            <View style={styles.inputContainer}>
              <Icon name="mail-outline" size={25} style={styles.icon} />
              <TextInput
                placeholder="Enter your email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

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
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <Text style={styles.loginWithText}>Sign Up with</Text>
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
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 15,
    marginLeft: 10,
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
    // justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 30,
    marginBottom:30,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  form: {
    alignItems: 'center',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
    width: '100%',
    height: 60,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  signUpButton: {
    backgroundColor: '#407CE2',
    borderRadius: 25,
    paddingVertical: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 60,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginWithText: {
    marginBottom: 50,
    marginTop: 30,
    color: 'black',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
    paddingLeft: 10,
  },
});

export default SignUpScreen;
