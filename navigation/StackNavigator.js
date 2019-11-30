import {
    createStackNavigator
} from 'react-navigation-stack';
import React from 'react';

import MainTabNavigator from './MainTabNavigator';
import NewExpense from '../screens/NewExpense';
import CameraScreen from '../screens/CameraScreen';
import ExpenseScreen from '../screens/ExpenseScreen';

export default createStackNavigator({
    MainTabNavigator: {
        screen: MainTabNavigator
    },
    NewExpense: {
        screen: NewExpense
    },
    Expense: {
        screen: ExpenseScreen
    },
    CameraScreen: {
        screen: CameraScreen
    }
},
{
  initialRouteName: "MainTabNavigator",
  headerMode: "none",
  mode: 'modal',
})