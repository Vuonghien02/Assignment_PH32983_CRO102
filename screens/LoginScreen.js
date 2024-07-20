import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient'
import { TouchableOpacity } from 'react-native-gesture-handler';



const LoginScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={['#FFFFFF', '#999999']} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Image style={{ width: 152, height: 158 }} source={require('../images/imgwelcome.png')} />
          <Text style={styles.text1}>Healthcare</Text>
          <Text style={styles.text2}>Let's get started</Text>
          <TouchableOpacity onPress={()=> navigation.navigate('SingIn')}>
            <View style={styles.loginButton}>
              <Text style={styles.btnText}>Login</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> navigation.navigate('SingUp')}>
            <View style={styles.singupButton}>
              <Text style={styles.btnText}>Sing Up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default LoginScreen

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
  singupButton: {
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


})