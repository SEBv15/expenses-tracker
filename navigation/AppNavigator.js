import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import {
  createStackNavigator
} from 'react-navigation-stack';

import StackNavigator from './StackNavigator';
import Login from '../screens/Login';
import AuthLoading from '../screens/AuthLoading';
import AuthDecision from '../screens/AuthDecision';

const AuthStack = createStackNavigator({
  AuthDecision: {
    screen: AuthDecision
  },
  Login: {
    screen: Login,
    params: {
      isActuallySignUp: false
    }
  },
  SignUp: {
    screen: Login,
    params: {
      isActuallySignUp: true
    }
  }
},
{
  initialRouteName: "AuthDecision",
  headerMode: "none",
  mode: 'modal',
});

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html

    AuthLoading: AuthLoading,
    Main: StackNavigator,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading',
  })
);