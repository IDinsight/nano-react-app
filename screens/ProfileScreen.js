import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { Auth } from 'aws-amplify';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
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

    const data = {
      user: [
        {
          label: 'Chiefdom',
          value: 'Mukobela',
        },
        {
          label: 'Name',
          value: 'Wesley Shabongo Mukobela',
        },
        {
          label: 'Phone',
          value: [
            '+260962848880',
            '+260953010443',
            '+260966178351'
            ],
        },
        {
          label: 'Email Address',
          value: 'wesleymukobela@gmail.com',
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
                title={item.label}
                subtitle={this.format_data(item.value)}
                subtitleStyle={{fontSize:20}}
                bottomDivider={false}
              />
            );
          })
        }
        </View>
        <View style={styles.welcomeContainer}>
          <View style={styles.buttonContainer}>
            <Button 
              title="Sign Out" 
              color="#4088d5" 
              onPress={this._signOutAsync} 
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    marginTop: 50
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    width: '50%',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
});