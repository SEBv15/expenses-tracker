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

export default class NewExpense extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>New Expense</Text>
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