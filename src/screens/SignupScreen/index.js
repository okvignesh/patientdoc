import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';

const SignupScreen = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [speciality, setSpeciality] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSignup = async data => {
    try {
      console.log('Signup pressed');
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      console.log('User Account Created!');

      await userCredential.user.updateProfile({
        displayName: name + '=' + selectedUserType,
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('email', {
          type: 'manual',
          message: 'Email address is already in use.',
        });
      } else if (error.code === 'auth/invalid-email') {
        setError('email', {type: 'manual', message: 'Invalid email address.'});
      } else {
        console.log('Unexpected error during signup: ', error);
        Alert.alert('An unexpected error occurred during signup.');
      }
    }
  };

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const renderDoctorFields = () => {
    if (selectedUserType === 'doctor') {
      return (
        <>
          <TextInput
            testID="signup_location_input"
            autoCapitalize="none"
            style={styles.input}
            placeholder="Enter your Location"
            onChangeText={text => setLocation(text)}
            value={location}
          />
          <TextInput
            testID="signup_speciality_input"
            autoCapitalize="none"
            style={styles.input}
            placeholder="Enter your Speciality"
            onChangeText={text => setSpeciality(text)}
            value={speciality}
          />
        </>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text testID="signup_title" style={styles.title}>
        Sign Up
      </Text>

      <TouchableOpacity
        testID="toggle_modal_button"
        style={styles.button}
        onPress={toggleModal}>
        <Text style={styles.buttonText}>Select User Type</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.userTypeButton}
            onPress={() => {
              setSelectedUserType('patient');
              toggleModal();
            }}>
            <Text style={styles.buttonText}>Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userTypeButton}
            onPress={() => {
              setSelectedUserType('doctor');
              toggleModal();
            }}>
            <Text style={styles.buttonText}>Doctor</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TextInput
        testID="signup_name_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your Name"
        onChangeText={text => setName(text)}
        value={name}
      />

      <TextInput
        testID="signup_email_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />

      <TextInput
        testID="signup_password_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
      />

      <TextInput
        testID="signup_contact_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your Contact (Mobile Number)"
        onChangeText={text => setContact(text)}
        value={contact}
      />

      {renderDoctorFields()}

      <TouchableOpacity
        testID="signup_submit_button"
        style={styles.button}
        onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="goto_login"
        style={styles.button}
        onPress={handleLogin}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#27ae60',
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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  userTypeButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
});

export default SignupScreen;
