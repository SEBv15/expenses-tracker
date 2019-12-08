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
import { LinearGradient } from 'expo-linear-gradient';

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
                <LinearGradient
                    colors={['#833ab4', '#fd1d1d', '#fcb045']}
                    start={[0,0]}
                    end={[1,1]}
                    style={styles.gradient}>
                    <Text style={styles.title}>DuesWhoes</Text>
                    <Button
                        title={"Login"}
                        onPress={this.handleLogin}
                        type="outline"
                        containerStyle={styles.loginButton}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={{color: "#000",}}
                        />
                    <Button
                        title={"Sign Up"}
                        type="outline"
                        titleStyle={{color: "#000",}}
                        onPress={this.handleSignUp}
                        containerStyle={styles.signUpButton}
                        buttonStyle={styles.buttonStyle}
                        />
                </LinearGradient>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    gradient: {
        padding: 15, 
        justifyContent: "center",
        flex: 1
    },
    title: {
        fontSize: 36,
        fontFamily: "Comfortaa-Bold",
        textAlign: "center",
        marginBottom: 24
    },
    buttonStyle: {
        borderRadius: 40,
        borderWidth: 3,
        borderColor: "#000",
        marginTop: 12,
        marginHorizontal: 36
    }
})