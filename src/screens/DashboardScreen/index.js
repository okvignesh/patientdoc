// screens/DashboardScreen.js
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const DashboardScreen = ({navigation}) => {
  return (
    <View>
      <Text>Welcome to Hello Doc!</Text>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;
