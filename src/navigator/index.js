import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen, SignupScreen, DashboardScreen} from '../screens';
import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

const Navigator = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
  }

  const isLoggedIn = !!user;

  // const handleLogout = async () => {
  //   try {
  //     await auth().signOut();
  //     console.log('User Logged Out Successfully');
  //   } catch (error) {
  //     console.error('Error logging out:', error);
  //   }
  // };

  const DrawerNav = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      </Stack.Navigator>
    );
  };

  const authNav = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
      </Stack.Navigator>
    );
  };

  return isLoggedIn ? DrawerNav() : authNav();
};

export default Navigator;
