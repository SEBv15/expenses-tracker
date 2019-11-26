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

export default class DataScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Data</Text>
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