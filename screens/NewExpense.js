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
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as Permissions from 'expo-permissions';

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
        if (this.state.title != "" && this.state.amount != "" && this.state.category != "default") {
            expenses.add({
                user: firebase.auth().currentUser.uid,
                title: this.state.title,
                amount: this.state.amount,
                date: this.state.chosenDate.getTime(),
                category: this.state.category,
                photo: this.state.img64
            })
            this.props.navigation.goBack();
        } else {
            Alert.alert(
                'Incomplete Dara',
                'Please input a title and amount and set a category',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: true},
              );
        }
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
    handleClose = () => {
        if (this.state.title != "" || this.state.amount != "" || this.state.category != "default") {
            Alert.alert(
                'Closing will discard data',
                '',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: 'OK', onPress: () => this.props.navigation.goBack()},
                ],
                {cancelable: false},
              );
        } else {
            this.props.navigation.goBack()
        }
    }
    render() {
        return (
            <KeyboardAvoidingView style={styles.outer} behavior="padding" enabled>
                <Ionicons style={styles.close} size={48} name={Platform.OS == "ios"?"ios-close":"md-close"} onPress={this.handleClose} />
                <View style={styles.container}>
                    <Input
                        placeholder={"New Expense"}
                        value={this.state.title}
                        onChangeText={value => this.setState({title: value})}
                        editable={!this.state.isSubmitting}
                        containerStyle={{marginTop: 12}}
                        />
                    <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 16}}>
                        <Input
                            placeholder='0.00'
                            keyboardType="numeric"
                            value={this.state.amount}
                            onChangeText={value => this.setState({amount: value})}
                            errorStyle={{ color: 'red' }}
                            editable={!this.state.isSubmitting}
                            leftIcon={<Text style={{fontSize: 24, marginRight: 2, color: "#444"}}>$</Text>}
                            inputStyle={{marginLeft: 0}}
                            inputContainerStyle={{borderBottomWidth: 0, marginLeft: 0, paddingLeft: 0}}
                            containerStyle={{flex: 1}}
                            />
                        <TouchableOpacity
                            onPress={this.handleDatePicker}
                            style={{borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 8, flexDirection: "row", marginRight: 12}}
                            >
                            <Ionicons style={{marginLeft: 8, marginRight: 8}} size={22} name={Platform.OS == "ios"?"ios-calendar":"md-calendar"} />
                            <Text style={{fontSize: 14, fontFamily: "Comfortaa-Bold", paddingRight: 4}}>{this.state.chosenDate.getMonth()}/{this.state.chosenDate.getDate()}/{this.state.chosenDate.getFullYear()}</Text>
                        </TouchableOpacity>
                    </View>

                    <RNPickerSelect
                        onValueChange={value=>this.setState({category: value})}
                        placeholder={{label:"Select a category...", value: 'default'}}
                        items={[
                            {label: "Groceries", value: 'groceries'},
                            {label: "Clothes", value: 'clothes'},
                            {label: "Transportation", value: 'transportation'},
                            {label: "Supplies", value: 'supplies'},
                            {label: "Miscellaneous", value: 'miscellaneous'},
                        ]} />
                    {/*<Image style={{width: 200, height: 200}} source={{uri: `data:image/jpg;base64,${this.state.img64}`}} />*/}
                    <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                        <Button buttonStyle={[styles.imgBtn]} type="outline" title="Camera" onPress={() => this.launchCamera()} />
                        <Button buttonStyle={[styles.imgBtn]} type="outline" title="Gallery" onPress={() => this._pickImage()} />
                    </View>
                    
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
        padding: 8,
    },
    close: {
        marginTop: 32,
        marginLeft: 16,
    },
    title: {
        fontSize: 48,
        textAlign: "center",
        fontFamily: "Comfortaa-SemiBold"
    },
    iospicker: {
        position: "absolute",
        flex: 1,
        top: 0,
        left: 0,
        justifyContent: "center"
    },
    imgBtn: {
        borderRadius: 40,
        borderWidth: 3,
        marginTop: 12,
        marginHorizontal: 4,
        paddingHorizontal: 8,
    }
})