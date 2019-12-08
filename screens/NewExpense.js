import React, {Component} from 'react';
import {
    Image,
    ImageBackground,
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
    Dimensions,
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
        openPhotoSelector: false,
        category: "",
        amount: "",
        img64: "",
        saving: false
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
        if (this.state.saving) {
            return
        }
        var db = firebase.firestore();
        var expenses = db.collection("expenses")
        if (this.state.title != "" && this.state.amount != "" && !isNaN(this.state.amount) && this.state.category != "default") {
            this.setState({saving: true})
            db.collection("photos").add({
                base64: this.state.img64,
                user: firebase.auth().currentUser.uid,
            }).then((ref) => {
                expenses.add({
                    user: firebase.auth().currentUser.uid,
                    title: this.state.title,
                    amount: this.state.amount,
                    date: this.state.chosenDate.getTime(),
                    category: this.state.category,
                    photo: ref.id
                }).then(() => {
                    this.props.navigation.state.params.callback()
                    this.props.navigation.goBack();
                })
            })
        } else {
            Alert.alert(
                'Incomplete Data',
                'Please input a title and amount and set a category',
                [
                  { text: 'OK' }
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
            this.setState({ img64: result.base64, openPhotoSelector: false});
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
            this.setState({img64: base64, openPhotoSelector: false})
        }
    }
    getPermissionAsync = async () => {
        /*const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
        const { cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
        if (cameraStatus !== 'granted') {
            alert('Sorry, we need camera permissions too!');
        }*/
    }
    handleClose = () => {
        if (this.state.title != "" || this.state.amount != "" || this.state.category != "default") {
            Alert.alert(
                'Closing will discard data',
                '',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {text: 'OK', onPress: () => this.props.navigation.goBack()},
                ],
                {cancelable: true},
              );
        } else {
            this.props.navigation.goBack()
        }
    }
    deleteImage = () => {
        this.setState({img64: ""})
    }
    render() {
        return (
            <KeyboardAvoidingView style={styles.outer} behavior="padding" enabled>
                <Ionicons style={styles.close} size={48} name={Platform.OS == "ios"?"ios-close":"md-close"} onPress={this.handleClose} />
                <View style={styles.container}>
                    <View style={{flexDirection: "row"}}>
                        <Input
                            placeholder={"New Expense"}
                            value={this.state.title}
                            onChangeText={value => this.setState({title: value})}
                            editable={!this.state.isSubmitting}
                            containerStyle={{flex: 1}}
                            />
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
                            containerStyle={{flex: .5}}
                            />
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 16}}>
                        <TouchableOpacity
                            onPress={this.handleDatePicker}
                            style={{borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 8, flexDirection: "row", marginLeft: 12}}
                            >
                            <Ionicons style={{marginLeft: 8, marginRight: 8}} size={22} name={Platform.OS == "ios"?"ios-calendar":"md-calendar"} />
                            <Text style={{fontSize: 14, fontFamily: "Comfortaa-Bold", paddingRight: 4}}>{this.state.chosenDate.getMonth()}/{this.state.chosenDate.getDate()}/{this.state.chosenDate.getFullYear()}</Text>
                        </TouchableOpacity>
                        <RNPickerSelect
                        onValueChange={value=>this.setState({category: value})}
                        placeholder={{label:"Select a category...", value: 'default'}}
                        useNativeAndroidPickerStyle={false}
                        style={pickerSelectStyles}
                        items={[
                            {label: "Groceries", value: 'groceries'},
                            {label: "Clothes", value: 'clothes'},
                            {label: "Transportation", value: 'transportation'},
                            {label: "Supplies", value: 'supplies'},
                            {label: "Miscellaneous", value: 'miscellaneous'},
                        ]} />
                    </View>

                    {this.state.img64?(
                        <ImageBackground
                            style={{
                                width: Dimensions.get("window").width - 32, 
                                height: 100, 
                                borderRadius: 8, 
                                marginHorizontal: 8, 
                                paddingHorizontal: Dimensions.get("window").width/6,
                                flexDirection: "row", 
                            }}
                            imageStyle={{borderRadius: 8, opacity: 0.5}}
                            source={{uri: `data:image/jpg;base64,${this.state.img64}`}}
                            >
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate("Photo", {img64: this.state.img64})} style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                                <Ionicons name={(Platform.OS == 'ios'?'ios-expand':'md-expand')} size={36} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.deleteImage()} style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                                <Ionicons name={(Platform.OS == 'ios'?'ios-trash':'md-trash')} size={36} />
                            </TouchableOpacity>
                         </ImageBackground>
                    ):(
                        <Button 
                            type="outline" 
                            onPress={()=>this.setState({openPhotoSelector: true})} 
                            title="Add Photo" 
                            buttonStyle={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                borderRadius: 5,
                                marginHorizontal: 12,
                                marginVertical: 8
                            }}
                            titleStyle={{
                                color: "black",
                                fontWeight: "normal",
                                fontFamily: "normal"
                            }}
                            />
                    )}
                    <Overlay
                        isVisible={this.state.openPhotoSelector}
                        windowBackgroundColor="rgba(255, 255, 255, .5)"
                        overlayBackgroundColor="white"
                        width="auto"
                        onBackdropPress={() => this.setState({ openPhotoSelector: false })}
                        height="auto"
                        >
                        <View style={{paddingVertical: 8, paddingHorizontal: 16}}>
                            <Text style={{fontSize: 18, fontFamily: "Comfortaa", marginBottom: 8}}>Add Photo</Text>
                            <TouchableOpacity
                                onPress={() => this.launchCamera()} 
                                style={{flexDirection: "row", marginVertical: 4, borderColor: "#eee", borderWidth: 1, padding: 4, borderRadius: 5}}
                                >
                                <Ionicons name={Platform.OS == 'ios'?'ios-camera':'md-camera'} size={28} style={{marginLeft: 8, width: 28, marginRight: 18, marginTop: 2}} />
                                <Text style={{fontSize: 18, fontFamily: "Comfortaa-Bold", paddingRight: 8}}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this._pickImage()} 
                                style={{flexDirection: "row", marginVertical: 4, borderColor: "#eee", borderWidth: 1, padding: 4, borderRadius: 5}}
                                >
                                <Ionicons name={Platform.OS == 'ios'?'ios-image':'md-image'} size={28} style={{marginLeft: 8, width: 28, marginRight: 18, marginTop: 2}} />
                                <Text style={{fontSize: 18, fontFamily: "Comfortaa-Bold", paddingRight: 8}}>Gallery</Text>
                            </TouchableOpacity>
                       </View>
                    </Overlay>
                    
                    <Button 
                        titleStyle={{color: "black"}} 
                        buttonStyle={{
                            marginTop: 8, 
                            borderWidth: 2, 
                            borderColor: "black", 
                            borderRadius: 5, 
                            marginHorizontal: 12,
                            backgroundColor: "transparent",
                        }} 
                        loadingProps={{
                            color: "black"
                        }}
                        title="Save" 
                        onPress={this.handleAdd} 
                        loading={this.state.saving} 
                        />
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      color: 'black',
      marginHorizontal: 12,
      paddingLeft: 30,
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      color: 'black',
      marginHorizontal: 12,
      paddingLeft: 30,
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    viewContainer: {
        flex: 1
    }
  });