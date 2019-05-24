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
import Chart from '../components/Chart';

export default class ChartTestScreen extends React.Component {
    constructor(props) {
        super(props);       
    }

  render() {
    return (
        <ScrollView style={styles.container}>
          <Chart />
        </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
