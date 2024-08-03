import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

const LoginScreen = ({ navigation }) => {
  const scaleLogin = useSharedValue(1);
  const scaleSignUp = useSharedValue(1);

  const animatedStyleLogin = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleLogin.value }],
    };
  });

  const animatedStyleSignUp = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleSignUp.value }],
    };
  });

  const handleLoginPress = () => {
    scaleLogin.value = withTiming(1.3, { duration: 250 }, () => {
      scaleLogin.value = withTiming(1, { duration: 250 }, () => {
        runOnJS(navigateToSignIn)();
      });
    });
  };

  const handleSignUpPress = () => {
    scaleSignUp.value = withTiming(1.3, { duration: 250 }, () => {
      scaleSignUp.value = withTiming(1, { duration: 250 }, () => {
        runOnJS(navigateToSignUp)();
      });
    });
  };

  const navigateToSignIn = () => {
    navigation.navigate('SingIn');
  };

  const navigateToSignUp = () => {
    navigation.navigate('SingUp');
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#999999']} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Image style={{ width: 152, height: 158 }} source={require('../images/imgwelcome.png')} />
          <Text style={styles.text1}>Healthcare</Text>
          <Text style={styles.text2}>Let's get started</Text>
          <TouchableOpacity onPress={handleLoginPress}>
            <Animated.View style={[styles.loginButton, animatedStyleLogin]}>
              <Text style={styles.btnText}>Login</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignUpPress}>
            <Animated.View style={[styles.signupButton, animatedStyleSignUp]}>
              <Text style={styles.btnText}>Sign Up</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontSize: 32,
    color: '#000',
    marginTop: 12,
    fontWeight: 'bold'
  },
  text2: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#000',
  },
  loginButton: {
    borderRadius: 32,
    backgroundColor: '#407CE2',
    paddingVertical: 15,
    paddingHorizontal: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  signupButton: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'blue',
    paddingVertical: 14,
    paddingHorizontal: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  btnText: {
    fontSize: 16,
    color: '#fff',
  }
});
