// PubNubScreen.js
import React, {useEffect, useState} from 'react';
import PubNub from 'pubnub';
import {PubNubProvider, usePubNub} from 'pubnub-react';
import {Text, View, TouchableOpacity, TextInput, FlatList} from 'react-native';
import auth from '@react-native-firebase/auth';

const pubnub = new PubNub({
  publishKey: 'pub-c-f2919219-ac20-4403-b537-a678b79b4381',
  subscribeKey: 'sub-c-c5ddc634-c6fc-11e7-afd4-56ea5891403c',
  uuid: auth().currentUser ? auth().currentUser.uid : 'sdkjsdfgsjkhfgskjfgk',
});

const PubNubScreen = ({route, navigation}) => {
  const {user, userType} = route.params;
  console.log(user);
  console.log(userType);
  const [chatEnded, setChatEnded] = useState(false);

  useEffect(() => {
    setChatEnded(false);
  }, []);

  useEffect(() => {
    setChatEnded(false);
  }, [route]);

  const handleEndChat = () => {
    setChatEnded(true);
    navigation.navigate('UpcomingAppointments');
  };

  return (
    <PubNubProvider client={pubnub}>
      <Chat user={user} chatEnded={chatEnded} onEndChat={handleEndChat} />
    </PubNubProvider>
  );
};

function Chat({user, chatEnded, onEndChat}) {
  const pubnub = usePubNub();
  function createUniqueChannelName(userId1, userId2) {
    // Sort user IDs alphabetically
    const sortedUserIds = [userId1, userId2].sort();

    console.log(sortedUserIds);

    // Use a separator (you can choose any character that suits your needs)
    const separator = '_';

    // Concatenate sorted user IDs with the separator
    const concatenatedIds = sortedUserIds.join(separator);

    console.log(concatenatedIds);

    // Return the concatenated string as the unique channel name
    return concatenatedIds;
  }

  const uniqueChannelName = createUniqueChannelName(
    user.doctorId,
    user.patientId,
  );

  const [channels] = useState([uniqueChannelName]); //ITC
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const fetchChatHistory = async () => {
    try {
      const history = await pubnub.history({
        channel: channels[0],
        count: 100, // adjust the count based on your needs
      });

      const messages = history.messages.map(msg => msg.entry);
      setMessages(messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    const handleMessage = event => {
      const message = event.message;
      console.log('Received message', message);

      if (typeof message === 'string' || message.hasOwnProperty('text')) {
        const text = message.text || message;
        setMessages(prevMessages => [...prevMessages, text]);
      }
    };

    pubnub.addListener({message: handleMessage});
    pubnub.subscribe({channels});

    // Fetch chat history when component mounts
    fetchChatHistory();

    return () => {
      pubnub.removeListener({message: handleMessage});
      pubnub.unsubscribe({channels});
    };
  }, [pubnub, channels]);

  const sendMessage = message => {
    if (message) {
      pubnub.publish({
        channel: channels[0],
        message,
        // storeInHistory: true, // should be true to use ttl
        // ttl: 1, // Messages will be expired in 1 hour
      });
      setMessage('');
    }
  };

  const endChat = () => {
    onEndChat();
    pubnub.unsubscribeAll();
  };

  return (
    <View style={{flex: 1, padding: 16}}>
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
        {`Chat between ${user.patientName} and ${user.doctorName}`}
      </Text>

      <FlatList
        data={messages}
        renderItem={({item, index}) => (
          <View style={{marginVertical: 5}}>
            <Text>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {!chatEnded && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            autoComplete="off"
            autoCorrect={false}
            value={message}
            onChangeText={changedText => {
              setMessage(changedText);
            }}
            placeholder="Write a message"
            style={{
              flex: 1,
              backgroundColor: 'lightgrey',
              color: 'black',
              height: 40,
              paddingHorizontal: 10,
              borderRadius: 8,
            }}
          />

          <TouchableOpacity
            style={{
              marginLeft: 10,
              backgroundColor: 'blue',
              justifyContent: 'center',
              alignItems: 'center',
              height: 44,
              borderRadius: 8,
            }}
            onPress={() => sendMessage(message)}>
            <Text style={{color: 'white'}}>Send</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* {!chatEnded && (
        <TouchableOpacity
          style={{
            marginTop: 10,
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            height: 44,
            borderRadius: 8,
          }}
          onPress={endChat}>
          <Text style={{color: 'white'}}>End Chat</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
}

export default PubNubScreen;
