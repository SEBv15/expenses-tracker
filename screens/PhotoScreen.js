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
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default class PhotoScreen extends Component {
    render() {
        return (
            <View style={{backgroundColor: "black", flex: 1}}>
                <Image resizeMode="contain" style={{flex: 1}} source={{uri: `data:image/jpg;base64,${this.props.navigation.state.params.img64}`}} />
                <TouchableOpacity style={{top: 32, left: 16, position: "absolute"}} onPress={()=>this.props.navigation.goBack()}>
                    <Ionicons color="#fff" size={48} name={Platform.OS == "ios"?"ios-close":"md-close"} />
                </TouchableOpacity>
            </View>
        )
    }
}