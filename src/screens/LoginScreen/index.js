import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async data => {
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);
      console.log('User Logged in successfully!', response?.user);
      // navigation.navigate('ProfileScreen', response?.user?.displayName);
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setError('email', {type: 'manual', message: 'Invalid email address'});
      }
      console.error(error);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('SignupScreen');
  };

  return (
    <View style={styles.container}>
      <Text testID="welcome" style={styles.title}>
        welcome
      </Text>
      <Text testID="initial_login_title" style={styles.title}>
        Login
      </Text>

      <TextInput
        testID="email_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={text => setEmail(text)}
        value={email}
      />

      <TextInput
        testID="password_input"
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
      />

      <TouchableOpacity
        testID="login_button"
        style={styles.button}
        onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity testID="signup_button" onPress={navigateToSignup}>
        <Text style={styles.signupText}>No Account? Signup now !</Text>
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
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#3498db',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  languageButton: {
    padding: 10,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  buttonText2: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  langName: {
    fontSize: 16,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#54afd8',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: '#E23f2c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});

export default LoginScreen;
