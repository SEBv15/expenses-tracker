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

import * as firebase from 'firebase';
import 'firebase/firestore';

export default class ExpenseScreen extends Component {
    state = {
        loading: true
    }
    async componentDidMount() {
        var res = await firebase.firestore().collection("photos").doc(this.props.navigation.state.params.photo).get()
        this.base64 = res.data().base64
        this.setState({loading: false})
    }
    render() {
        return (
            <View style={styles.container}>
                <Ionicons style={styles.close} size={48} name={Platform.OS == "ios"?"ios-close":"md-close"} onPress={()=>this.props.navigation.goBack()} />
                <Text style= {{fontSize: 60,fontFamily: "Comfortaa",textAlign: "center",}}> {this.props.navigation.state.params.title}</Text>
                <Text style= {{fontSize: 45,fontFamily: "Comfortaa",textAlign: "center", marginTop: 15}}>{'$'+parseFloat(this.props.navigation.state.params.amount).toFixed(2)}</Text>
                <Text style= {{fontSize: 30,fontFamily: "Comfortaa",textAlign: "center", marginTop: 15}}>{this.props.navigation.state.params.category}</Text>
                <Text style= {{fontSize: .1,textAlign: "center"}}>{this.props.navigation.state.params.user}</Text>
                <Text style= {{fontSize: 30,fontFamily: "Comfortaa",textAlign: "center", marginTop: 15}}>{new Date(this.props.navigation.state.params.date).toDateString()}</Text>
                <Image style={{width: 400, height: 400,marginTop: 30, marginLeft: 7.5}} source={{uri: `data:image/jpg;base64,${this.base64}`}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5"

    },
    close: {
        marginBottom: 10,
        marginTop: 20,
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