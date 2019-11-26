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
import * as firebase from 'firebase';

export default class SettingsScreen extends React.Component {
  logout = () => {
    firebase.auth().signOut()
    this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().dangerouslyGetParent().navigate("Auth")
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text>{firebase.auth().currentUser.email}</Text>
        <Button style={styles.logout} title="Logout" onPress={this.logout} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
    textAlign: "center"
  }
})