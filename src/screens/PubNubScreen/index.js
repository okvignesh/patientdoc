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
      <Chat
        user={user}
        userType={userType}
        chatEnded={chatEnded}
        onEndChat={handleEndChat}
      />
    </PubNubProvider>
  );
};

function Chat({user, userType, chatEnded, onEndChat}) {
  const pubnub = usePubNub();

  const createUniqueChannelName = (userId1, userId2) => {
    const sortedUserIds = [userId1, userId2].sort();
    const separator = '_';
    const concatenatedIds = sortedUserIds.join(separator);
    return concatenatedIds;
  };

  const uniqueChannelName = createUniqueChannelName(
    user.doctorId,
    user.patientId,
  );

  const [channels] = useState([uniqueChannelName]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const fetchChatHistory = async () => {
    try {
      const history = await pubnub.history({
        channel: channels[0],
        count: 100,
      });

      const formattedMessages = history.messages.map(msg => {
        const formattedMessage = {
          ...msg.entry,
          userType: msg.entry.userType || '',
        };
        return formattedMessage;
      });

      setMessages(formattedMessages);
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
        const formattedMessage = {text, userType: message.userType || ''};
        setMessages(prevMessages => [...prevMessages, formattedMessage]);
      }
    };

    pubnub.addListener({message: handleMessage});
    pubnub.subscribe({channels});

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
        message: {text: message, userType},
      });
      setMessage('');
    }
  };

  const endChat = () => {
    pubnub.unsubscribeAll();
    onEndChat();
  };

  return (
    <View style={{flex: 1, padding: 16}}>
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
        {`Chat between ${user.patientName} and ${user.doctorName}`}
      </Text>

      <FlatList
        data={messages}
        renderItem={({item, index}) => {
          const isCurrentUserMessage = item.userType === userType;

          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: isCurrentUserMessage
                  ? 'flex-end'
                  : 'flex-start',
                marginVertical: 5,
              }}>
              {isCurrentUserMessage ? (
                <>
                  <Text style={{marginRight: 10, fontWeight: 'bold'}}>
                    {userType === 'doctor'
                      ? `${user.doctorName}`
                      : `${user.patientName}`}
                  </Text>
                  <View
                    style={{
                      backgroundColor: 'lightblue',
                      borderRadius: 8,
                      padding: 8,
                    }}>
                    <Text>{item.text}</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={{marginRight: 10, fontWeight: 'bold'}}>
                    {userType === 'doctor'
                      ? `${user.patientName}`
                      : `${user.doctorName}`}
                  </Text>
                  <View
                    style={{
                      backgroundColor: 'lightgrey',
                      borderRadius: 8,
                      padding: 8,
                    }}>
                    <Text>{item.text}</Text>
                  </View>
                </>
              )}
            </View>
          );
        }}
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
      {!chatEnded && (
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
      )}
    </View>
  );
}

export default PubNubScreen;
