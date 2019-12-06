import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as firebase from 'firebase';
import { Button } from 'react-native-elements'

export default class SettingsScreen extends React.Component {
  logout = () => {
    firebase.auth().signOut()
    this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().dangerouslyGetParent().navigate("Auth")
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.email}>{firebase.auth().currentUser.email}</Text>
        <Text>{firebase.auth().currentUser.emailVerified?"Verified":"Not Verified"}</Text>
        <Button title="Verify" onPress={()=>firebase.auth().currentUser.sendEmailVerification()} />
        <Button type="outline" titleStyle={{color: "black"}} buttonStyle={styles.logout} title="Logout" onPress={this.logout} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F08080",
  },
  title: {
    fontSize: 48,
    textAlign: "center",
    fontFamily: "Comfortaa-Bold"
  },
  email: {
    textAlign: "center"
  },
  logout: {
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#000",
    marginTop: 12,
    marginHorizontal: 64
  }
})