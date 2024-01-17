import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
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
        setSelectedAppointment(item);
        setModalVisible(true);
      }}>
      <Text
        style={styles.appointmentText}>{`Patient: ${item.patientName}`}</Text>
      <Text
        style={
          styles.appointmentText
        }>{`Date: ${item.appmtDate}, Time: ${item.appmtTime}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={renderAppointmentItem}
        ListEmptyComponent={<Text>No pending appointments</Text>}
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
              style={[styles.modalButton, {backgroundColor: 'green'}]}
              onPress={() => handleAction('approved')}>
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, {backgroundColor: 'red'}]}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 8,
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
