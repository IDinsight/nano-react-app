import React from 'react';
import { ScrollView, StyleSheet, View, List, Text } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import stakeholders from '../data/stakeholders.json';
import {Linking} from 'react-native';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import * as Segment from 'expo-analytics-segment';


export default class StakeholdersScreen extends React.Component {
  static navigationOptions = {
    title: 'Stakeholders',
  };

  constructor(props) {
    super(props);
  }

generateStakeholderSubtitle(item) {

  
  if (item.contact.length===0) {
    return (
      <View>
        <Text style={styles.stakeholderSubtitleText}>Sectors: {item.app_categories.join(', ')}</Text>
        <Text style={styles.stakeholderSubtitleText}></Text>
        <Text style={styles.stakeholderSubtitleText}></Text>
      </View>
    );
  }
  else {

  return <View>
    <Text style={styles.stakeholderSubtitleText}>Sectors: {item.app_categories.join(', ')}</Text>

    { 
      item.contact.map((contact, i) => {

        let line1 = '';

        if (contact.contact_person!=='' && contact.contact_position!=='') {
          line1 = contact.contact_person + ', ' + contact.contact_position;
        }
        else if (contact.contact_position==='') {
          line1 = contact.contact_person;
        }
        else if (contact.contact_person==='') {
          line1 = contact.contact_position;
        }  
        return (
          <View>
          <Text style={styles.stakeholderSubtitleText}>{line1}</Text>
          <Text onPress={()=>{Linking.openURL('tel:+'+contact.contact_phone);}} style={styles.linkText}>{contact.contact_phone==='' ? '' : ('+' + contact.contact_phone)}</Text>
          </View>
        );
      }) 
    }

    </View>;

  }

}

  render() {

    Segment.screen('Stakeholders Screen');
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
  stakeholderTitleText: {
    color: '#000',
    fontSize: '17@ms'
  },
  stakeholderSubtitleText: {
    color: 'rgba(96,100,109, 1)',
    fontSize: '14@ms'
  },
});
