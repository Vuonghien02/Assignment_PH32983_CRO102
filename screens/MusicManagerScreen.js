import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Image, Modal } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';

const MusicManagerScreen = () => {
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [newSong, setNewSong] = useState({ title: '', artist: '', url: '', artwork: '' });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newArtwork, setNewArtwork] = useState('');

  useEffect(() => {
    fetchSongs();
    return () => {
      database().ref('tracks').off('value');
    };
  }, []);

  useEffect(() => {
    filterSongs();
  }, [searchQuery, songs]);

  const fetchSongs = () => {
    database().ref('tracks').on('value', snapshot => {
      const data = snapshot.val();
      const songList = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
      setSongs(songList);
    });
  };

  const filterSongs = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = songs.filter(song =>
      song.title.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredSongs(filtered);
  };

  const addSong = async () => {
    if (newSong.title && newSong.artist && newSong.url && newSong.artwork) {
      try {
        const newSongRef = database().ref('tracks').push();
        await newSongRef.set({
          title: newSong.title,
          artist: newSong.artist,
          url: newSong.url,
          artwork: newSong.artwork
        });
        setNewSong({ title: '', artist: '', url: '', artwork: '' });
        setAddModalVisible(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      Alert.alert('Error', 'Please enter title, artist, URL, and artwork URL.');
    }
  };

  const editSong = (song) => {
    setSelectedSong(song);
    setNewTitle(song.title);
    setNewArtist(song.artist);
    setNewUrl(song.url);
    setNewArtwork(song.artwork);
    setEditModalVisible(true);
  };

  const updateSong = async () => {
    if (selectedSong && newTitle && newArtist && newUrl && newArtwork) {
      try {
        await database().ref(`tracks/${selectedSong.id}`).update({
          title: newTitle,
          artist: newArtist,
          url: newUrl,
          artwork: newArtwork
        });
        setEditModalVisible(false);
        fetchSongs();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteSong = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this song?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => removeSong(id) }
      ],
      { cancelable: false }
    );
  };

  const removeSong = async (id) => {
    try {
      await database().ref(`tracks/${id}`).remove();
      fetchSongs();
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.artwork }} style={styles.artwork} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => editSong(item)} style={styles.button}>
          <Icon name="edit" size={20} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteSong(item.id)} style={styles.button}>
          <Icon name="delete" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        label="Search by Song Title"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredSongs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Button mode="contained" onPress={() => setAddModalVisible(true)}>
              Add Song
            </Button>
          </View>
        }
      />

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Song</Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.textInput}
              placeholder="Title"
            />
            <TextInput
              value={newArtist}
              onChangeText={setNewArtist}
              style={styles.textInput}
              placeholder="Artist"
            />
            <TextInput
              value={newUrl}
              onChangeText={setNewUrl}
              style={styles.textInput}
              placeholder="URL"
            />
            <TextInput
              value={newArtwork}
              onChangeText={setNewArtwork}
              style={styles.textInput}
              placeholder="Artwork URL"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={updateSong} style={[styles.modalButton, styles.updateButton]}>
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Song</Text>
            <TextInput
              value={newSong.title}
              onChangeText={text => setNewSong({ ...newSong, title: text })}
              style={styles.textInput}
              placeholder="Title"
            />
            <TextInput
              value={newSong.artist}
              onChangeText={text => setNewSong({ ...newSong, artist: text })}
              style={styles.textInput}
              placeholder="Artist"
            />
            <TextInput
              value={newSong.url}
              onChangeText={text => setNewSong({ ...newSong, url: text })}
              style={styles.textInput}
              placeholder="URL"
            />
            <TextInput
              value={newSong.artwork}
              onChangeText={text => setNewSong({ ...newSong, artwork: text })}
              style={styles.textInput}
              placeholder="Artwork URL"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={addSong} style={[styles.modalButton, styles.updateButton]}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAddModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  artwork: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
    color: '#666',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textInput: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#007BFF',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MusicManagerScreen;
