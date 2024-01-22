import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState({
    contact: '',
    email: '',
    location: '',
    name: '',
    speciality: '',
    userType: '',
  });

  const [qualificationModalVisible, setQualificationModalVisible] =
    useState(false);
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);

  const [degreeName, setDegreeName] = useState('');
  const [institute, setInstitute] = useState('');
  const [passingYear, setPassingYear] = useState('');

  const [clinic, setClinic] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [description, setDescription] = useState('');

  const [qualifications, setQualifications] = useState([]);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    // Fetch user profile information from Firestore
    const fetchUserProfile = async () => {
      try {
        const uid = auth().currentUser.uid;
        const userProfileRef = firestore().collection('UserProfile');
        const userSnapshot = await userProfileRef.where('uid', '==', uid).get();

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUserProfile(userData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // Fetch qualifications and experiences
    const fetchQualifications = async () => {
      try {
        const uid = auth().currentUser.uid;
        const qualificationRef = firestore()
          .collection('Qualification')
          .where('uid', '==', uid);

        qualificationRef.onSnapshot(querySnapshot => {
          const data = [];
          querySnapshot.forEach(doc => {
            data.push(doc.data());
          });
          setQualifications(data);
        });
      } catch (error) {
        console.error('Error fetching qualifications:', error);
      }
    };

    const fetchExperiences = async () => {
      try {
        const uid = auth().currentUser.uid;
        const experienceRef = firestore()
          .collection('Experience')
          .where('uid', '==', uid);

        experienceRef.onSnapshot(querySnapshot => {
          const data = [];
          querySnapshot.forEach(doc => {
            data.push(doc.data());
          });
          setExperiences(data);
        });
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    };

    fetchUserProfile();
    fetchQualifications();
    fetchExperiences();
  }, []);

  const handleSaveProfile = async () => {
    // Save the updated profile back to Firestore
    try {
      const uid = auth().currentUser.uid;
      const userProfileRef = firestore().collection('UserProfile');
      const userSnapshot = await userProfileRef.where('uid', '==', uid).get();

      if (userProfile.userType === 'patient') {
        // Update only patient-specific fields
        await userProfileRef.doc(userSnapshot.docs[0].id).update({
          name: userProfile.name,
          email: userProfile.email,
          contact: userProfile.contact,
        });
      } else if (userProfile.userType === 'doctor') {
        // Update only doctor-specific fields
        await userProfileRef.doc(userSnapshot.docs[0].id).update({
          name: userProfile.name,
          email: userProfile.email,
          contact: userProfile.contact,
          location: userProfile.location,
          speciality: userProfile.speciality,
        });
      }

      console.log('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleAddQualification = async () => {
    try {
      const uid = auth().currentUser.uid;
      await firestore().collection('Qualification').add({
        uid,
        degreeName,
        institute,
        passingYear,
      });
      setQualificationModalVisible(false);
    } catch (error) {
      console.error('Error adding qualification:', error);
    }
  };

  const handleAddExperience = async () => {
    try {
      const uid = auth().currentUser.uid;
      await firestore().collection('Experience').add({
        uid,
        clinic,
        startYear,
        endYear,
        description,
      });
      setExperienceModalVisible(false);
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  return (
    <View contentContainerStyle={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>User Profile</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={userProfile.name}
            onChangeText={text => setUserProfile({...userProfile, name: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={userProfile.email}
            onChangeText={text => setUserProfile({...userProfile, email: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your contact number"
            value={userProfile.contact}
            onChangeText={text =>
              setUserProfile({...userProfile, contact: text})
            }
          />
        </View>

        {userProfile.userType === 'doctor' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your location"
                value={userProfile.location}
                onChangeText={text =>
                  setUserProfile({...userProfile, location: text})
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Speciality</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your speciality"
                value={userProfile.speciality}
                onChangeText={text =>
                  setUserProfile({...userProfile, speciality: text})
                }
              />
            </View>
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.subHeading}>Qualifications</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setQualificationModalVisible(true)}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <FlatList
            data={qualifications}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <Text>{item.degreeName}</Text>
                <Text>{item.institute}</Text>
                <Text>{item.passingYear}</Text>
              </View>
            )}
            ListEmptyComponent={() => <Text>No Records Found</Text>}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.subHeading}>Experiences</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setExperienceModalVisible(true)}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <FlatList
            data={experiences}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <Text>{item.clinic}</Text>
                <Text>{item.startYear}</Text>
                <Text>{item.endYear}</Text>
                <Text>{item.description}</Text>
              </View>
            )}
            ListEmptyComponent={() => <Text>No Records Found</Text>}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Qualification Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={qualificationModalVisible}
        onRequestClose={() => setQualificationModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.subHeading}>Add Qualification</Text>
            <TextInput
              style={styles.input}
              placeholder="Degree Name"
              value={degreeName}
              onChangeText={text => setDegreeName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Institute"
              value={institute}
              onChangeText={text => setInstitute(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Passing Year"
              value={passingYear}
              onChangeText={text => setPassingYear(text)}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddQualification}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setQualificationModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Experience Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={experienceModalVisible}
        onRequestClose={() => setExperienceModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.subHeading}>Add Experience</Text>
            <TextInput
              style={styles.input}
              placeholder="Clinic"
              value={clinic}
              onChangeText={text => setClinic(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Start Year"
              value={startYear}
              onChangeText={text => setStartYear(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="End Year"
              value={endYear}
              onChangeText={text => setEndYear(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={text => setDescription(text)}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddExperience}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setExperienceModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
});

export default UserProfile;
