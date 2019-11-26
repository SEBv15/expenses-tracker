import React, {Component} from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
  } from 'react-native';

import { Input, Button } from 'react-native-elements'

import * as firebase from "firebase/app";

export default class Login extends Component {
    state = {
        email: "",
        password: "",
        isSubmitting: false,
        error: ""
    }
    componentDidMount() {
        this.authListenerUnsub = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;
                this.props.navigation.dangerouslyGetParent().navigate("Main")
                // ...
            } else {
                // User is signed out.
                // ...
            }
        });
    }
    componentWillUnmount() {
        this.authListenerUnsub && this.authListenerUnsub()
    }
    handleSubmit = () => {
        // If action is Sign Up
        if (this.props.navigation.getParam('isActuallySignUp', false)) {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorMessage) {
                    this.setState({error: errorMessage})
                }
                // ...
            })
        }
        // If action is Login
        else {
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                this.setState({error: errorMessage})
                // ...
            })
        }
    }
    handleCancel = () => {
        this.props.navigation.goBack()
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.navigation.getParam('isActuallySignUp', false)?"Sign Up":"Login"}</Text>
                <Text style={styles.error}>{this.state.error}</Text>
                <Input
                    placeholder='Your Beatiful Email'
                    label="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={this.state.email}
                    onChangeText={value => this.setState({email: value})}
                    errorStyle={{ color: 'red' }}
                    editable={!this.state.isSubmitting}
                    />
                <Input
                    placeholder={"Super Secret Password"}
                    label="Password"
                    secureTextEntry
                    autoCapitalize="none"
                    value={this.state.password}
                    onChangeText={value => this.setState({password: value})}
                    editable={!this.state.isSubmitting}
                    />
                <View style={styles.buttons}>
                    <Button
                        title="Cancel"
                        onPress={this.handleCancel}
                        containerStyle={styles.cancelButton}
                        disabled={this.state.isSubmitting}
                        loading={this.state.isSubmitting}
                        loadingProps={{ size: "large", color: "white" }}
                        type="clear"
                        />
                    <Button
                        title={this.props.navigation.getParam('isActuallySignUp', false)?"Sign Up":"Login"}
                        onPress={this.handleSubmit}
                        containerStyle={styles.submitButton}
                        disabled={this.state.isSubmitting}
                        loading={this.state.isSubmitting}
                        loadingProps={{ size: "large", color: "white" }}
                        />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        marginLeft: 12,
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center",
    },
    error: {
        color: "red",
        textAlign: "center",
    },
    input: {
        flex:1,
        justifyContent:"center",
        backgroundColor:"#fff",
        alignItems:"stretch"
    },
    buttons: {
        flexDirection: "row",
        marginBottom: 24,
        justifyContent: "space-between"
    },
    submitButton: {
    },
    cancelButton: {
    }
});