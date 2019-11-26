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
    DatePickerIOS
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Input, Button, Overlay } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'

export default class NewExpense extends Component {
    state = {
        title: "",
        isSubmitting: false,
        chosenDate: "10/21/1231",
        chosenDateO: new Date(),
        openDatePicker: false
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
              this.setState({})
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }
        }
    }
    setDate = (date) => {
        this.setState({chosenDateO: date})
    }
    render() {
        return (
            <KeyboardAvoidingView style={styles.outer} behavior="padding" enabled>
                <Ionicons style={styles.arrowBack} size={48} name={Platform.OS == "ios"?"ios-arrow-back":"md-arrow-back"} onPress={()=>this.props.navigation.goBack()} />
                <View style={styles.container}>
                    <Text style={styles.title}>New Expense</Text>
                    <Text>{JSON.stringify(this.state.chosenDateO)}</Text>
                    <Input
                        placeholder={"Title"}
                        value={this.state.title}
                        onChangeText={value => this.setState({title: value})}
                        editable={!this.state.isSubmitting}
                        />
                    <RNPickerSelect
                        onValueChange={value=>{}}
                        //placeholder={{name:"Select a category...", value: null}}
                        items={[
                            {label: "Groceries", value: 'groceries'},
                            {label: "Clothes", value: 'clothes'},
                            {label: "Transportation", value: 'transportation'},
                            {label: "Supplies", value: 'supplies'},
                            {label: "Miscellaneous", value: 'miscellaneous'},
                        ]} />
                            <Button title={this.state.chosenDate} onPress={this.handleDatePicker} />
                    <Button title="img" onPress={() => this.props.navigation.navigate("CameraScreen")} />
                </View>
                <Overlay
                    isVisible={this.state.openDatePicker}
                    windowBackgroundColor="rgba(255, 255, 255, .7)"
                    overlayBackgroundColor="white"
                    width="auto"
                    onBackdropPress={() => this.setState({ openDatePicker: false })}
                    height="auto"
                    >
                    <DatePickerIOS mode='date' date={this.state.chosenDateO} onDateChange={this.setDate} />
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
    arrowBack: {
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