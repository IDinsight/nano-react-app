const surveys = [
 {
    name: 'Mini-census',
    date: 'April 2019'
 },
 {
    name: 'Access to services',
    date: 'April 2019'
 },
]

import React from 'react';
import { ScrollView, StyleSheet, View, List } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';

export default class ViewScreen extends React.Component {
  static navigationOptions = {
    title: 'View Your Data',
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
      <View style={styles.listContainer}>
        {
          surveys.map((u, i) => {
            // dateText = 'Collected ' + {u.date}
            return (
              <ListItem
                key={i}
                title={u.name}
                subtitle={'Collected '+u.date}
                chevron={{color: '#2e78b7'}}
                bottomDivider={true}
                onPress={() => navigate('Home')}
              />
            );
          })
        }
      </View>
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
