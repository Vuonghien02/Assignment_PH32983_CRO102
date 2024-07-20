import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Modal, Button } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TinhThanScreen = ({ navigation }) => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [newContent, setNewContent] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');

  useEffect(() => {
    fetchDiaryEntries();
  }, []);

  const fetchDiaryEntries = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/diaryEntries');
      setDiaryEntries(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDiaryEntry = async (id) => {
    try {
      await axios.delete(`http://10.0.2.2:3000/diaryEntries/${id}`);
      fetchDiaryEntries();
    } catch (error) {
      console.error(error);
    }
  };

  const updateDiaryEntry = async () => {
    if (!selectedEntry || !newContent) return;
    try {
      await axios.put(`http://10.0.2.2:3000/diaryEntries/${selectedEntry.id}`, {
        ...selectedEntry,
        content: newContent,
      });
      fetchDiaryEntries();
      setEditModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const addDiaryEntry = async () => {
    if (!newDate || !newEntryContent) return;
    try {
      const response = await axios.post('http://10.0.2.2:3000/diaryEntries', {
        date: newDate,
        content: newEntryContent,
      });
      setDiaryEntries([...diaryEntries, response.data]); // Cập nhật trạng thái để hiển thị ngay lập tức
      setAddModalVisible(false);
      setNewDate('');
      setNewEntryContent('');
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (entry) => {
    setSelectedEntry(entry);
    setNewContent(entry.content);
    setEditModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.diaryItem}>
      <Text style={styles.dateText}>{item.date}</Text>
      <Text style={styles.contentText}>{item.content}</Text>
      <View style={styles.actionIcons}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconButton}>
          <Icon name="pencil" size={24} color="#00BFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteDiaryEntry(item.id)} style={styles.iconButton}>
          <Icon name="delete" size={24} color="#FF6347" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteDiaryEntry(item.id)} style={styles.iconButton}>
          <Icon name="share" size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={diaryEntries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              value={newContent}
              onChangeText={setNewContent}
              style={styles.textInput}
              placeholder="Edit content"
              multiline
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={updateDiaryEntry}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Modal */}
      <Modal
        visible={addModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              value={newDate}
              onChangeText={setNewDate}
              style={styles.textInput}
              placeholder="Date (YYYY-MM-DD)"
            />
            <TextInput
              value={newEntryContent}
              onChangeText={setNewEntryContent}
              style={[styles.textInput, styles.contentInput]}
              placeholder="Content"
              multiline
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={addDiaryEntry}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setAddModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
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
    backgroundColor: '#F0FFF0',
    padding: 10,
  },
  diaryItem: {
    backgroundColor: '#E0FFFF',
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#FF6347',
    marginBottom: 5,
  },
  contentText: {
    color: '#000',
    marginBottom: 10,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#00BFFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  textInput: {
    height: 50,
    width: '100%',
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  contentInput: {
    height: 100,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#00BFFF',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default TinhThanScreen;
