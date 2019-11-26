import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  state = {
  }
  componentDidMount() {
  }
  buttonPressHandler = () => {
    this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().navigate("NewExpense")
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Expenses</Text>
        <TouchableOpacity
          style={{
              borderWidth:1,
              borderColor:'rgba(0,0,0,0.2)',
              alignItems:'center',
              justifyContent:'center',
              width:70,
              position: 'absolute',                                          
              bottom: 10,                                                    
              right: 10,
              height:70,
              backgroundColor:'#fff',
              borderRadius:100,
            }}
            onPress={this.buttonPressHandler}
          >
          <Ionicons name={Platform.OS == 'ios'?"ios-add":"md-add"}  size={30} color="#994411" />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: "center",
  },
  addButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 36,
    height: 36
  },
  title: {
    fontSize: 48,
    textAlign: "center"
  }
});
