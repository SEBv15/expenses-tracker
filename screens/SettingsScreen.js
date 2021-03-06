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
  state = {
    verifying: false
  }
  verify = async () => {
    this.setState({verifying: true})
    await firebase.auth().currentUser.reload()
    if (firebase.auth().currentUser.emailVerified) {
      this.setState({verifying: false})
      return
    }
    firebase.auth().currentUser.sendEmailVerification().then(() => {
      this.setState({verifying: false})
    }).catch((error) => {
      this.setState({verifying: false})
      alert(error)
    });
  }
  logout = () => {
    firebase.auth().signOut()
    this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().dangerouslyGetParent().navigate("Auth")
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style= {styles.title}>Settings</Text>
        <Text style={styles.email}>{firebase.auth().currentUser.email}</Text>
        {!firebase.auth().currentUser.emailVerified?(
          <React.Fragment>
            <Button type="outline" loading={this.state.verifying} loadingProps={{color: "#FFFFFF"}} titleStyle={{color: "white"}} buttonStyle={styles.btn} title="Verify Email" onPress={this.verify} />
          </React.Fragment>
          ):null}
        <Button type="outline" titleStyle={{color: "#FFFFFF"}} buttonStyle={[styles.btn, styles.logout]} title="Logout" onPress={this.logout} />
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
    fontFamily: "Comfortaa-Bold",
    color: "#FFFFFF"
  },
  email: {
    textAlign: "center",
    fontFamily: "Comfortaa",
    fontSize: 18,
    marginBottom: 16,
    color: "#FFFFFF"
  },
  logout: {
    borderColor: "#FFFFFF",
  },
  btn: {
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    marginTop: 12,
    marginHorizontal: 64,
  }
})