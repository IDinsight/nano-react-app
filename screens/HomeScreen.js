import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity
} from 'react-native';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import * as Segment from 'expo-analytics-segment';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const {navigate} = this.props.navigation;
    const data = {
      user: {
        chiefName: 'Mukobela',
      }
    };
    Segment.screen('Home Screen');
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/nano.png')} 
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>

            <Text style={styles.getStartedText}>Wabonwa Mwami {data.user.chiefName}!</Text>

          </View>

          <View style={styles.buttonGroupContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.customButton}
                onPress={() => navigate('View')}
                >
                <Text style={styles.customButtonText}>VIEW DATA</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.customButton}
                onPress={() => navigate('Request')}
                >
                <Text style={styles.customButtonText}>REQUEST DATA</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={() => navigate('Help')} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Get help from the Nano team</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: '30@vs',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: '10@vs',
    marginBottom: '20@vs',
  },
  welcomeImage: {
    width: '120@s',
    height: '100@vs',
    resizeMode: 'contain',
    marginTop: '3@vs',
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  buttonGroupContainer: {
    marginTop: '10@vs',
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: '50@vs',
    width: '50%'
  },
  getStartedText: {
    fontSize: '17@ms0.75',
    color: 'rgba(96,100,109, 1)',
    lineHeight: '24@ms',
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: '50@vs',
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: '15@vs',
  },
  helpLinkText: {
    fontSize: '14@ms0.75',
    color: '#2e78b7',
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
});
