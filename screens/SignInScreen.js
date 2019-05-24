import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Button,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
        <Image
          source={require('../assets/images/nano.png')} 
          style={styles.welcomeImage}
        />
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Please enter your username..."
            style={styles.inputStyle}
          />
          <TextInput 
            placeholder="Please enter your password..." 
            secureTextEntry={true}
            style={styles.inputStyle}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            title="Sign In" 
            color="#4088d5" 
            onPress={this._signInAsync} 
          />
        </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 80,
    alignItems:'center'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  welcomeImage: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginTop: 3,
  },
  inputContainer: {
    width: '75%',
  },
  buttonContainer: {
    marginTop: 30,
    width: '50%',
    marginBottom: 30
  },
  inputStyle: {
    fontSize: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgb(180,180,180)',
    marginBottom: 35,
    paddingBottom: 5,
  }
});