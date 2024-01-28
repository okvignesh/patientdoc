import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AppointmentHistory = ({route}) => {
  const [appointments, setAppointments] = useState([]);
  const userType = route.params.userType; // Assuming 'doctor' or 'patient'

  useEffect(() => {
    const user = auth().currentUser;

    const fetchData = async () => {
      try {
        if (user) {
          const userId = user.uid;
          const fieldName = userType === 'doctor' ? 'doctorId' : 'patientId';
          const appointmentsRef = firestore().collection('Appointment');

          // Set up a real-time listener
          const unsubscribe = appointmentsRef
            .where(fieldName, '==', userId)
            .onSnapshot(snapshot => {
              const appointmentData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
              setAppointments(appointmentData);
            });

          // Return the unsubscribe function to clean up the listener when the component unmounts
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchData();

    // Specify the dependencies for the effect
  }, [userType]);

  const renderAppointmentItem = ({item}) => (
    <TouchableOpacity style={styles.appointmentItem}>
      <Text style={styles.label}>Patient: </Text>
      <Text style={styles.value}>{item.patientName}</Text>

      <Text style={styles.label}>Doctor: </Text>
      <Text style={styles.value}>{item.doctorName}</Text>

      <Text style={styles.label}>Date & Time: </Text>
      <Text style={styles.value}>{`${item.appmtDate} ${item.appmtTime}`}</Text>

      <Text style={styles.label}>Custom Message: </Text>
      <Text style={styles.value}>{item.customMessage}</Text>

      <Text style={styles.label}>Status: </Text>
      <Text style={styles.status}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/images/background.png')} // Replace with the actual path to your background image
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={renderAppointmentItem}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No appointments found</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    color: '#555',
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
    color: '#27ae60', // Green color for status
  },
  emptyListText: {
    color: '#fff', // White text color
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AppointmentHistory;
