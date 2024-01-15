import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const SignupScreen = ({navigation}) => {
  const handleSignup = () => {
    Alert.alert('Signup Successful');
    navigation.navigate('LoginScreen');
  };

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text testID="signup_title" style={styles.title}>
        Sign Up
      </Text>

      <TextInput
        testID="signup_username_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your Name"
      />

      <TextInput
        testID="signup_email_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your Email"
      />

      <TextInput
        testID="signup_password_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your Password"
        secureTextEntry
      />

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
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
