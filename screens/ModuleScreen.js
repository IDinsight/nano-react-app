import React from 'react';
import { ScrollView, StyleSheet, View, List, Text, Picker, Modal, TouchableHighlight, TouchableOpacity, Alert, AppState } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';
import VcChart from '../components/VcChart';
import CatBarChart from '../components/CatBarChart';
import ReasonsChart from '../components/ReasonsChart';
import {format as d3Format} from 'd3-format';
import data from '../data/indicators.json';
import stakeholders from '../data/stakeholders.json';
import {Linking} from 'react-native';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';


export default class ModuleScreen extends React.Component {
  static navigationOptions = {
    title: 'Module',
  };

  constructor(props){
      super(props);
      const moduleKey = this.props.navigation.getParam('moduleKey', 'Module not found');
      this.state = {
        selectedValue: data[moduleKey].categories.length > 0 ? data[moduleKey].categories[0].cat_name : null,
        vcModalVisible: false,
        reasonsModalVisible: false,
        chartData: [],
        appState: AppState.currentState,
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
    else if (name==='r1_hh_surveyed') {
      f = d3Format("d");
      return f(value);
    }
    else if (name==='r1_female_under_18_preg') {
      f = d3Format(".2f");
      return f(value);
    }
    else {
      f = d3Format(".1f");
      return f(value)
    }
  }
  showVcButton(item) {

    if (item.values.vc.length>0) {
      return <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => {
            this.setVcModalVisible(true);
            this.setState({'chartData':item});
          }}
          >
          <Text style={styles.customButtonText}>VIEW VILLAGE CLUSTERS</Text>
        </TouchableOpacity>
      </View>;
    }
      else {
        return;
      }
  }
  
  showReasonsButton(item) {

    if (item.reasons && item.reasons.reasons_indicators.length>0) {
      return <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => {
            this.setReasonsModalVisible(true);
            this.setState({'chartData':item});
          }}
          >
          <Text style={styles.customButtonText}>VIEW REASONS</Text>
        </TouchableOpacity>
      </View>;
    }
      else {
        return;
      }
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
    <Text style={styles.stakeholderSubtitleText}>Sectors: {item.app_categories.join(', ')}</Text>
    <Text style={styles.stakeholderSubtitleText}>{line1}</Text>
    <Text onPress={()=>{Linking.openURL('tel:+'+item.contact_phone);}} style={styles.linkText}>{item.contact_phone==='' ? '' : ('+' + item.contact_phone)}</Text>
    </View>;

  }

  showPrecision(item) {

    if (item.indic_name==='r1_hh_surveyed') {
      return;
    }
      else {
        return <Text style={styles.precisionInfo}>Precision bounds: [{this.formatValue(item.indic_name,item.values.chiefdom.lower_bound,item.values.chiefdom.unit)}, {this.formatValue(item.indic_name,item.values.chiefdom.upper_bound,item.values.chiefdom.unit)}]</Text>;
      }
    
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.setVcModalVisible(false);
      this.setReasonsModalVisible(false);
    }
    this.setState({appState: nextAppState});
  };

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
    
    let pickerView;
    if (data[moduleKey].categories.length > 0) {
      pickerView =  
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={this.state.selectedValue}
          style={styles.pickerStyle}
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

    let stakeholderCategories;
    let filteredStakeholders = [];
    let category = this.state.selectedValue;

    if (data[moduleKey].categories.length > 0) {
      stakeholderCategories = data[moduleKey]['categories'].filter(function(d) { return d.cat_name===category }).map(function(d) { return d.stakeholder_categories })[0];
      
      stakeholders.forEach(function(d) {
        let include = false;
        d.app_categories.forEach(function(e) {
          if (stakeholderCategories.includes(e)) { include = true }
        });
        if (include) { filteredStakeholders.push(d) }
      })
    }
    else {
      stakeholderCategories = data[moduleKey]['stakeholder_categories'];
      stakeholders.forEach(function(d) {
        let include = false;
        d.app_categories.forEach(function(e) {
          if (stakeholderCategories.includes(e)) { include = true }
        });
        if (include) { filteredStakeholders.push(d) }
      })
    }
    
    let gridData
    let catBarData;

    if (moduleKey==='snapshot_of_the_chiefdom') {
      gridData = data[moduleKey]['indicators']['grid_data'];
      catBarData = data[moduleKey]['indicators']['cat_bar_data'];
    }
    if (moduleKey==='access_to_services' || moduleKey==='health_behaviours') {
      gridData = data[moduleKey]['indicators'][this.state.selectedValue]['grid_data'];
      catBarData = data[moduleKey]['indicators'][this.state.selectedValue]['cat_bar_data'];
    }


    return (
      <ScrollView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.vcModalVisible}
          onRequestClose={() => { this.setVcModalVisible(!this.state.vcModalVisible);}}
          >
          <View style={{marginTop: 22}}>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.customButton}
                onPress={() => {
                  this.setVcModalVisible(!this.state.vcModalVisible);
                }}
                >
                <Text style={styles.customButtonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chartTitleContainer}>
            <Text style={styles.chartTitle}>{this.state.chartData.indic_label}</Text>
            </View>
            <VcChart data={this.state.chartData}/>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.reasonsModalVisible}
          onRequestClose={() => { this.setReasonsModalVisible(!this.state.reasonsModalVisible);}}
          >
          <View style={{marginTop: 22}}>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.customButton}
                onPress={() => {
                  this.setReasonsModalVisible(!this.state.reasonsModalVisible);
                }}
                >
                <Text style={styles.customButtonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chartTitleContainer}>
            <Text style={styles.chartTitle}>{this.state.chartData.reasons ? this.state.chartData.reasons.reasons_label : ''}</Text>
            </View>
            <ReasonsChart data={this.state.chartData}/>
          </View>
        </Modal>
        
        <View style={styles.moduleContainer}>
          <Text style={styles.titleText}>{data[moduleKey].name}</Text> 
          <Text style={styles.moduleDetailText}>Collected April 2019</Text> 
        {pickerView}
        </View>
        
        <FlatGrid
          itemDimension={400}
          items={gridData}
          style={styles.gridView}
          // staticDimension={300}
          // fixed
          spacing={25}
          renderItem={({ item, index }) => (
            <View style={[styles.itemContainer,shadowStyle]}>
              <Text style={styles.itemName}>{item.indic_label}</Text>
              <Text style={styles.itemValue}>{this.formatValue(item.indic_name,item.values.chiefdom.estimate,item.values.chiefdom.unit)}</Text>
              {this.showPrecision(item)}
              {this.showVcButton(item)}
              {this.showReasonsButton(item)}
            </View>
          )}
        />

        <View style={styles.catBarSection}>
        {
          catBarData.map((item, i) => {
            return (
                <View key={i} style={[styles.catBarContainer,shadowStyle]}>
                  <Text style={styles.itemName}>{item.cat_label}</Text>
                    <CatBarChart data={item}/>
                </View>
              );
          })
        }
        </View>

        <View style={styles.stakeholdersContainer}>
          <Text style={styles.titleText}>Stakeholders</Text> 
        </View>
        <View style={styles.listContainer}>
          {
            filteredStakeholders.map((item, i) => {
              return (
                <ListItem
                  key={i}
                  title={item.organization}
                  titleStyle={styles.stakeholderTitleText}
                  subtitle={
                    this.generateStakeholderSubtitle(item)
                  }
                  bottomDivider={true}
                />
              );
            })
          }
        </View>
        <View style={styles.lowerContainer}>
            <View style={styles.stakeholderButtonContainer}>
              <TouchableOpacity
                style={styles.customButton}
                onPress={() => navigate('Stakeholders')}
                >
                <Text style={styles.customButtonText}>VIEW ALL STAKEHOLDERS</Text>
              </TouchableOpacity>
            </View>
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
  moduleContainer: {
    alignItems: 'flex-start',
    marginHorizontal: '20@s',
    marginTop: '30@vs',
  },
  catBarSection: {
    flex:1,
    alignItems: 'flex-start',
    marginHorizontal: '10@s',
  },
  catBarContainer: {
    height:'300@vs',
    marginBottom:'20@vs',
    padding: '20@vs',
    backgroundColor: '#fff',
    width:'100%'
  },
  titleText: {
    fontSize: '24@ms',
    lineHeight: '24@ms',
    textAlign: 'left',
    marginBottom:'10@vs'
  },
  moduleDetailText: {
    fontSize: '16@ms',
    color: 'rgba(96,100,109, 1)',
    lineHeight: '16@ms',
    textAlign: 'left',
  },
  pickerContainer: {
    marginTop: '20@vs',
    borderWidth:.5,
    borderColor:'rgb(200,200,200)'
  },
  gridView: {
    marginTop: '20@vs',
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    marginTop:'5@vs',
    padding: '20@ms',
    backgroundColor: '#fff',
  },
  itemName: {
    color: 'rgba(96,100,109, 1)',
    fontSize: '14@ms',
    lineHeight: '18@ms',
    fontWeight: '600',
  },
  itemValue: {
    paddingTop:'10@vs',
    fontSize: '36@ms',
  },
  precisionInfo: {
    paddingTop:'10@vs',
    fontSize: '14@ms',
    fontStyle: 'italic',
    color: 'rgba(96,100,109, 1)',
  },
  buttonContainer: {
    marginTop:'25@vs',
    width:'100%',
  },
  stakeholdersContainer: {
    alignItems: 'flex-start',
    marginHorizontal: '20@s',
    marginTop:'30@vs',
  },
  listContainer: {
    flex:1,
    backgroundColor: '#fff',
    borderWidth:.5,
    borderColor:'rgb(200,200,200)'
  },
  modalButtonContainer: {
    marginHorizontal:'20@s',
    width: '75@s'
  },
  chartTitleContainer: {
    marginHorizontal:'20@s',
    marginTop: '10@vs',
  },
  chartTitle: {
    fontSize: '24@ms',
  },
  lowerContainer: {
    alignItems: 'center',
    marginTop: '20@vs',
    marginBottom: '30@vs'
  },
  stakeholderButtonContainer: {
    width: '50%',
  },
  stakeholderTitleText: {
    color: '#000',
    fontSize: '17@ms'
  },
  stakeholderSubtitleText: {
    color: 'rgba(96,100,109, 1)',
    fontSize: '14@ms'
  },
  linkText: {
    fontSize: '14@ms',
    color: '#2e78b7',
  },
  customButtonText: {
    fontSize: '16@ms',
    fontWeight: '600',
    color: "#fff",
  },
  customButton: {
    alignItems: 'center',
    backgroundColor: "#4088d5",
    paddingVertical: '10@ms',
    borderRadius: 3,
    elevation: 3
  },
  pickerStyle: {
    height: 50, 
    width:250,
  }
});
