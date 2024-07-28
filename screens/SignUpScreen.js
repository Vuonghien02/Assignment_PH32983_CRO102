import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState(''); 


  const handleSignUp = async () => {
    if (name === '' || email === '' || password === '' || phone === '') {
      Alert.alert('Sign Up Error', 'Vui lòng điền đầy đủ thông tin.');
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
          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={25} style={styles.icon} />
            <TextInput
              placeholder="Enter your phone number"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

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
  signUpButton: {
    backgroundColor: '#407CE2',
    borderRadius: 25,
    paddingVertical: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 60,
    //marginBottom: 30,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginWithText: {
    marginBottom: 50,
    marginTop: 50,
    color: 'black',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
});

export default SignUpScreen;
