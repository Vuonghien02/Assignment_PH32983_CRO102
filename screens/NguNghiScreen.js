import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';

// Khởi tạo service playback
export async function playbackService() {
    // TODO: Attach remote event handlers
}

const NguNghiScreen = ({ navigation }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [favoriteTracks, setFavoriteTracks] = useState([]); // Trạng thái cho danh sách yêu thích
    const [isFavoriteModalVisible, setIsFavoriteModalVisible] = useState(false); // Trạng thái hiển thị modal yêu thích
    const { position, duration } = useProgress(); // Sử dụng useProgress để lấy thông tin thời gian

    // Danh sách các bài hát
    const tracks = [
        {
            id: '1',
            url: 'https://cdn.pixabay.com/audio/2024/06/14/audio_0e2636099d.mp3',
            title: 'Nhac 1',
            artist: 'Ca si 1',
            artwork: 'https://cdn.pixabay.com/audio/2024/06/17/18-00-00-760_200x200.jpg',
        },
        {
            id: '2',
            url: 'https://cdn.pixabay.com/audio/2024/07/24/audio_5ec636ca14.mp3',
            title: 'Nhac 2',
            artist: 'Ca si 2',
            artwork: 'https://cdn.pixabay.com/audio/2024/03/22/19-00-46-73_200x200.jpg',
        },
        {
            id: '3',
            url: 'https://cdn.pixabay.com/audio/2024/06/25/audio_7bfb8d2ab0.mp3',
            title: 'Nhac 3',
            artist: 'Ca si 3',
            artwork: 'https://cdn.pixabay.com/audio/2024/06/25/10-06-34-296_200x200.jpg',
        },
        {
            id: '4',
            url: 'https://cdn.pixabay.com/audio/2024/05/24/audio_46382ae035.mp3',
            title: 'Nhac 4',
            artist: 'Ca si 4',
            artwork: 'https://cdn.pixabay.com/audio/2024/05/24/15-24-57-666_200x200.png',
        }
    ];

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
        const listTrack = uniqueTracks;
        // Thêm track vào player
        await TrackPlayer.add(listTrack);

        console.log("Finish setup");
    };

    useEffect(() => {
        console.log("start render");
        setupApp();
    }, []);

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
        if (favoriteTracks.includes(track.id)) {
            setFavoriteTracks(favoriteTracks.filter(id => id !== track.id));
        } else {
            setFavoriteTracks([...favoriteTracks, track.id]);
        }
    };

    // Hàm kiểm tra xem bài hát có phải yêu thích hay không
    const isFavorite = (track) => favoriteTracks.includes(track.id);

    // Hàm hiển thị modal yêu thích
    const toggleFavoriteModal = () => {
        setIsFavoriteModalVisible(!isFavoriteModalVisible);
    };

    // Danh sách các bài hát yêu thích
    const favoriteTrackList = tracks.filter(track => isFavorite(track));

    return (
        <LinearGradient colors={['#E55F5F', '#999999']} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Image source={require('../images/backicon.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>AM NHAC</Text>
                    <TouchableOpacity onPress={toggleFavoriteModal}>
                        <Icon name="heart" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={styles.currentTrackInfo}>
                    <Image
                        style={styles.albumArt}
                        source={{ uri: selectedTrack?.artwork || 'https://cdn.pixabay.com/audio/2024/06/17/18-00-00-760_200x200.jpg' }} // Đường dẫn ảnh album
                    />
                    <Text style={styles.title}>{selectedTrack?.title || 'Nhac 1'}</Text>
                    <Text style={styles.artist}>{selectedTrack?.artist || 'Ca si 1'}</Text>
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{formatTime(position)}</Text>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
                <Slider
                    style={styles.slider}
                    value={position}
                    minimumValue={0}
                    maximumValue={duration}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#FFFFFF"
                    onSlidingComplete={async (value) => {
                        await TrackPlayer.seekTo(value);
                    }}
                />
                <View style={styles.controls}>
                    <TouchableOpacity onPress={playPrevTrack}>
                        <Icon name="step-backward" size={30} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={togglePlayback}>
                        <Icon name={isPlaying ? "pause" : "play"} size={30} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={playNextTrack}>
                        <Icon name="step-forward" size={30} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <View style={styles.playlistContainer}>
                    <Text style={styles.playlistTitle}>Danh sách bài hát</Text>
                    <FlatList
                        data={removeDuplicates(tracks)}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.flatListContainer} // Thay đổi màu nền của FlatList
                        renderItem={({ item }) => (
                            <View style={styles.trackItem}>
                                <TouchableOpacity onPress={() => selectTrack(item)} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Image source={{ uri: item.artwork }} style={styles.trackImage} />
                                    <View style={styles.trackInfo}>
                                        <Text style={styles.trackTitle}>{item.title}</Text>
                                        <Text style={styles.trackArtist}>{item.artist}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                                    <Icon
                                        name={isFavorite(item) ? "heart" : "heart-o"}
                                        size={20}
                                        color={isFavorite(item) ? "#FF0000" : "#CCCCCC"}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </View>
            <Modal
                visible={isFavoriteModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={toggleFavoriteModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Danh sách yêu thích</Text>
                        <FlatList
                            data={favoriteTrackList}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.modalTrackItem}>
                                    <TouchableOpacity onPress={() => selectTrack(item)} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <Image source={{ uri: item.artwork }} style={styles.modalTrackImage} />
                                        <View style={styles.modalTrackInfo}>
                                            <Text style={styles.modalTrackTitle}>{item.title}</Text>
                                            <Text style={styles.modalTrackArtist}>{item.artist}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => toggleFavorite(item)}>
                                        <Icon
                                            name={isFavorite(item) ? "heart" : "heart-o"}
                                            size={24}
                                            color={isFavorite(item) ? "#FF0000" : "#CCCCCC"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={toggleFavoriteModal}>
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
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
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backIcon: {
        width: 30,
        height: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    currentTrackInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    albumArt: {
        width: 250,
        height: 250,
        borderRadius: 10,
        marginBottom: 10,
    },
    artist: {
        fontSize: 18,
        color: '#fff',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        color: '#fff',
    },
    playlistContainer: {
        flex: 1,
        marginTop: 10,
        backgroundColor: '#333333',
        padding: 10,
        borderRadius: 10,
    },
    playlistTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    flatListContainer: {
        backgroundColor: '#333333', // Thay đổi màu nền của FlatList
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    trackImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    trackInfo: {
        flex: 1,
    },
    trackTitle: {
        fontSize: 16,
        color: '#fff',
    },
    trackArtist: {
        fontSize: 14,
        color: '#999',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalTrackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTrackImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    modalTrackInfo: {
        flex: 1,
    },
    modalTrackTitle: {
        fontSize: 16,
    },
    modalTrackArtist: {
        fontSize: 14,
        color: '#999',
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
});

export default NguNghiScreen;
