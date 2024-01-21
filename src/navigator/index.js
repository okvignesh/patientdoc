import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  LoginScreen,
  SignupScreen,
  DashboardScreen,
  UserProfile,
  UpcomingAppointments,
  AppointmentHistory,
  CreateAppointment,
  ManageAppointments,
} from '../screens';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const Navigator = () => {
  const [user, setUser] = useState(undefined);
  const [userType, setUserType] = useState('patient');

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  function onAuthStateChanged(user) {
    // console.log(auth().currentUser.uid);
    const fetchUserType = async () => {
      try {
        if (auth().currentUser) {
          const userProfileRef = firestore().collection('UserProfile');
          const userSnapshot = await userProfileRef
            .where('uid', '==', auth().currentUser.uid)
            .get();
          console.log('Test this');

          if (!userSnapshot.empty) {
            // User profile exists, update state with existing data
            const userData = userSnapshot.docs[0].data();
            setUserType(userData.userType);
            setUser(user);
          }
        } else {
          setUser(user);
        }
      } catch (error) {
        console.log('Error ? ', error);
      }
    };

    fetchUserType();
    // setUser(user);
  }

  const isLoggedIn = !!user;

  useEffect(() => {
    try {
      if (auth().currentUser) {
        const fetchUserType = async () => {
          const userProfileRef = firestore().collection('UserProfile');
          const userSnapshot = await userProfileRef
            .where('uid', '==', auth().currentUser.uid)
            .get();

          if (!userSnapshot.empty) {
            // User profile exists, update state with existing data
            const userData = userSnapshot.docs[0].data();
            setUserType(userData.userType);
          }
        };

        fetchUserType();
      }
    } catch (error) {
      console.log('Error ? ', error);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      console.log('User Logged Out Successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // const DrawerNav = () => {
  //   return (
  //     <Drawer.Navigator
  //       screenOptions={{
  //         headerShown: true,
  //       }}
  //       drawerContent={props => (
  //         <DrawerContentScrollView {...props}>
  //           <DrawerItemList {...props} />
  //           <DrawerItem label="Logout" onPress={handleLogout} />
  //         </DrawerContentScrollView>
  //       )}>
  //       <Drawer.Screen
  //         name="UserProfile"
  //         component={UserProfile}
  //         initialParams={{ userType: userType }} // Pass userType as a parameter
  //       />
  //       <Drawer.Screen
  //         name="UpcomingAppointments"
  //         component={UpcomingAppointments}
  //         initialParams={{ userType: userType }} // Pass userType as a parameter
  //       />
  //       <Drawer.Screen
  //         name="AppointmentHistory"
  //         component={AppointmentHistory}
  //         initialParams={{ userType: userType }} // Pass userType as a parameter
  //       />
  //       {userType === 'doctor' && (
  //         <>
  //           <Drawer.Screen
  //             name="ManageAppointments"
  //             component={ManageAppointments}
  //             initialParams={{ userType: userType }} // Pass userType as a parameter
  //           />
  //         </>
  //       )}
  //       {userType === 'patient' && (
  //         <>
  //           <Drawer.Screen
  //             name="CreateAppointment"
  //             component={CreateAppointment}
  //             initialParams={{ userType: userType }} // Pass userType as a parameter
  //           />
  //         </>
  //       )}
  //     </Drawer.Navigator>
  //   );
  // };

  const DrawerNav = () => {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: true,
        }}
        drawerContent={props => (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Logout" onPress={handleLogout} />
          </DrawerContentScrollView>
        )}>
        <Drawer.Screen name="UserProfile" component={UserProfile} />
        <Drawer.Screen
          name="UpcomingAppointments"
          component={UpcomingAppointments}
          initialParams={{userType: userType}} // Passing userType as a parameter
        />
        <Drawer.Screen
          name="AppointmentHistory"
          component={AppointmentHistory}
          initialParams={{userType: userType}} // Passing userType as a parameter
        />
        {userType === 'doctor' && (
          <>
            <Drawer.Screen
              name="ManageAppointments"
              component={ManageAppointments}
            />
          </>
        )}
        {userType === 'patient' && (
          <>
            <Drawer.Screen
              name="CreateAppointment"
              component={CreateAppointment}
            />
          </>
        )}
      </Drawer.Navigator>
    );
  };

  const authNav = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
      </Stack.Navigator>
    );
  };

  return isLoggedIn ? DrawerNav() : authNav();
};

export default Navigator;
