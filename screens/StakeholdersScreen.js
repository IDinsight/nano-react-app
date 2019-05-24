import React from 'react';
import { ScrollView, StyleSheet, View, List } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class StakeholdersScreen extends React.Component {
  static navigationOptions = {
    title: 'Stakeholders',
  };

  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
      tableData: [
        ['1', '2', '3', '4'],
        ['a', 'b', 'c', 'd'],
        ['1', '2', '3', '456'],
        ['a', 'b', 'c', 'd']
      ]
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
      <View style={styles.listContainer}>
        <Table borderStyle={{borderWidth: 0, borderColor: '#fff'}}>
          <Row data={this.state.tableHead} style={styles.head} textStyle={styles.headText}/>
          <Rows data={this.state.tableData} textStyle={styles.text}/>
        </Table>
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
  head: { 
    height: 40, 
    borderBottomColor: '#000',
    borderBottomWidth: .5, 
  },
  headText: { 
    margin: 6,
    fontWeight:'bold',
  },
  text: { margin: 6 }
});
