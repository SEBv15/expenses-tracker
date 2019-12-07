import {
    createStackNavigator
} from 'react-navigation-stack';
import React from 'react';

import MainTabNavigator from './MainTabNavigator';
import NewExpense from '../screens/NewExpense';
import CameraScreen from '../screens/CameraScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import PhotoScreen from '../screens/PhotoScreen';

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
    },
    Photo: {
        screen: PhotoScreen
    }
},
{
  initialRouteName: "MainTabNavigator",
  headerMode: "none",
  mode: 'modal',
})