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
<<<<<<< HEAD
                <Text style= {{fontSize: 60,fontFamily: "Comfortaa",textAlign: "center",color: "#FFD700"}}> {this.props.navigation.state.params.title}</Text>
                <Text style= {{fontSize: 30,fontFamily: "Comfortaa",textAlign: "center", marginTop: 15,color: "#3CD371"}}>{'Amount: '+'$'+parseFloat(this.props.navigation.state.params.amount).toFixed(2)}</Text>
                <Text style= {{fontSize: 30,fontFamily: "Comfortaa",textAlign: "center", marginTop: 15,color: "#3CD371"}}>{'Type: ' +this.props.navigation.state.params.category}</Text>
                <Text style= {{fontSize: .1,textAlign: "center"}}>{this.props.navigation.state.params.user}</Text>
                <Text style= {{fontSize: 30,fontFamily: "Comfortaa",textAlign: "center", marginTop: 15,color: "#3CD371"}}>{'Date: ' +new Date(this.props.navigation.state.params.date).toDateString()}</Text>
=======
                <Text style= {{fontSize: 60,fontFamily: "Comfortaa",textAlign: "center",}}> {this.props.navigation.state.params.title}</Text>
                <Text style= {{fontSize: 35,fontFamily: "Comfortaa",textAlign: "center", marginTop: 15}}>Amount: ${parseFloat(this.props.navigation.state.params.amount).toFixed(2)}</Text>
                <Text style= {{fontSize: 35,fontFamily: "Comfortaa",textAlign: "center", marginTop: 15}}>Type: {this.props.navigation.state.params.category}</Text>
                {/*<Text style= {{fontSize: 35,textAlign: "center"}}>{this.props.navigation.state.params.user}</Text>*/}
                <Text style= {{fontSize: 35,fontFamily: "Comfortaa",textAlign: "center", marginTop: 15}}>Date: {new Date(this.props.navigation.state.params.date).toDateString()}</Text>
>>>>>>> fd5914d6977ba8d2ac1dac17f03c88076a207dac
                <Image style={{width: 400, height: 400,marginTop: 30, marginLeft: 7.5}} source={{uri: `data:image/jpg;base64,${this.base64}`}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E90FF"

    },
    close: {
        marginBottom: 10,
        marginTop: 20,
        marginLeft: 16,
    },
    expenseAmount: {
        fontSize: 21,
        fontFamily: "space-mono"
    },
    expenseTitle: {
        fontSize: 20,
        flex: 1,
        fontFamily: "Comfortaa",
    },
})