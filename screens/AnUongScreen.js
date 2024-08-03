import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Modal, Button } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnUongScreen = ({ navigation }) => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('');
    const [bmi, setBmi] = useState(null);
    const [diet, setDiet] = useState([]);
    const [targetHeight, setTargetHeight] = useState('');
    const [targetWeight, setTargetWeight] = useState('');
    const [showTargetInputs, setShowTargetInputs] = useState(true);
    const [showEditTargetDialog, setShowEditTargetDialog] = useState(false);
    
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedHeight = await AsyncStorage.getItem('height');
                const storedWeight = await AsyncStorage.getItem('weight');
                const storedGender = await AsyncStorage.getItem('gender');
                const storedBmi = await AsyncStorage.getItem('bmi');
                const storedDiet = await AsyncStorage.getItem('diet');
                const storedTargetHeight = await AsyncStorage.getItem('targetHeight');
                const storedTargetWeight = await AsyncStorage.getItem('targetWeight');

                if (storedHeight !== null) setHeight(storedHeight);
                if (storedWeight !== null) setWeight(storedWeight);
                if (storedGender !== null) setGender(storedGender);
                if (storedBmi !== null) setBmi(storedBmi);
                if (storedDiet !== null) setDiet(JSON.parse(storedDiet));
                if (storedTargetHeight !== null) setTargetHeight(storedTargetHeight);
                if (storedTargetWeight !== null) setTargetWeight(storedTargetWeight);
            } catch (error) {
                console.error('Failed to load data from AsyncStorage:', error);
            }
        };

        loadData();
    }, []);

    const saveData = async () => {
        try {
            await AsyncStorage.setItem('height', height);
            await AsyncStorage.setItem('weight', weight);
            await AsyncStorage.setItem('gender', gender);
            await AsyncStorage.setItem('bmi', bmi ? bmi : '');
            await AsyncStorage.setItem('diet', JSON.stringify(diet));
            await AsyncStorage.setItem('targetHeight', targetHeight);
            await AsyncStorage.setItem('targetWeight', targetWeight);
        } catch (error) {
            console.error('Failed to save data to AsyncStorage:', error);
        }
    };

    const saveTarget = () => {
        saveData();
        setShowTargetInputs(false);
        Alert.alert('Thông báo', 'Mục tiêu đã được lưu.');
    };

    const editTarget = () => {
        setShowEditTargetDialog(true);
    };

    const updateTarget = () => {
        saveData();
        setShowEditTargetDialog(false);
        Alert.alert('Thông báo', 'Mục tiêu đã được cập nhật.');
    };

    const calculateBmi = () => {
        if (!height || !weight || !gender) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);
        const bmiValue = (w / (h * h)).toFixed(1);
        setBmi(bmiValue);

        let newDiet = [];
        if (bmiValue < 18.5) {
            newDiet = [
                { meal: 'SÁNG', description: '1. Ngũ cốc nguyên cám; 2. Trái cây tươi; 3. Trà xanh không đường', image: require('../images/bstc.png') },
                { meal: 'TRƯA', description: '1. Salad rau củ; 2. Bánh mì nguyên cám; 3. Thịt gà nướng', image: require('../images/bttc.png') },
                { meal: 'TỐI', description: '1. Súp lơ xanh; 2. Cá hồi nướng; 3. Cơm gạo lứt', image: require('../images/btoitc.png') },
            ];
        // } else if (bmiValue < 24.9) {
        //     newDiet = [
        //         { meal: 'SÁNG', description: '1. Trứng ốp la; 2. Chuối; 3. Nước ép bưởi', image: require('../images/bstc.png') },
        //         { meal: 'TRƯA', description: '1. Rau củ xào; 2. Thịt bò nướng; 3. Cơm trắng', image: require('../images/bstc.png') },
        //         { meal: 'TỐI', description: '1. Súp tôm; 2. Mì gạo lứt; 3. Sữa chua không đường', image: require('../images/bstc.png') },
        //     ];
        // } else {
        //     newDiet = [
        //         { meal: 'SÁNG', description: '1. Ngũ cốc nguyên cám; 2. Trái cây ít đường; 3. Nước lọc', image: require('../images/bstc.png') },
        //         { meal: 'TRƯA', description: '1. Rau củ luộc; 2. Cá hồi; 3. Sữa chua không đường', image: require('../images/bstc.png') },
        //         { meal: 'TỐI', description: '1. Salad rau xanh; 2. Ức gà nướng; 3. Nước ép cà chua', image: require('../images/bstc.png') },
        //     ];
        }
        setDiet(newDiet);
        saveData();
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

                {targetHeight && targetWeight && !showTargetInputs && (
                    <View style={styles.targetContainer}>
                        <Text style={styles.targetText}>Mục tiêu chiều cao: {targetHeight} cm</Text>
                        <Text style={styles.targetText}>Mục tiêu cân nặng: {targetWeight} kg</Text>
                        <TouchableOpacity style={styles.button} onPress={editTarget}>
                            <Text style={styles.buttonText}>Chỉnh sửa mục tiêu</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {showTargetInputs && (
                    <>
                        <Text style={styles.inputLabel}>Nhập mục tiêu...</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mục tiêu chiều cao (cm)"
                            keyboardType="numeric"
                            value={targetHeight}
                            onChangeText={setTargetHeight}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mục tiêu cân nặng (kg)"
                            keyboardType="numeric"
                            value={targetWeight}
                            onChangeText={setTargetWeight}
                        />
                        <TouchableOpacity style={styles.button} onPress={saveTarget}>
                            <Text style={styles.buttonText}>Lưu mục tiêu</Text>
                        </TouchableOpacity>
                    </>
                )}

                <Text style={styles.inputLabel}>Nhập thông tin...</Text>
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
                        <View style={styles.dietContainer}>
                            <Text style={styles.recommendationHeader}>Thực đơn khuyến cáo</Text>
                            <FlatList
                                data={diet}
                                style={styles.dietList}
                                renderItem={({ item }) => (
                                    <View style={styles.dietItem}>
                                        <Image source={item.image} style={styles.dietImage} />
                                        <View style={styles.dietDetails}>
                                            <Text style={styles.mealTitle}>{item.meal}</Text>
                                            <Text style={styles.mealDescription}>{item.description}</Text>
                                        </View>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </>
                )}
            </View>

            <Modal
                visible={showEditTargetDialog}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowEditTargetDialog(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chỉnh sửa mục tiêu</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Mục tiêu chiều cao (cm)"
                            keyboardType="numeric"
                            value={targetHeight}
                            onChangeText={setTargetHeight}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Mục tiêu cân nặng (kg)"
                            keyboardType="numeric"
                            value={targetWeight}
                            onChangeText={setTargetWeight}
                        />
                        <Button title="Cập nhật mục tiêu" onPress={updateTarget} />
                        <Button title="Đóng" onPress={() => setShowEditTargetDialog(false)} color="red" />
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    bmiText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    targetContainer: {
        marginBottom: 20,
    },
    targetText: {
        fontSize: 16,
    },
    dietContainer: {
        marginTop: 20,
    },
    recommendationHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dietList: {
        marginTop: 10,
    },
    dietItem: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    dietImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    dietDetails: {
        marginLeft: 10,
    },
    mealTitle: {
        fontWeight: 'bold',
    },
    mealDescription: {
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default AnUongScreen;
