import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import SegmentedControl from '@react-native-community/segmented-control';

export async function playbackService() {
    // Your playback service implementation
}

const NguNghiScreen = ({ navigation }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [favoriteTracks, setFavoriteTracks] = useState([]); // Trạng thái cho danh sách yêu thích
    const [isFavoriteModalVisible, setIsFavoriteModalVisible] = useState(false); // Trạng thái hiển thị modal yêu thích
    const [tracks, setTracks] = useState([]); // Dữ liệu bài hát từ Firebase
    const [currentGenre, setCurrentGenre] = useState('nhac_thien'); // Thể loại nhạc hiện tại
    const { position, duration } = useProgress(); // Sử dụng useProgress để lấy thông tin thời gian

    // Hàm loại bỏ các bài trùng lặp dựa trên tiêu đề và nghệ sĩ
    const removeDuplicates = (tracks) => {
        const seen = new Set();
        return tracks.filter(track => {
            const key = `${track.title}-${track.artist}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    };

    // Hàm setup player
    const setupApp = async () => {
        console.log("setup player");
        // Khởi tạo player
        await TrackPlayer.setupPlayer();
    
        // Loại bỏ bài trùng lặp
        const uniqueTracks = removeDuplicates(tracks);
    
        // Định nghĩa danh sách track
        const listTrack = uniqueTracks.filter(track => track.genre === currentGenre);
        // Thêm track vào player
        await TrackPlayer.add(listTrack);
    
        try {
            const savedFavoriteTracks = await AsyncStorage.getItem('favoriteTracks');
            const savedSelectedTrack = await AsyncStorage.getItem('selectedTrack');
    
            if (savedFavoriteTracks) {
                const parsedFavoriteTracks = JSON.parse(savedFavoriteTracks);
                // Kiểm tra dữ liệu trước khi thiết lập trạng thái
                const validFavoriteTracks = parsedFavoriteTracks.filter(trackId => trackId !== null);
                setFavoriteTracks(validFavoriteTracks);
            }
    
            if (savedSelectedTrack) {
                const parsedSelectedTrack = JSON.parse(savedSelectedTrack);
                // Kiểm tra dữ liệu trước khi thiết lập trạng thái
                if (parsedSelectedTrack !== null && parsedSelectedTrack.url) {
                    setSelectedTrack(parsedSelectedTrack);
                    await TrackPlayer.add(parsedSelectedTrack);
                    setIsPlaying(true);
                } else {
                    console.error('Invalid track data', parsedSelectedTrack);
                }
            }
        } catch (error) {
            console.error('Error loading saved tracks', error);
        }
    
        console.log("Finish setup");
    };

    // Lấy dữ liệu từ Firebase Realtime Database
    useEffect(() => {
        const fetchTracksFromFirebase = async () => {
            const snapshot = await database().ref('/tracks').once('value');
            const data = snapshot.val();
            if (data) {
                const trackList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                }));
                setTracks(trackList);
            }
        };

        fetchTracksFromFirebase();
    }, []);

    useEffect(() => {
        console.log("start render");
        if (tracks.length > 0) {
            setupApp();
        }
    }, [tracks, currentGenre]);

    useEffect(() => {
        const saveFavoriteTracks = async () => {
            try {
                await AsyncStorage.setItem('favoriteTracks', JSON.stringify(favoriteTracks));
            } catch (error) {
                console.error('Error saving favorite tracks', error);
            }
        };
        saveFavoriteTracks();
    }, [favoriteTracks]);
    

    useEffect(() => {
        AsyncStorage.setItem('selectedTrack', JSON.stringify(selectedTrack));
    }, [selectedTrack]);

    // Hàm Play/Pause
    const togglePlayback = async () => {
        if (isPlaying) {
            console.log("pause music");
            await TrackPlayer.pause();
        } else {
            console.log("play music");
            await TrackPlayer.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Hàm chọn bài hát
    const selectTrack = async (track) => {
        await TrackPlayer.reset();
        await TrackPlayer.add(track);
        await TrackPlayer.play();
        setIsPlaying(true);
        setSelectedTrack(track);
    };

    // Hàm chuyển bài hát tiếp theo
    const playNextTrack = async () => {
        const currentTrackIndex = tracks.findIndex(track => track.id === selectedTrack?.id);

        // Kiểm tra nếu không tìm thấy bài hát hiện tại hoặc không có bài hát được chọn
        if (currentTrackIndex === -1 || selectedTrack === null) {
            console.warn("Current track not found or no track selected");
            return;
        }

        const nextTrackIndex = (currentTrackIndex + 1) % tracks.length;
        const nextTrack = tracks[nextTrackIndex];
        await selectTrack(nextTrack);
    };

    // Hàm quay lại bài hát trước đó
    const playPrevTrack = async () => {
        const currentTrackIndex = tracks.findIndex(track => track.id === selectedTrack?.id);

        // Kiểm tra nếu không tìm thấy bài hát hiện tại hoặc không có bài hát được chọn
        if (currentTrackIndex === -1 || selectedTrack === null) {
            console.warn("Current track not found or no track selected");
            return;
        }

        const prevTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        const prevTrack = tracks[prevTrackIndex];
        await selectTrack(prevTrack);
    };

    // Hàm format thời gian từ giây sang phút:giây
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Hàm chuyển đổi yêu thích
    const toggleFavorite = (track) => {
        let updatedFavorites;
        if (favoriteTracks.includes(track.id)) {
            updatedFavorites = favoriteTracks.filter(id => id !== track.id);
        } else {
            updatedFavorites = [...favoriteTracks, track.id];
        }
        setFavoriteTracks(updatedFavorites);

        // Lưu danh sách yêu thích vào AsyncStorage
        const saveFavoriteTracks = async () => {
            try {
                const validFavorites = updatedFavorites.filter(id => id !== null);
                await AsyncStorage.setItem('favoriteTracks', JSON.stringify(validFavorites));
            } catch (error) {
                console.error('Error saving favorite tracks', error);
            }
        };
        saveFavoriteTracks();
    };

    // Hàm kiểm tra xem bài hát có phải yêu thích hay không
    const isFavorite = (track) => favoriteTracks.includes(track.id);

    // Hàm hiển thị modal yêu thích
    const toggleFavoriteModal = () => {
        setIsFavoriteModalVisible(!isFavoriteModalVisible);
    };

    // Danh sách các bài hát yêu thích
    const favoriteTrackList = tracks.filter(track => isFavorite(track));

    // Lọc bài hát theo thể loại hiện tại
    const filteredTracks = tracks.filter(track => track.genre === currentGenre);

    return (
        <LinearGradient colors={['#E55F5F', '#999999']} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Image source={require('../images/backicon.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>ÂM NHẠC</Text>
                    <TouchableOpacity onPress={toggleFavoriteModal}>
                        <Icon name="heart" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
                <SegmentedControl
                    values={['Nhạc Thiền', 'Nhạc Chạy Bộ']}
                    selectedIndex={currentGenre === 'nhac_thien' ? 0 : 1}
                    onChange={event => {
                        setCurrentGenre(event.nativeEvent.selectedSegmentIndex === 0 ? 'nhac_thien' : 'nhac_chay_bo');
                    }}
                    style={styles.genreTabs}
                />
                <View style={styles.currentTrackInfo}>
                    <Image
                        style={styles.albumArt}
                        source={{ uri: selectedTrack?.artwork || 'https://cdn.pixabay.com/photo/2017/08/30/01/01/cd-2698449_960_720.png' }}
                    />
                    <Text style={styles.trackTitle}>{selectedTrack?.title || 'No Track Selected'}</Text>
                    <Text style={styles.trackArtist}>{selectedTrack?.artist || ''}</Text>
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{formatTime(position)}</Text>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    onValueChange={async (value) => {
                        await TrackPlayer.seekTo(value);
                    }}
                />
                <View style={styles.controls}>
                    <TouchableOpacity onPress={playPrevTrack}>
                        <Icon name="step-backward" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={togglePlayback}>
                        <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={playNextTrack}>
                        <Icon name="step-forward" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredTracks}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => selectTrack(item)}>
                            <View style={styles.trackItem}>
                                <Image style={styles.trackImage} source={{ uri: item.artwork }} />
                                <View style={styles.trackDetails}>
                                    <Text style={styles.trackTitle}>{item.title}</Text>
                                    <Text style={styles.trackArtist}>{item.artist}</Text>
                                </View>
                                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                                    <Icon name={isFavorite(item) ? 'heart' : 'heart-o'} size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                <Modal
                    visible={isFavoriteModalVisible}
                    onRequestClose={toggleFavoriteModal}
                    transparent={true}
                    animationType="slide"
                >
                    <LinearGradient colors={['#E55F5F', '#999999']} style={styles.background}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={toggleFavoriteModal}>
                                <Icon name="close" size={30} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.title}>Yêu thích</Text>
                            <View style={{ width: 30 }} />
                        </View>
                        <FlatList
                            data={favoriteTrackList}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => selectTrack(item)}>
                                    <View style={styles.trackItem}>
                                        <Image source={{ uri: item.artwork }} style={styles.trackImage} />
                                        <View style={styles.trackDetails}>
                                            <Text style={styles.trackTitle}>{item.title}</Text>
                                            <Text style={styles.trackArtist}>{item.artist}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => toggleFavorite(item)}>
                                            <Icon
                                                name={isFavorite(item) ? 'heart' : 'heart-o'}
                                                size={20}
                                                color={isFavorite(item) ? '#f00' : '#fff'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </LinearGradient>
                </Modal>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:10,
    },
    backIcon: {
        width: 30,
        height: 30,
    },
    title: {
        fontSize: 20,
        color: '#fff',
    },
    genreTabs: {
        marginVertical: 20,
    },
    currentTrackInfo: {
        alignItems: 'center',
        marginVertical: 20,
    },
    albumArt: {
        width: 250,
        height: 250,
        borderRadius: 125,
    },
    trackTitle: {
        fontSize: 18,
        color: '#fff',
        marginVertical: 10,
    },
    trackArtist: {
        fontSize: 16,
        color: '#fff',
    },
    slider: {
        width: '100%',
        height: 40,
        //marginVertical: 20,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#E55F5F',
    },
    trackImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    trackDetails: {
        flex: 1,
    },
    trackTitle: {
        fontSize: 16,
        color: '#fff',
    },
    trackArtist: {
        fontSize: 14,
        color: '#fff',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    timeText: {
        color: '#fff',
    },
    
    modalContainer: {
        flex: 1,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#E55F5F',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default NguNghiScreen;
