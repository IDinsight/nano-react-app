import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import HelpScreen from '../screens/HelpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ViewScreen from '../screens/ViewScreen';
import RequestScreen from '../screens/RequestScreen'; 

const HomeStack = createStackNavigator({
  Home: {screen: HomeScreen},
  View: {screen: ViewScreen},
  Request: {screen: RequestScreen},
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-home'
          : 'md-home'
      }
    />
  ),
};

const HelpStack = createStackNavigator({
  Help: {screen: HelpScreen},
});

HelpStack.navigationOptions = {
  tabBarLabel: 'Get Help',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-help'
          : 'md-help'
      }
    />
  ),
};  

const ProfileStack = createStackNavigator({
  Profile: {screen: ProfileScreen},
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-person'
          : 'md-person'
      }
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  HelpStack,
  ProfileStack,
}, {
  resetOnBlur:true
});
