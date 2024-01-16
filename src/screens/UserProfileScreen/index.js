import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';

const UserProfile = () => {
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
      <Text>UserProfile</Text>
      <TouchableOpacity onPress={() => handleLogout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
