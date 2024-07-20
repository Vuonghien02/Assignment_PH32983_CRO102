import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';

const OnboardingScreen1 = ({ navigation }) => {
    return (
        <LinearGradient colors={['#8FE8C8', '#999999']} style={styles.background}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Image style={styles.image} source={require('../images/imgobr1.png')} />
                    <Text style={styles.text}>Chúng tôi giúp bạn thiết lập kỉ luật và hình thành sự tự tin!</Text>
                    <View style={styles.pagination}>
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={styles.dot} />
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Onboarding2')}>
                        <View style={styles.nextButton}>
                            <Text style={styles.nextText}>Next</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

export default OnboardingScreen1;

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    image: {
        width: 400,
        height: 472,
    },
    text: {
        width: 225,
        height: 90,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign:'center',
        marginHorizontal: 20,
        marginTop: 20,
    },
    pagination: {
        flexDirection: 'row',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#888',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#000',
    },
    nextButton: {
        borderRadius: 10,
        backgroundColor: '#8FE8C8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:40,
    },
    nextText: {
        fontSize: 24,
        color: '#fff',
    }
});