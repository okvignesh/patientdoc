import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const LoginScreen = ({navigation}) => {
  const fadeInUp = useSharedValue(0);

  fadeInUp.value = withSpring(1, {damping: 10, stiffness: 80});

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInUp.value,
      transform: [{translateY: fadeInUp.value * 100}],
    };
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log('User Logged in successfully!');
      // navigation.navigate('ProfileScreen');
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('SignupScreen');
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/background.png')}
      style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('../../../assets/images/light.png')}
        style={styles.lightImageLeft}
      />
      <Image
        source={require('../../../assets/images/light.png')}
        style={styles.lightImageRight}
      />
      <Text style={styles.welcomeText}>Welcome to DocConnect!</Text>
      <Animated.View style={[animatedContainerStyle, styles.animatedContainer]}>
        <Text style={styles.loginText}>Login</Text>

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="Enter your email"
          onChangeText={text => setEmail(text)}
          value={email}
        />

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="Enter your password"
          secureTextEntry
          onChangeText={text => setPassword(text)}
          value={password}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToSignup}>
          <Text style={styles.signupText}>No Account? Signup now!</Text>
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightImageLeft: {
    position: 'absolute',
    top: 10,
    left: 20,
    height: 225,
    width: 90,
  },
  lightImageRight: {
    position: 'absolute',
    top: 20,
    right: 20,
    height: 160,
    width: 65,
    opacity: 0.75,
  },
  welcomeText: {
    color: '#104692',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    position: 'absolute',
    top: '40%', // Adjust the top position as needed
  },
  animatedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  loginText: {
    color: '#0c6cb9',
    fontSize: 25,
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
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  loginButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#3498db',
    fontSize: 17,
  },
});

export default LoginScreen;
