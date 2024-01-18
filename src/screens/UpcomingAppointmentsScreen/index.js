import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UpcomingAppointments = ({route}) => {
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

  const handleChat = () => {
    // Placeholder for the chat feature (optional)
    Alert.alert('Chat Feature under Implementation');
  };

  const renderAppointmentItem = ({item}) => (
    <TouchableOpacity style={styles.appointmentItem}>
      <Text
        style={styles.appointmentText}>{`Patient: ${item.patientName}`}</Text>
      <Text style={styles.appointmentText}>{`Doctor: ${item.doctorName}`}</Text>
      <Text
        style={
          styles.appointmentText
        }>{`Date: ${item.appmtDate}, Time: ${item.appmtTime}`}</Text>
      <Text
        style={
          styles.appointmentText
        }>{`Custom Message: ${item.customMessage}`}</Text>
      <Text style={styles.appointmentText}>{`Status: ${item.status}`}</Text>
      {item.status === 'approved' && (
        <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={renderAppointmentItem}
        ListEmptyComponent={<Text>No upcoming appointments</Text>}
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
  appointmentText: {
    fontSize: 16,
    marginBottom: 8,
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
});

export default UpcomingAppointments;
