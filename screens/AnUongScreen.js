import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AnUongScreen = ({ navigation }) => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('');
    const [bmi, setBmi] = useState(null);
    const [diet, setDiet] = useState([]);

    const calculateBmi = () => {
        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);
        const bmiValue = (w / (h * h)).toFixed(1);
        setBmi(bmiValue);

        if (bmiValue < 18.5) {
            setDiet([
                { meal: 'SÁNG', description: '1. Ngũ cốc nguyên cám; 2. Trái cây tươi; 3. Trà xanh không đường', image: require('../images/bstc.png') },
                { meal: 'TRƯA', description: '1. Salad rau củ; 2. Bánh mì nguyên cám; 3. Thịt gà nướng', image: require('../images/bttc.png') },
                { meal: 'TỐI', description: '1. Súp lơ xanh; 2. Cá hồi nướng; 3. Cơm gạo lứt', image: require('../images/btoitc.png') },
            ]);
        } else if (bmiValue < 24.9) {
            setDiet([
                { meal: 'SÁNG', description: '1. Trứng ốp la; 2. Chuối; 3. Nước ép bưởi', image: require('../images/bstc.png') },
                { meal: 'TRƯA', description: '1. Rau củ xào; 2. Thịt bò nướng; 3. Cơm trắng', image: require('../images/bstc.png') },
                { meal: 'TỐI', description: '1. Súp tôm; 2. Mì gạo lứt; 3. Sữa chua không đường', image: require('../images/bstc.png') },
            ]);
        } else {
            setDiet([
                { meal: 'SÁNG', description: '1. Ngũ cốc nguyên cám; 2. Trái cây ít đường; 3. Nước lọc', image: require('../images/bstc.png') },
                { meal: 'TRƯA', description: '1. Rau củ luộc; 2. Cá hồi; 3. Sữa chua không đường', image: require('../images/bstc.png') },
                { meal: 'TỐI', description: '1. Salad rau xanh; 2. Ức gà nướng; 3. Nước ép cà chua', image: require('../images/bstc.png') },
            ]);
        }
    };

    return (
        <LinearGradient colors={['#ccc', '#fff']} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Image source={require('../images/backicon.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Ăn uống</Text>
                    <View style={{ width: 40 }} />
                </View>
                <Text style={{ marginBottom: 10, marginLeft: 10 }}>Nhập thông tin...</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Chiều cao (cm)"
                    keyboardType="numeric"
                    value={height}
                    onChangeText={setHeight}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Cân nặng (kg)"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Giới tính (Nam/Nữ)"
                    value={gender}
                    onChangeText={setGender}
                />
                <TouchableOpacity style={styles.button} onPress={calculateBmi}>
                    <Text style={styles.buttonText}>Tính chỉ số</Text>
                </TouchableOpacity>
                {bmi && (
                    <>
                        <Text style={styles.bmiText}>BMI : {bmi}</Text>
                        <View style={{backgroundColor:'#fff', borderRadius:20}}>
                            <Text style={styles.recommendationHeader}>Thực đơn khuyến cáo</Text>
                            <FlatList
                                data={diet}
                                style={{padding:10}}
                                keyExtractor={(item) => item.meal}
                                renderItem={({ item }) => (
                                    <View style={styles.dietItem}>
                                        <Image source={item.image} style={styles.dietImage} />
                                        <View style={styles.dietText}>
                                            <Text style={styles.meal}>{item.meal}</Text>
                                            <Text>{item.description}</Text>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    </>
                )}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    background: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        paddingHorizontal: 10,
        fontSize: 17,
        fontWeight: 'bold',
        backgroundColor: '#CFD0DF',
    },
    button: {
        backgroundColor: '#BA5D5D', 
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff', 
        fontSize: 16,
    },
    bmiText: {
        fontSize: 22,
        fontWeight: '900',
        marginVertical: 10,
        marginLeft: 10,
        marginTop: 15,
        fontSize: 36,
        color: '#6468C5',
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    chart: {
        width: 300,
        height: 150,
    },
    recommendationHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    dietItem: {
        flexDirection: 'row',
        marginVertical: 10,
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 10,
    },
    dietImage: {
        width: 60,
        height: 60,
        marginRight: 10,
    },
    dietText: {
        flex: 1,
    },
    meal: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AnUongScreen;
