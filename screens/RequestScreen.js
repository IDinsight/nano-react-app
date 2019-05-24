import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class RequestScreen extends React.Component {
  static navigationOptions = {
    title: 'Request Data Collection',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
          <View style={styles.getStartedContainer}>

            <Text style={styles.getStartedText}>This page will let you send a request to IDinsight to collect more data.</Text>
            <Text style={styles.getStartedText}>In the meantime if you'd like to get in touch with IDinsight regarding data collection, please contact us by selecting "Get Help" from the bottom navigation menu.</Text>

          </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: '#fff',
  },
  getStartedContainer: {
    marginHorizontal: 20,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    marginBottom:15
  },
});
