import React, {Component} from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default class ExpenseScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Ionicons style={styles.close} size={48} name={Platform.OS == "ios"?"ios-close":"md-close"} onPress={()=>this.props.navigation.goBack()} />
                <Text style= {{fontSize: 21,fontFamily: "space-mono",}}> {this.props.navigation.state.params.title}</Text>
                <Text style= {{fontSize: 21,fontFamily: "space-mono",}}>{'$'+parseFloat(this.props.navigation.state.params.amount).toFixed(2)}</Text>
                <Text>{this.props.navigation.state.params.category}</Text>
                <Text>{this.props.navigation.state.params.user}</Text>
                <Text>{new Date(this.props.navigation.state.params.date).toDateString()}</Text>
                <Image style={{width: 400, height: 400}} source={{uri: `data:image/jpg;base64,${this.props.navigation.state.params.photo}`}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    close: {
        marginTop: 32,
        marginLeft: 16,
    },
    expenseAmount: {
        fontSize: 21,
        fontFamily: "space-mono",
    },
    expenseTitle: {
        fontSize: 20,
        flex: 1,
        fontFamily: "Comfortaa",
    },
})