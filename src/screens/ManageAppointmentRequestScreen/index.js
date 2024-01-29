import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch appointments with status "pending" for the logged-in doctor
    const doctorId = auth().currentUser.uid;
    const unsubscribe = firestore()
      .collection('Appointment')
      .where('doctorId', '==', doctorId)
      .where('status', '==', 'pending')
      .onSnapshot(querySnapshot => {
        const appointmentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentsData);
      });

    // Unsubscribe when component unmounts
    return () => unsubscribe();
  }, [auth().currentUser]);

  const handleAction = async status => {
    try {
      if (selectedAppointment) {
        // Update appointment status and remove from the list
        await firestore()
          .collection('Appointment')
          .doc(selectedAppointment.id)
          .update({
            status: status,
          });

        // Close the modal
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const renderAppointmentItem = ({item}) => (
    <TouchableOpacity
      style={styles.appointmentItem}
      onPress={() => {
        // fetchUserProfile(item); // Implement
        setSelectedAppointment(item);
        setModalVisible(true);
      }}>
      <Text
        style={
          styles.appointmentText
        }>{`Patient Name: ${item.patientName}`}</Text>
      {/* <Text
        style={
          styles.appointmentText
        }>{`Patient Contact: ${item.contact}`}</Text>
      <Text
        style={styles.appointmentText}>{`Patient Email: ${item.email}`}</Text> */}
      <Text
        style={
          styles.appointmentText
        }>{`Date: ${item.appmtDate}, Time: ${item.appmtTime}`}</Text>
      <Text style={styles.appointmentText}>Click To Approve or Reject</Text>
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
            <Text style={styles.emptyListText}>No pending appointments</Text>
          }
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeading}>Appointment Details</Text>
            <Text
              style={
                styles.modalText
              }>{`Patient: ${selectedAppointment?.patientName}`}</Text>
            <Text
              style={
                styles.modalText
              }>{`Date: ${selectedAppointment?.appmtDate}, Time: ${selectedAppointment?.appmtTime}`}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#4CAF50'}]}
                onPress={() => handleAction('approved')}>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#f44336'}]}
                onPress={() => handleAction('rejected')}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  appointmentItem: {
    width: '100%',
    marginBottom: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
  },
  appointmentText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  emptyListText: {
    fontSize: 16,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 8,
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 16,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageAppointments;
