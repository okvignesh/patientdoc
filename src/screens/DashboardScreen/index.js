// screens/DashboardScreen.js
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';

const DashboardScreen = ({navigation}) => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      console.log('User Logged Out Successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View>
      <Text>Welcome to Hello Doc!</Text>
      <TouchableOpacity onPress={() => handleLogout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;
