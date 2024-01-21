import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const SignupScreen = ({navigation}) => {
  const fadeInUp = useSharedValue(0);
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

  fadeInUp.value = withSpring(1, {damping: 10, stiffness: 80});

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInUp.value,
      transform: [{translateY: fadeInUp.value * 100}],
    };
  });

  const handleSignup = async () => {
    try {
      console.log('Signup pressed');
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      console.log('User Account Created!');

      const userObject = {
        uid: userCredential.user.uid,
        name,
        email,
        contact,
        userType: selectedUserType,
        location,
        speciality,
      };

      await firestore().collection('UserProfile').add(userObject);

      await userCredential.user.updateProfile({
        displayName: name,
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
            style={styles.input}
            placeholder="Enter your Location"
            onChangeText={text => setLocation(text)}
            value={location}
          />
          <TextInput
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
    <ImageBackground
      source={require('../../../assets/images/background.png')}
      style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('../../../assets/images/light.png')}
        style={styles.lightImage1}
      />
      <Image
        source={require('../../../assets/images/light.png')}
        style={styles.lightImage2}
      />
      <Animated.View style={[animatedContainerStyle, styles.contentContainer]}>
        <ScrollView>
          <Text style={styles.headerText}>Sign Up</Text>

          <View style={styles.inlineContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleModal}>
              <Text style={styles.buttonText}>Change User Type</Text>
            </TouchableOpacity>

            <TextInput
              style={[styles.input1, styles.userTypeInput]}
              value={selectedUserType}
              editable={false}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter your Name"
            onChangeText={text => setName(text)}
            value={name}
          />

          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="Enter your Email"
            onChangeText={text => setEmail(text)}
            value={email}
          />

          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="Enter your Password"
            secureTextEntry
            onChangeText={text => setPassword(text)}
            value={password}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your Contact (Mobile Number)"
            onChangeText={text => setContact(text)}
            value={contact}
          />

          {renderDoctorFields()}

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: 120, // Line is coming while scrolling, why?
  },
  lightImage1: {
    position: 'absolute',
    top: -60,
    left: 20,
    height: 225,
    width: 90,
  },
  lightImage2: {
    position: 'absolute',
    top: -10,
    right: 20,
    height: 160,
    width: 65,
    opacity: 0.75,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    marginTop: '-25%', // Adjust the marginTop as needed
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 'auto', // Center horizontally
    marginRight: 'auto', // Center horizontally
    alignItems: 'center',
    justifyContent: 'center',
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
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 30,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  input1: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 25,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
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
  inlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userTypeInput: {
    flex: 1,
    marginLeft: 5,
  },
});

export default SignupScreen;
