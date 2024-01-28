import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DatePickerModal from '../../components/DatePickerModal';
import moment from 'moment';

const CreateAppointment = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [appmtDate, setAppmtDate] = useState('');
  const [appmtTime, setAppmtTime] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [viewProfileModalVisible, setViewProfileModalVisible] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [date_time, setDate_time] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const date = date => {
    return moment(date).format('MMMM Do YYYY');
  };
  const time = time => {
    return moment(time).format('hh:mm A');
  };

  const openDatePicker = () => {
    setDatePickerModalVisible(true);
  };

  useEffect(() => {
    // Debouncing search to avoid multiple queries in a short time
    const delaySearch = setTimeout(() => {
      console.log('Calling Search Doctors');
      searchDoctors();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchText]);

  const searchDoctors = async () => {
    try {
      const doctorsRef = firestore().collection('UserProfile');
      let query = doctorsRef.where('userType', '==', 'doctor');

      if (searchText.length >= 1 && searchText.trim() !== '') {
        const specialityQuery = query
          .where('speciality', '>=', searchText)
          .where('speciality', '<=', searchText + '\uf8ff');

        const nameQuery = query
          .where('name', '>=', searchText)
          .where('name', '<=', searchText + '\uf8ff');

        const locationQuery = query
          .where('location', '>=', searchText)
          .where('location', '<=', searchText + '\uf8ff');

        const [specialityResults, nameResults, locationResults] =
          await Promise.allSettled([
            specialityQuery.get(),
            nameQuery.get(),
            locationQuery.get(),
          ]);

        const validSpecialityResults =
          specialityResults.status === 'fulfilled'
            ? specialityResults.value.docs
            : [];

        const validNameResults =
          nameResults.status === 'fulfilled' ? nameResults.value.docs : [];

        const validLocationResults =
          locationResults.status === 'fulfilled'
            ? locationResults.value.docs
            : [];

        const results = [
          ...validSpecialityResults,
          ...validNameResults,
          ...validLocationResults,
        ];

        if (results && Array.isArray(results)) {
          const uniqueResults = Array.from(new Set(results.map(a => a.id))).map(
            id => {
              return results.find(a => a.id === id);
            },
          );
          const doctors = uniqueResults.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setSearchResults(doctors);
        } else {
          // No results or not an array, return empty results
          setSearchResults([]);
        }
      } else {
        // No searchText, return empty results
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching for doctors:', error);
    }
  };

  const requestAppointment = async () => {
    try {
      const userId = auth().currentUser.uid;
      const patientName = auth().currentUser.displayName;
      const appointmentRef = firestore().collection('Appointment');

      // Add the appointment record
      await appointmentRef.add({
        doctorId: selectedDoctor.uid,
        patientId: userId,
        patientName,
        doctorName: selectedDoctor.name,
        appmtDate,
        appmtTime,
        customMessage,
        status: 'pending',
      });

      setModalVisible(false);
    } catch (error) {
      console.error('Error requesting appointment:', error);
    }
  };

  const getDoctorDataById = async (doctorId, collectionName) => {
    try {
      const doctorDataRef = firestore().collection(collectionName);
      const querySnapshot = await doctorDataRef
        .where('uid', '==', doctorId)
        .get();

      const doctorData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return doctorData;
    } catch (error) {
      console.log(
        `Error fetching ${collectionName} for doctor ID ${doctorId}:`,
        error,
      );
    }
  };

  const renderDoctorItem = ({item}) => (
    <View>
      <TouchableOpacity
        style={styles.doctorItem}
        onPress={() => setSelectedDoctor(item)}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorDetails}>{item.speciality}</Text>
        <Text style={styles.doctorDetails}>{item.location}</Text>
        <Text style={styles.doctorDetails}>{item.contact}</Text>
        <TouchableOpacity
          style={styles.appointmentButton}
          onPress={() => {
            setSelectedDoctor(item);
            setModalVisible(true);
          }}>
          <Text style={styles.buttonText}>Request Appointment</Text>
        </TouchableOpacity>

        {/* Add "View Doctor Profile" button */}
        <TouchableOpacity
          style={styles.appointmentButton}
          onPress={() => viewDoctorProfile(item)}>
          <Text style={styles.buttonText}>View Doctor Profile</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  // Function to fetch and display doctor's profile in the modal
  const viewDoctorProfile = async doctor => {
    try {
      const userProfile = await getDoctorDataById(doctor.uid, 'UserProfile');
      const qualifications = await getDoctorDataById(
        doctor.uid,
        'Qualification',
      );
      const experiences = await getDoctorDataById(doctor.uid, 'Experience');

      const doctorProfile = {
        userProfile,
        qualifications,
        experiences,
      };

      console.log(doctorProfile.userProfile);
      console.log(doctorProfile.qualifications);
      console.log(doctorProfile.experiences);

      setDoctorProfile(doctorProfile);
      setViewProfileModalVisible(true);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Search for Doctors</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Speciality, Name or Location"
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      <FlatList
        data={searchResults}
        keyExtractor={item => item.id}
        renderItem={renderDoctorItem}
        ListEmptyComponent={<Text>No doctors found</Text>}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Request Appointment</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Appointment Date"
            value={appmtDate}
            onChangeText={text => setAppmtDate(text)}
          />

          <TouchableWithoutFeedback
            onPress={() => {
              setEndOpen(true);
            }}>
            <Text style={styles.modalInput}>{time(date_time)}</Text>
          </TouchableWithoutFeedback>

          <TextInput
            style={styles.modalInput}
            placeholder="Custom Message"
            value={customMessage}
            onChangeText={text => setCustomMessage(text)}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={requestAppointment}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <DatePickerModal
            mode={'time'}
            open={endOpen}
            setOpen={setEndOpen}
            currentDate={date_time}
            setCurrentDate={setDate_time}
            modal={true}
            minuteInterval={15}
          />
        </View>
      </Modal>

      {/* Modal to view doctor's profile */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={viewProfileModalVisible}
        onRequestClose={() => setViewProfileModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Doctor's Profile</Text>
          {/* Display doctor's profile information here */}
          {doctorProfile && (
            <View>
              <Text>Name: {doctorProfile.userProfile[0]?.name}</Text>
              <Text>
                Speciality: {doctorProfile.userProfile[0]?.speciality}
              </Text>
              <Text>Contact: {doctorProfile.userProfile[0]?.contact}</Text>

              {/* Display Qualifications */}
              <Text style={styles.modalSubHeading}>Qualifications:</Text>
              {doctorProfile.qualifications.map((qualification, index) => (
                <Text key={index}>{qualification?.degreeName}</Text>
              ))}

              {/* Display Experiences */}
              <Text style={styles.modalSubHeading}>Experiences:</Text>
              {doctorProfile.experiences.map((experience, index) => (
                <View>
                  <Text key={index}>{experience?.clinic}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setViewProfileModalVisible(false)}>
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
  searchInput: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  doctorItem: {
    width: '80%',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  doctorDetails: {
    fontSize: 16,
    marginBottom: 8,
  },
  appointmentButton: {
    backgroundColor: '#27ae60',
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
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
  modalInput: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  modalButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  modalSubHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default CreateAppointment;
