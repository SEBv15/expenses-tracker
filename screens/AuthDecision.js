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

export default class AuthDecision extends Component {
    handleLogin = () => {
        this.props.navigation.navigate("Login")
    }
    handleSignUp = () => {
        this.props.navigation.navigate("SignUp")
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Expense Tracker</Text>
                <Button
                    title={"Login"}
                    onPress={this.handleLogin}
                    containerStyle={styles.loginButton}
                    />
                <Button
                    title={"Sign Up"}
                    type="outline"
                    onPress={this.handleSignUp}
                    containerStyle={styles.signUpButton}
                    />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
    },
    title: {
        fontSize: 36,
        fontWeight: "bold"
    }
})