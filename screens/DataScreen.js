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

import { WebView } from 'react-native-webview';

export default class DataScreen extends React.Component {
    render() {
        return (
            <ScrollView style={styles.container} contentContainerStyle={{justifyContent: "center"}}>
                <Text style={styles.title}>Data</Text>
                <WebView 
                    originWhitelist={['*']}
                    source={{html:"<h1>hi</h1>"}} 
                    style={{flex: 1, borderWidth: 1, borderColor: "black"}} 
                    />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 48,
        textAlign: "center",
        fontFamily: "Comfortaa-Bold"
    }
})