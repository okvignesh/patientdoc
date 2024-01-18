import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
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
      <Text style={styles.patientName}>{item.patientName}</Text>
      <Text style={styles.doctorName}>{item.doctorName}</Text>
      <Text
        style={styles.dateTime}>{`${item.appmtDate} ${item.appmtTime}`}</Text>
      <Text style={styles.customMessage}>{item.customMessage}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={renderAppointmentItem}
        ListEmptyComponent={<Text>No appointments found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  appointmentItem: {
    width: '80%',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 16,
    marginBottom: 8,
  },
  customMessage: {
    fontSize: 16,
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60', // Green color for status
  },
});

export default AppointmentHistory;
