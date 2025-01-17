/**
 * @format
 */
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
// import ManagementScreen from './screens/ManagementScreen';
// import NguNghiScreen from './screens/NguNghiScreen';
// import BacSiChat from './screens/BacSiChat';
// import VideoYoga from './screens/VideoYoga';
import TheChatScreen from './screens/TheChatScreen';
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from './screens/NguNghiScreen'; // Import playback service

// Đăng ký dịch vụ phát nhạc
TrackPlayer.registerPlaybackService(() => playbackService);

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => TheChatScreen)
// AppRegistry.registerComponent(appName, () => ManagementScreen)
// AppRegistry.registerComponent(appName,() => BacSiChat)
// AppRegistry.registerComponent(appName, () => NguNghiScreen);
// AppRegistry.registerComponent(appName, () => VideoYoga);
