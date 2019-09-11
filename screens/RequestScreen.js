import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import * as Segment from 'expo-analytics-segment';

export default class RequestScreen extends React.Component {
  static navigationOptions = {
    title: 'Request Data Collection',
  };

  render() {
    Segment.screen('Request Screen');
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

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingTop: '35@vs',
    backgroundColor: '#fff',
  },
  getStartedContainer: {
    marginHorizontal: '20@s',
  },
  getStartedText: {
    fontSize: '17@ms',
    color: 'rgba(96,100,109, 1)',
    lineHeight: '24@ms',
    marginBottom:'15@vs'
  },
  headerTitleStyle: {
    fontSize: '18@ms'
  }
});
