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
    KeyboardAvoidingView
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
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <Text style={styles.title}>{this.props.navigation.getParam('isActuallySignUp', false)?"Sign Up":"Login"}</Text>
                <Text style={styles.error}>{this.state.error}</Text>
                <Input
                    placeholder='Email'
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={this.state.email}
                    onChangeText={value => this.setState({email: value})}
                    errorStyle={{ color: 'red' }}
                    containerStyle={styles.input}
                    editable={!this.state.isSubmitting}
                    />
                <Input
                    placeholder={"Password"}
                    secureTextEntry
                    autoCapitalize="none"
                    value={this.state.password}
                    containerStyle={styles.input}
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
                        buttonStyle={styles.submitButton}
                        disabled={this.state.isSubmitting}
                        loading={this.state.isSubmitting}
                        loadingProps={{ size: "large", color: "white" }}
                        />
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 36,
    },
    title: {
        fontSize: 36,
        marginBottom: 24,
        textAlign: "center",
        fontFamily: "Comfortaa-Bold",
    },
    error: {
        color: "red",
        textAlign: "center",
    },
    input: {
        marginVertical: 8,
    },
    buttons: {
        flexDirection: "row",
        marginBottom: 24,
        marginTop: 12,
        justifyContent: "space-between"
    },
    submitButton: {
        borderRadius: 40,
        paddingHorizontal: 16,
    },
    cancelButton: {
    }
});