import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import database from '@react-native-firebase/database';

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

  const fetchDiaryEntries = () => {
    database()
      .ref('/diaryEntries')
      .once('value')
      .then(snapshot => {
        const entries = snapshot.val() ? Object.values(snapshot.val()) : [];
        const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        setDiaryEntries(sortedEntries);
      })
      .catch(error => console.error(error));
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
      await database().ref(`/diaryEntries/${selectedEntry.id}`).update({
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
      const newEntryRef = database().ref('/diaryEntries').push();
      await newEntryRef.set({
        id: newEntryRef.key,
        date: newDate,
        content: newEntryContent,
      });
      fetchDiaryEntries();
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
      await database().ref(`/diaryEntries/${id}`).remove();
      fetchDiaryEntries();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddButtonPress = () => {
    const currentDate = new Date().toISOString().split('T')[0]; 
    setNewDate(currentDate);
    setAddModalVisible(true);
  };

  return (
    <LinearGradient colors={['#ccc', '#999999']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../images/backicon.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            <Image style={{ width: 70, height: 70 }} source={require('../images/imgtinhthan.png')} />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(!filterVisible)}>
            <Icon name="filter" size={25} color="#FFFFFF" />
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
          contentContainerStyle={styles.flatListContent}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddButtonPress}
        >
          <Icon name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chỉnh sửa Nhật ký</Text>
              <TextInput
                value={newContent}
                onChangeText={setNewContent}
                style={styles.textInput}
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={updateDiaryEntry} style={[styles.modalButton, styles.updateButton]}>
                  <Text style={styles.modalButtonText}>Cập nhật</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
                  <Text style={styles.modalButtonText}>Hủy</Text>
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
              <Text style={styles.modalTitle}>Thêm Nhật ký</Text>
              <TextInput
                value={newDate}
                onChangeText={setNewDate}
                style={styles.textInput}
                placeholder="Ngày (YYYY-MM-DD)"
              />
              <TextInput
                value={newEntryContent}
                onChangeText={setNewEntryContent}
                style={styles.textInput}
                placeholder="Nội dung"
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={addDiaryEntry} style={[styles.modalButton, styles.updateButton]}>
                  <Text style={styles.modalButtonText}>Thêm</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAddModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
                  <Text style={styles.modalButtonText}>Hủy</Text>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  imageContainer: {
    alignItems: 'center',
  },
  flatListContent: {
    paddingBottom: 80,
  },
  headerContainer: {
    backgroundColor: '#A0A0A0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  diaryItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    width:'80%'
  },
  actionIcons: {
    flexDirection: 'column',
  },
  iconButton: {
    marginLeft: 10,
    marginBottom:5
  },
  addButton: {
    backgroundColor: '#00BFFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  filterButton: {
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: '#00BFFF',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
});

export default TinhThanScreen;
