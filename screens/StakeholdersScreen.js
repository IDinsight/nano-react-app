import React from 'react';
import { ScrollView, StyleSheet, View, List, Text } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import stakeholders from '../data/stakeholders.json';
import {Linking} from 'react-native';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';


export default class StakeholdersScreen extends React.Component {
  static navigationOptions = {
    title: 'Stakeholders',
  };

  constructor(props) {
    super(props);
  }

  generateStakeholderSubtitle(item) {

    let line1 = '';
    if (item.contact_person!=='' && item.contact_position!=='') {
      line1 = item.contact_person + ', ' + item.contact_position;
    }
    else if (item.contact_position==='') {
      line1 = item.contact_person;
    }
    else if (item.contact_person==='') {
      line1 = item.contact_position;
    }


    return <View>
    <Text style={styles.subtitleText}>Sectors: {item.app_categories.join(', ')}</Text>
    <Text style={styles.subtitleText}>{line1}</Text>
    <Text onPress={()=>{Linking.openURL('tel:+'+item.contact_phone);}} style={styles.linkText}>{item.contact_phone==='' ? '' : ('+' + item.contact_phone)}</Text>
    </View>;

  }

  render() {
    return (
      <ScrollView style={styles.container}>
      <View style={styles.listContainer}>
          {
            stakeholders.map((item, i) => {
              return (
                <ListItem
                  key={i}
                  title={item.organization}
                  titleStyle={styles.titleText}
                  subtitle={
                    this.generateStakeholderSubtitle(item)
                  }
                  bottomDivider={true}
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
  listContainer: {
    flex:1,
    backgroundColor: '#fff',
  },
  titleText: {
    color: '#000',
    fontSize: '17@ms'
  },
  subtitleText: {
    color: 'rgba(96,100,109, 1)',
    fontSize: '14@ms'
  },
  linkText: {
    fontSize: '14@ms',
    color: '#2e78b7',
  },
});
