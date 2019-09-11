import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text
} from 'react-native';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import * as Segment from 'expo-analytics-segment';
import segmentKeys from '../secrets/segment_keys.json';

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
      super(props);
      this.state = {
        username: '',
        password: ''
      }
  }
  
  GetValueFunction = () =>{
 
    const { TextInputValueHolder }  = this.state ;
 
  }

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
              onChangeText={(text) => this.setState({'username':text})}
              autoCapitalize = 'none'
              style={styles.inputStyle}
            />
            <TextInput 
              placeholder="Please enter your password..." 
              secureTextEntry={true}
              onChangeText={(text) => this.setState({'password':text})}
              autoCapitalize = 'none'
              style={styles.inputStyle}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={this._signInAsync} 
              >
              <Text style={styles.customButtonText}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  _signInAsync = async () => {

    if ((this.state.username==='wmukobela' && this.state.password==='nano123') || 
      (this.state.username==='testuser' && this.state.password==='idinsight123'))
    {

      Segment.initialize({ 'androidWriteKey': segmentKeys.android_write_key })
      
      if (this.state.username==='wmukobela') {
        Segment.identify(1);
      }
      else if (this.state.username==='testuser') {
        Segment.identify(2);
      }

      await AsyncStorage.setItem('userToken', 'abc');
      
      this.props.navigation.navigate('App');
    }
      else {
        Alert.alert('Incorrect Credentials','The login information you entered is incorrect. Please contact the IDinsight Nano team if this issue persists.')
      }

  };
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: '80@vs',
    alignItems:'center'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: '10@vs',
  },
  welcomeImage: {
    width: '160@s',
    height: '160@vs',
    resizeMode: 'contain',
    marginTop: '3@vs',
  },
  inputContainer: {
    width: '75%',
  },
  buttonContainer: {
    marginTop: '30@vs',
    width: '50%',
    marginBottom: '30@vs',
  },
  customButtonText: {
    fontSize: '16@ms',
    fontWeight: '600',
    color: "#fff",
  },
  customButton: {
    alignItems: 'center',
    backgroundColor: "#4088d5",
    paddingVertical: '10@ms',
    borderRadius: 3,
    elevation: 3
  },
  inputStyle: {
    fontSize: '18@ms',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgb(180,180,180)',
    marginBottom: '35@ms',
    paddingBottom: '5@ms',
  }
});