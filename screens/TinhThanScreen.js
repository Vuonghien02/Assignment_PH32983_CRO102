import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Modal, Image } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const TinhThanScreen = ({ navigation }) => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [newContent, setNewContent] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDay, setFilterDay] = useState('');

  useEffect(() => {
    fetchDiaryEntries();
  }, []);

  useEffect(() => {
    filterDiaryEntries();
  }, [filterYear, filterMonth, filterDay, diaryEntries]);

  const fetchDiaryEntries = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/diaryEntries');
      const sortedEntries = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setDiaryEntries(sortedEntries);
    } catch (error) {
      console.error(error);
    }
  };

  const filterDiaryEntries = () => {
    let filtered = diaryEntries;
    if (filterYear) {
      filtered = filtered.filter(entry => entry.date.startsWith(filterYear));
    }
    if (filterMonth) {
      filtered = filtered.filter(entry => entry.date.startsWith(`${filterYear}-${filterMonth.padStart(2, '0')}`));
    }
    if (filterDay) {
      filtered = filtered.filter(entry => entry.date === `${filterYear}-${filterMonth.padStart(2, '0')}-${filterDay.padStart(2, '0')}`);
    }
    setFilteredEntries(filtered);
  };

  const groupDiaryEntriesByDate = (entries) => {
    const groupedEntries = {};

    entries.forEach(entry => {
      const date = new Date(entry.date);
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const day = date.getDate();

      if (!groupedEntries[yearMonth]) {
        groupedEntries[yearMonth] = {};
      }

      if (!groupedEntries[yearMonth][day]) {
        groupedEntries[yearMonth][day] = [];
      }

      groupedEntries[yearMonth][day].push(entry);
    });

    return groupedEntries;
  };

  const groupedEntries = groupDiaryEntriesByDate(filteredEntries);

  const renderHeader = ({ yearMonth, day }) => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{yearMonth} - Ngày {day}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.diaryItem}>
      <Text style={styles.contentText}>{item.content}</Text>
      <View style={styles.actionIcons}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconButton}>
          <Icon name="pencil" size={24} color="#00BFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDeleteDiaryEntry(item.id)} style={styles.iconButton}>
          <Icon name="delete" size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const openEditModal = (entry) => {
    setSelectedEntry(entry);
    setNewContent(entry.content);
    setEditModalVisible(true);
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
    if (!newEntryContent) return;
    try {
      const response = await axios.post('http://10.0.2.2:3000/diaryEntries', {
        date: newDate,
        content: newEntryContent,
      });
      setDiaryEntries([response.data, ...diaryEntries]); // Thêm vào đầu danh sách
      setAddModalVisible(false);
      setNewEntryContent('');
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDeleteDiaryEntry = (id) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa mục nhật ký này không?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Xóa",
          onPress: () => deleteDiaryEntry(id)
        }
      ],
      { cancelable: false }
    );
  };

  const deleteDiaryEntry = async (id) => {
    try {
      await axios.delete(`http://10.0.2.2:3000/diaryEntries/${id}`);
      fetchDiaryEntries();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddButtonPress = () => {
    const currentDate = new Date().toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
    setNewDate(currentDate);
    setAddModalVisible(true);
  };

  return (
    <LinearGradient colors={['#9FCD65', '#999999']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../images/backicon.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            <Image style={{ width: 70, height: 70 }} source={require('../images/imgtinhthan.png')} />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(!filterVisible)}>
            <Icon name="filter" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {filterVisible && (
          <View style={styles.filterContainer}>
            <TextInput
              value={filterYear}
              onChangeText={setFilterYear}
              style={styles.filterInput}
              placeholder="Năm (YYYY)"
              keyboardType="numeric"
            />
            <TextInput
              value={filterMonth}
              onChangeText={setFilterMonth}
              style={styles.filterInput}
              placeholder="Tháng (MM)"
              keyboardType="numeric"
            />
            <TextInput
              value={filterDay}
              onChangeText={setFilterDay}
              style={styles.filterInput}
              placeholder="Ngày (DD)"
              keyboardType="numeric"
            />
          </View>
        )}

        <FlatList
          data={Object.keys(groupedEntries).flatMap(yearMonth => 
            Object.keys(groupedEntries[yearMonth]).flatMap(day => 
              [
                { type: 'header', yearMonth, day },
                ...groupedEntries[yearMonth][day]
              ]
            )
          )}
          keyExtractor={(item, index) => (item.type === 'header' ? `header-${index}` : item.id.toString())}
          renderItem={({ item }) => 
            item.type === 'header' 
              ? renderHeader(item) 
              : renderItem({ item })
          }
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
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
  shareIconButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  filterInput: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius:10,
    padding: 10,
    width: '30%',
  },
  headerContainer: {
    backgroundColor: '#F0F8FF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00BFFF',
  },
});

export default TinhThanScreen;
