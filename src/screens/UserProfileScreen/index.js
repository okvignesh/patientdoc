import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
    qualification: '',
    experience: '',
    userType: '',
  });

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

    fetchUserProfile();
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
          qualification: userProfile.qualification,
          experience: userProfile.experience,
        });
      }

      console.log('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
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
          onChangeText={text => setUserProfile({...userProfile, contact: text})}
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Qualification</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your qualification"
              value={userProfile.qualification}
              onChangeText={text =>
                setUserProfile({...userProfile, qualification: text})
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Experience</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your experience"
              value={userProfile.experience}
              onChangeText={text =>
                setUserProfile({...userProfile, experience: text})
              }
            />
          </View>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
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
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#27ae60',
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

export default UserProfile;
