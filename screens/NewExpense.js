import React, {Component} from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    DatePickerAndroid, 
    DatePickerIOS,
    Permissions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Input, Button, Overlay } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'
import * as firebase from 'firebase';
import 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default class NewExpense extends Component {
    state = {
        title: "",
        isSubmitting: false,
        chosenDate: new Date(),
        openDatePicker: false,
        category: "",
        amount: "",
        img64: ""
    }
    componentDidMount() {
        this.getPermissionAsync()
    }
    handleDatePicker = async () => {
        if (Platform.OS == 'ios') {
            this.setState({openDatePicker: true})
        } else {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
              // Use `new Date()` for current date.
              // May 25 2020. Month 0 is January.
              date: new Date(),
            });
            if (action !== DatePickerAndroid.dismissedAction) {
              // Selected year, month (0-11), day
              this.setState({chosenDate: (new Date(year, month, day))})
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }
        }
    }
    setDate = (date) => {
        this.setState({chosenDate: date})
    }
    handleAdd = () => {
        var db = firebase.firestore();
        var expenses = db.collection("expenses")
        expenses.add({
            user: firebase.auth().currentUser.uid,
            title: this.state.title,
            amount: this.state.amount,
            date: this.state.chosenDate.getTime(),
            category: this.state.category,
            photo: this.state.img64
          })
        this.props.navigation.goBack();
        /*var ref = database.ref('expenses/'+firebase.auth().currentUser.uid.replace("/", ""))
        ref.set({

            title: this.state.title,
            amount: this.state.amount,
          });*/
        
    }
    
    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3,
            base64: true
        });

        if (!result.cancelled) {
            this.setState({ img64: result.base64 });
        }
    };
    launchCamera = async () => {
        const { cancelled, width, height, base64 } = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.3,
            base64: true
        })
        if (!cancelled) {
            this.setState({img64: base64})
        }
    }
    getPermissionAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
        status = await Permissions.askAsync(Permissions.CAMERA).status;
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions too!');
        }
    }
    render() {
        return (
            <KeyboardAvoidingView style={styles.outer} behavior="padding" enabled>
                <Ionicons style={styles.close} size={48} name={Platform.OS == "ios"?"ios-close":"md-close"} onPress={()=>this.props.navigation.goBack()} />
                <View style={styles.container}>
                    <Text style={styles.title}>New Expense</Text>
                    <Text>{JSON.stringify(this.state.chosenDate)}</Text>
                    <Input
                        placeholder={"Title"}
                        value={this.state.title}
                        onChangeText={value => this.setState({title: value})}
                        editable={!this.state.isSubmitting}
                        />
                    <Input
                        placeholder='Amount'
                        keyboardType="numeric"
                        value={this.state.amount}
                        onChangeText={value => this.setState({amount: value})}
                        errorStyle={{ color: 'red' }}
                        editable={!this.state.isSubmitting}
                        />
                    <RNPickerSelect
                        onValueChange={value=>this.setState({category: value})}
                        //placeholder={{name:"Select a category...", value: null}}
                        items={[
                            {label: "Groceries", value: 'groceries'},
                            {label: "Clothes", value: 'clothes'},
                            {label: "Transportation", value: 'transportation'},
                            {label: "Supplies", value: 'supplies'},
                            {label: "Miscellaneous", value: 'miscellaneous'},
                        ]} />
                    <Button title={this.state.chosenDate.getDay()} onPress={this.handleDatePicker} />
                    <Image style={{width: 400, height: 400}} source={{uri: `data:image/jpg;base64,${this.state.img64}`}} />
                    <Button title="Camera" onPress={() => this.launchCamera()} />
                    <Button title="Gallery" onPress={() => this._pickImage()} />
                    
                    <Button style={{marginTop: 8}} title="Add" onPress={this.handleAdd} />
                </View>
                <Overlay
                    isVisible={this.state.openDatePicker}
                    windowBackgroundColor="rgba(255, 255, 255, .5)"
                    overlayBackgroundColor="white"
                    width= {500}
                    onBackdropPress={() => this.setState({ openDatePicker: false })}
                    height="auto"
                    >
                    <React.Fragment>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Button title="Done" type="clear" onPress={()=>this.setState({openDatePicker: false})} />
                        </View>
                        <DatePickerIOS mode='date' date={this.state.chosenDate} onDateChange={this.setDate} />
                    </React.Fragment>
                </Overlay>
            </KeyboardAvoidingView>
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
    close: {
        marginTop: 16
    },
    title: {
        fontSize: 48,
        textAlign: "center"
    },
    iospicker: {
        position: "absolute",
        flex: 1,
        top: 0,
        left: 0,
        justifyContent: "center"
    }
})