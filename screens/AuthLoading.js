import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Constants from 'expo-constants';
import * as firebase from 'firebase';


export default class AuthLoading extends React.Component {
    componentDidMount() {
        firebase.initializeApp(Constants.manifest.extra.firebase);
        this.authListenerUnsub = firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? 'Main' : 'Auth');
        })
    }
    componentWillUnmount() {
        this.authListenerUnsub && this.authListenerUnsub()
    }

    // Render any loading content that you like here
    render() {
        return (
        <View>
            <StatusBar barStyle="default" />
        </View>
        );
    }
}