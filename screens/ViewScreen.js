import React from 'react';
import { ScrollView, StyleSheet, View, List } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';

export default class ViewScreen extends React.Component {
  static navigationOptions = {
    title: 'View Your Data',
  };

  render() {
    const {navigate} = this.props.navigation;
    const data = {
      modules: [
        {
          key: 'snapshot_of_the_chiefdom',
          name: 'Snapshot of the Chiefdom',
          date: 'April 2019'
        },
        {
          key: 'access_to_services',
          name: 'Access to Services',
          date: 'April 2019'
        },
        {
          key: 'health_behaviours',
          name: 'Health Behaviours',
          date: 'April 2019'
        },
      ]
    };

    return (
      <ScrollView style={styles.container}>
      <View style={styles.listContainer}>
        {
          data.modules.map((u, i) => {
            return (
              <ListItem
                key={i}
                title={u.name}
                titleStyle={styles.titleStyle}
                subtitle={'Collected '+u.date}
                subtitleStyle={styles.subtitleStyle}
                chevron={{color: '#2e78b7',size:36}}
                bottomDivider={true}
                onPress={() => navigate('Module', {moduleKey: u.key})}
              />
            );
          })
        }
      </View>
      </ScrollView>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleStyle: {
    fontSize:'17@ms',
  },
  subtitleStyle: {
    color: 'rgba(96,100,109, 1)',
    fontSize:'14@ms',
  }
});
