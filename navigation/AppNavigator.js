import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
import AuthLoadingScreen from '../screens/AuthLoadingScreen'

export default createAppContainer(createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }));