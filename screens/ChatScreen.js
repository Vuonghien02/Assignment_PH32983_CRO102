import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ChatBubble = ({ message, isUser }) => {
  return (
    <View style={[styles.chatBubble, isUser ? styles.userBubble : styles.coachBubble]}>
      <Text style={styles.chatText}>{message.text}</Text>
      <Text style={styles.timeText}>{message.time}</Text>
    </View>
  );
};

const ChatScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const chatId = `chat_${category}`;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('time', 'asc')
      .onSnapshot(snapshot => {
        const messages = snapshot.docs.map(doc => doc.data());
        setMessages(messages);
      }, error => {
        console.error('Error fetching messages:', error);
      });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (inputText.trim()) {
      const newMessage = {
        text: inputText,
        time: new Date().toLocaleTimeString(),
        sender: 'user',
      };

      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add(newMessage);

      setInputText('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat for {category}</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatBubble message={item} isUser={item.sender === 'user'} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Send a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Text style={styles.goBackButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6FAF3',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#66CC8A',
    color: '#fff',
  },
  chatContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    flexGrow: 1,
  },
  chatBubble: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '75%',
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  coachBubble: {
    backgroundColor: '#fff',
    borderColor: '#66CC8A',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  chatText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#66CC8A',
    fontSize: 16,
  },
  goBackButton: {
    margin: 10,
    padding: 10,
    backgroundColor: '#FF6F61',
    borderRadius: 5,
    alignItems: 'center',
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChatScreen;
