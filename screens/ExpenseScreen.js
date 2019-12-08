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
    Alert,
    Dimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import * as firebase from 'firebase';
import 'firebase/firestore';
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe';
import { TouchableHighlight } from 'react-native-gesture-handler';

export default class ExpenseScreen extends Component {
    state = {
        loading: true
    }
    async componentDidMount() {
        var res = await firebase.firestore().collection("photos").doc(this.props.navigation.state.params.photo).get()
        this.base64 = res.data().base64
        this.setState({loading: false})
    }
    delete = () => {
        Alert.alert(
            'Delete',
            "Press 'Confirm' to delete this expense",
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {text: 'Confirm', onPress: async () => {
                    await this.props.navigation.state.params.firestoreRef.delete()
                    this.props.navigation.state.params.refresh()
                    this.props.navigation.goBack()
                }},
            ],
            {cancelable: true},
          );
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Ionicons style={styles.close} size={48} name={Platform.OS == "ios"?"ios-close":"md-close"} onPress={()=>this.props.navigation.goBack()} />
                    <Ionicons style={styles.delete} size={48} color="red" name={Platform.OS == "ios"?"ios-trash":"md-trash"} onPress={this.delete} />
                </View>
                <Text style= {{fontSize: 60,fontFamily: "Comfortaa-Bold",textAlign: "center",color: "#FFD700"}}> {this.props.navigation.state.params.title}</Text>
                <Text style= {{fontSize: 30,fontFamily: "Comfortaa",textAlign: "left", marginTop: 20,color: "#3CD371"}}>{'Amount: '+'$'+parseFloat(this.props.navigation.state.params.amount).toFixed(2)}</Text>
                <Text style= {{fontSize: 30,fontFamily: "Comfortaa",textAlign: "left", marginTop: 15,color: "#3CD371"}}>{'Type: ' +this.props.navigation.state.params.category}</Text>
                <Text style= {{fontSize: .1,textAlign: "center"}}>{this.props.navigation.state.params.user}</Text>
                <Text style= {{fontSize: 30,fontFamily: "Comfortaa",textAlign: "left", marginTop: 15,color: "#3CD371"}}>{'Date: ' +new Date(this.props.navigation.state.params.date).toDateString()}</Text>
                <TouchableHighlight
                    underlayColor="#000"
                    style={{
                        borderRadius: 8,
                        marginTop: 30, 
                        marginHorizontal: 8,
                    }}
                    onPress={()=>this.props.navigation.navigate("Photo", {img64: this.base64})}>
                    <Image style={{width: Dimensions.get("window").width - 16, height: 100, borderRadius: 8}} source={{uri: `data:image/jpg;base64,${this.base64}`}} />
                </TouchableHighlight>
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
    delete: {
        marginTop: 20,
        marginRight: 16,
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