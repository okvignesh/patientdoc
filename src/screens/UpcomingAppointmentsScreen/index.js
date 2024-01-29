import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UpcomingAppointments = ({route, navigation}) => {
  const [appointments, setAppointments] = useState([]);
  const userType = route.params.userType; // Assuming 'doctor' or 'patient'

  useEffect(() => {
    // Fetch upcoming appointments based on user type and status
    const userId = auth().currentUser.uid;
    const appointmentRef = firestore().collection('Appointment');

    let query;
    if (userType === 'doctor') {
      // For doctors, show 'approved' appointments
      query = appointmentRef
        .where('doctorId', '==', userId)
        .where('status', '==', 'approved');
    } else if (userType === 'patient') {
      // For patients, show 'approved' and 'pending' appointments
      query = appointmentRef
        .where('patientId', '==', userId)
        .where('status', 'in', ['approved', 'pending']);
    }

    const unsubscribe = query.onSnapshot(querySnapshot => {
      const appointmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(appointmentsData);
    });

    // Unsubscribe when component unmounts
    return () => unsubscribe();
  }, [userType]);

  const handleChat = (user, userType) => {
    navigation.navigate('PubnubScreen', {user, userType});
  };

  const renderAppointmentItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.appointmentItem,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Default White
        },
      ]}>
      <Text style={styles.label}>{`Patient:`}</Text>
      <Text style={styles.value}>{item.patientName}</Text>

      <Text style={styles.label}>{`Doctor:`}</Text>
      <Text style={styles.value}>{item.doctorName}</Text>

      <Text style={styles.label}>{`Date & Time:`}</Text>
      <Text style={styles.value}>{`${item.appmtDate} ${item.appmtTime}`}</Text>

      <Text style={styles.label}>{`Custom Message:`}</Text>
      <Text style={styles.value}>{item.customMessage}</Text>

      <Text style={styles.label}>{`Status:`}</Text>
      <Text
        style={[
          styles.status,
          {
            color:
              item.status === 'pending'
                ? 'orange'
                : item.status === 'approved'
                ? 'green'
                : item.status === 'rejected'
                ? 'red'
                : 'black',
          },
        ]}>
        {item.status}
      </Text>

      {item.status === 'approved' && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => handleChat(item, userType)}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/images/background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={renderAppointmentItem}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No upcoming appointments</Text>
          }
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background
  },
  appointmentItem: {
    width: '100%',
    marginBottom: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyListText: {
    color: '#fff', // White text color
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default UpcomingAppointments;
