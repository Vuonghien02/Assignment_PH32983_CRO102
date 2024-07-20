import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient'



const WelcomeScreen = ({navigation}) => {

    useEffect(()=>{
        const timer = setTimeout(()=>{
            navigation.replace('Login');
        }, 3600);
        return ()=> clearTimeout(timer);
    }, [navigation]);

  return (
    <LinearGradient colors={['#FFFFFF', '#999999']} style={{flex:1}}>

    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* <Image source={require('../images/imgwelcome.png')}/> */}
        <LottieView 
        source={require('../animation/animation2.json')} 
        autoPlay 
        loop 
        style={styles.lottie} 
      />
        <Text style={styles.text1}>Healthcare</Text>
        <Text style={styles.text2}>POLY APP</Text>
        <View style={styles.imgw}>
            <Image style={styles.imgww} source={require('../images/imgw4.png')}/>
            <Image style={styles.imgww} source={require('../images/imgw3.png')}/>
            <Image style={styles.imgww} source={require('../images/imgw2.png')}/>
            <Image style={styles.imgww} source={require('../images/imgw1.png')}/>
        </View>
      </View>
    </SafeAreaView>
    </LinearGradient>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontSize: 32,
    color: '#000',
    marginTop:12,
    fontWeight:'bold'
  },
  text2: {
    fontSize: 16,
    marginTop:12,
    color: '#000',
  },
  imgw:{
    flexDirection:'row',
    marginTop:200,
  }, 
  imgww:{
    margin:15,
  },
  lottie:{
    width:200,
    height:200,
  }
});