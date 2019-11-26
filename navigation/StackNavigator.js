import {
    createStackNavigator
} from 'react-navigation-stack';
import React from 'react';

import MainTabNavigator from './MainTabNavigator';
import NewExpense from '../screens/NewExpense';

export default createStackNavigator({
    MainTabNavigator: {
        screen: MainTabNavigator
    },
    NewExpense: {
        screen: NewExpense
    }
},
{
  initialRouteName: "MainTabNavigator",
  headerMode: "none",
  mode: 'modal',
})