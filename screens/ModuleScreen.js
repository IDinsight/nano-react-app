import React from 'react';
import { ScrollView, StyleSheet, View, List, Text, Picker, Modal, TouchableHighlight } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';
import Chart from '../components/Chart';
import {format as d3Format} from 'd3-format';
import data from '../data/indicators.json';


export default class ModuleScreen extends React.Component {
  static navigationOptions = {
    title: 'Module',
  };

  constructor(props){
      super(props);
      this.state = {
        selectedValue: '1',
        vcModalVisible: false,
        reasonsModalVisible: false,
        chartData: [],
      }
  }

  setVcModalVisible(visible) {
    this.setState({vcModalVisible: visible});
  }
  setReasonsModalVisible(visible) {
    this.setState({reasonsModalVisible: visible});
  }
  formatValue(name,value,unit) {
    if (unit==='%') {
      f = d3Format(".1%");
      return f(value)
    }
    else if (name==='hh_surveyed') {
      f = d3Format("d");
      return f(value);
    }
    else {
      f = d3Format(".1f");
      return f(value)
    }
  }
  showButton(item) {

    if (item.values.vc.length>0) {
      return <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            this.setVcModalVisible(true);
            this.setState({'chartData':item});
          }}
          title="View Village Clusters"
          color="#4088d5"
          accessibilityLabel="View your data"
        />
      </View>;
    }
      else {
        return;
      }
    
  }
  render() {
    const {navigate} = this.props.navigation;
    const shadowStyle = {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    };
    const moduleKey = this.props.navigation.getParam('moduleKey', 'Module not found');
    
    const stakeholders = [
      { name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' },
      { name: 'PETER RIVER', code: '#3498db' }, { name: 'AMETHYST', code: '#9b59b6' },
    ];

    let pickerView;
    if (data[moduleKey].categories.length > 0) {
      pickerView =  
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={this.state.selectedValue}
          style={{height: 50, width:250}}
          onValueChange={(value) => {this.setState({selectedValue: value})}}>
          {
            data[moduleKey].categories.map((item, i) => {
              return (
                <Picker.Item key={i} label={item.cat_label} value={item.cat_name} />
              );
            })
          }
        </Picker>
      </View>;
    }

    let selectedData;
    if (data[moduleKey].categories.length > 0) {
      selectedData = data[moduleKey]['indicators'][this.state.selectedValue];
    }
    else {
      selectedData = data[moduleKey]['indicators'];
    }

    const reasonsButton = <Button
      onPress={() => {
        this.setReasonsModalVisible(true);
      }}
      title="Reasons Data"
      color="#4088d5"
      accessibilityLabel="View your data"
    />;

    return (
      <ScrollView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.vcModalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
          >
          <View style={{marginTop: 22}}>
            <View style={styles.modalButtonContainer}>
              <Button
                onPress={() => {
                  this.setVcModalVisible(!this.state.vcModalVisible);
                }}
                color="#7fb1e6"
                title="Close"
              >
              </Button>
            </View>
            <View style={styles.chartTitleContainer}>
            <Text style={styles.chartTitle}>{this.state.chartData.indic_label}</Text>
            </View>
            <Chart data={this.state.chartData}/>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.reasonsModalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
          >
          <View style={{marginTop: 22}}>
            <View>
              <TouchableHighlight
                onPress={() => {
                  this.setReasonsModalVisible(!this.state.reasonsModalVisible);
                }}>
                <Text>Go Back</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <View style={styles.moduleContainer}>
          <Text style={styles.titleText}>{data[moduleKey].name}</Text> 
          <Text style={styles.moduleDetailText}>Collected April 2019</Text> 
        {pickerView}
        </View>
        
        <FlatGrid
          itemDimension={400}
          items={selectedData}
          style={styles.gridView}
          // staticDimension={300}
          // fixed
          // spacing={20}
          renderItem={({ item, index }) => (
            <View style={[styles.itemContainer,shadowStyle]}>
              <Text style={styles.itemName}>{item.indic_label}</Text>
              <Text style={styles.itemValue}>{this.formatValue(item.indic_name,item.values.chiefdom.estimate,item.values.chiefdom.unit)}</Text>
              <Text style={styles.precisionInfo}>Precision bounds: [{this.formatValue(item.indic_name,item.values.chiefdom.lower_bound,item.values.chiefdom.unit)}, {this.formatValue(item.indic_name,item.values.chiefdom.upper_bound,item.values.chiefdom.unit)}]</Text>
              {this.showButton(item)}
            </View>
          )}
        />

        <View style={styles.stakeholdersContainer}>
          <Text style={styles.titleText}>Stakeholders</Text> 
        </View>
        <View style={styles.listContainer}>
          {
            stakeholders.map((item, i) => {
              return (
                <ListItem
                  key={i}
                  title={item.name}
                  subtitle={item.code}
                  bottomDivider={true}
                />
              );
            })
          }
        </View>
        <View style={styles.lowerContainer}>
        <View style={styles.stakeholderButtonContainer}>              
        <Button
          onPress={() => {
            navigate('Stakeholders');
          }}
          title="View all stakeholders"
          color="#4088d5"
          accessibilityLabel="View your data"
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
    backgroundColor: '#fff',
  },
  moduleContainer: {
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginTop: 30,
  },
  titleText: {
    fontSize: 24,
    lineHeight: 24,
    textAlign: 'left',
    marginBottom:10
  },
  moduleDetailText: {
    fontSize: 16,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 16,
    textAlign: 'left',
  },
  pickerContainer: {
    marginTop: 20,
    borderWidth:.5,
    borderColor:'rgb(200,200,200)'
  },
  gridView: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    marginTop:5,
    padding: 20,
    backgroundColor: '#fff',
  },
  itemName: {
    color: 'rgba(96,100,109, 1)',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
  itemValue: {
    paddingTop:10,
    fontSize: 36,
  },
  precisionInfo: {
    paddingTop:10,
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(96,100,109, 1)',
  },
  buttonContainer: {
    marginTop:25,
    width:'100%',
  },
  stakeholdersContainer: {
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginTop: 30,
  },
  listContainer: {
    flex:1,
    backgroundColor: '#fff',
  },
  modalButtonContainer: {
    marginHorizontal:20,
    width: 75
  },
  chartTitleContainer: {
    marginHorizontal:20,
    marginTop: 10,
  },
  chartTitle: {
    fontSize: 24,
  },
  lowerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  stakeholderButtonContainer: {
    width: '50%',
  }
});
