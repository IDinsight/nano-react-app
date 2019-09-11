import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import * as Segment from 'expo-analytics-segment';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
    headerTitleStyle: {fontSize:32},
    headerStyle: {height:80}
  };

  format_data = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    else {
      return value;
    }
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  render() {

    Segment.screen('Profile Screen')

    const data = {
      user: [
        {
          label: 'Chiefdom',
          value: 'Mukobela',
        },
        {
          label: 'Name',
          value: 'Wesley Shabongwe Mukobela',
        },
        {
          label: 'Title',
          value: 'Chief Mukobela'
        },
        {
          label: 'Phone',
          value: [
            '+260962848880',
            '+260953010443',
            '+260966278351',
            '+260977278351',
            '+260760781006'
            ],
        },
        {
          label: 'Email Address',
          value: 'wesleymukobela@yahoo.com',
        }
      ]
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.listContainer}>
        {
          data.user.map((item, i) => {
            return (
              <ListItem
                key={i}
                title={<View><Text style={styles.titleStyle}>{item.label}</Text></View>}
                subtitle={<View><Text style={styles.subtitleStyle}>{this.format_data(item.value)}</Text></View>}
                bottomDivider={false}
              />
            );
          })
        }
        </View>
        <View style={styles.welcomeContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={this._signOutAsync} 
              >
              <Text style={styles.customButtonText}>SIGN OUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingTop: '25@vs',
    backgroundColor: '#fff',
  },
  listContainer: {
    marginHorizontal: '15@s',
  },
  titleStyle: {
    fontSize:'14@ms',
  },
  subtitleStyle: {
    color: 'rgba(96,100,109, 1)',
    fontSize:'17@ms',
  },
  getStartedText: {
    fontSize: '17@ms',
    color: 'rgba(96,100,109, 1)',
    lineHeight: '24@ms',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: '30@vs',
    width: '50%',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: '20@vs',
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