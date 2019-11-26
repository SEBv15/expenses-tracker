import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import DataScreen from '../screens/DataScreen';
import SettingsScreen from '../screens/SettingsScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: { headerMode: "none" },
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Feed',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-cash'
          : 'md-cash'
      }
    />
  ),
};

HomeStack.path = '';

const DataStack = createStackNavigator(
  {
    Data: DataScreen,
  },
  config
);

DataStack.navigationOptions = {
  tabBarLabel: 'Data',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-eye' : 'md-eye'} />
  ),
};

DataStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createMaterialTopTabNavigator({
  HomeStack,
  DataStack,
  SettingsStack,
}, 
{
  tabBarPosition: "bottom",
  tabBarOptions: {
    activeTintColor: "green",
    showIcon: true,
    showLabel: false,
    indicatorStyle: {
      backgroundColor: "grey"
    },
    style: {
      backgroundColor: "white"
    }
  }
});

tabNavigator.path = '';

export default tabNavigator;
