import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import {Linking} from 'react-native'
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import * as Segment from 'expo-analytics-segment';

export default class HelpScreen extends React.Component {
  static navigationOptions = {
    title: 'Get Help',
    headerTitleStyle: {fontSize:32},
    headerStyle: {height:80}
  };

  render() {
    Segment.screen('Help Screen');
    return (
      <ScrollView style={styles.container}>
        <View style={styles.getStartedContainer}>
          <Text style={styles.getStartedText}>The Nano Team is available to assist you regarding any query.</Text><Text style={styles.getStartedText}>Please contact Kondwani Yobe Mumba by phone at:</Text><Text onPress={()=>{Linking.openURL('tel:+260 978706586');}} style={styles.linkText}>+260 978706586</Text><Text style={styles.getStartedText}>Or by sending an email to:</Text><Text onPress={()=>{Linking.openURL('mailto:kondwani.mumba@idinsight.org');}} style={styles.linkText}>kondwani.mumba@idinsight.org</Text> 
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
  linkText: {
    fontSize: '17@ms',
    color: '#2e78b7',
    marginBottom:'15@vs'
  },
});
