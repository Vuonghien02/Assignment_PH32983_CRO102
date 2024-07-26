// NguNghiScreen.js

import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import TrackPlayer from 'react-native-track-player';

// Khởi tạo service playback
export async function playbackService() {
    // TODO: Attach remote event handlers
}

const NguNghiScreen = () => {

    // Hàm setup player
    const setupApp = async () => {
        console.log("setup player");
        // Khởi tạo player
        await TrackPlayer.setupPlayer();
        
        // Định nghĩa danh sách track
        const listTrack = [
            {
                id: '1',
                url: 'https://cdn.pixabay.com/download/audio/2024/04/12/audio_3118cb3f2a.mp3',
                title: 'Password Infinity',
                artist: '',
            }
        ];
        // Thêm track vào player
        await TrackPlayer.add(listTrack);

        console.log("Finish setup");
    }

    useEffect(() => {
        console.log("start render");
        setupApp();
    }, []);

    // Hàm Play
    const PlayMusic = () => {
        console.log("play music");
        TrackPlayer.play();
    }

    // Hàm Pause
    const PauseMusic = () => {
        console.log("pause music");
        TrackPlayer.pause();
    }

    return (
        <View>
            <Text>Demo Music</Text>
            <View style={{ width: 100, margin: 10 }}>
                <Button title='Play' onPress={PlayMusic} />
            </View>
            <View style={{ width: 100, margin: 10 }}>
                <Button title='Pause' onPress={PauseMusic} />
            </View>
        </View>
    )
}

export default NguNghiScreen;
