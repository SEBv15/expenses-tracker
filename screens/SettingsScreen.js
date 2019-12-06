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
            <Text style={{textAlign: "center", marginHorizontal: 48, fontSize: 16}}>Email is not verified. Verify to enable password recovery.</Text>
            <Button type="outline" loading={this.state.verifying} loadingProps={{color: "#000"}} titleStyle={{color: "black"}} buttonStyle={styles.btn} title="Verify Email" onPress={this.verify} />
          </React.Fragment>
          ):null}
        <Button type="outline" titleStyle={{color: "#a00"}} buttonStyle={[styles.btn, styles.logout]} title="Logout" onPress={this.logout} />
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
<<<<<<< HEAD
    color: "#FFFFFF"
  },
  email: {
    textAlign: "center",
    color: "#FFFFFF"
=======
  },
  email: {
    textAlign: "center",
    fontFamily: "Comfortaa",
    fontSize: 18,
    marginBottom: 16,
>>>>>>> fd5914d6977ba8d2ac1dac17f03c88076a207dac
  },
  logout: {
    borderColor: "#a00",
  },
  btn: {
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    marginTop: 12,
    marginHorizontal: 64,
  }
})