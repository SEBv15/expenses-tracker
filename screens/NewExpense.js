import React, {Component} from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Input, Button } from 'react-native-elements'

export default class NewExpense extends Component {
    render() {
        return (
            <View style={styles.outer}>
                <Ionicons style={styles.arrowBack} size={48} name={Platform.OS == "ios"?"ios-arrow-back":"md-arrow-back"} onPress={()=>this.props.navigation.goBack()} />
                <View style={styles.container}>
                    <Text style={styles.title}>New Expense</Text>
                    <Button title="img" onPress={() => this.props.navigation.navigate("CameraScreen")} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    outer: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: "center",
    },
    arrowBack: {
        marginTop: 16
    },
    title: {
        fontSize: 48,
        textAlign: "center"
    }
})