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
                <Ionicons style={{top: 32, left: 16, position: "absolute"}} color="#fff" size={48} name={Platform.OS == "ios"?"ios-close":"md-close"} onPress={this.props.navigation.goBack} />
                <Image resizeMode="contain" style={{flex: 1}} source={{uri: `data:image/jpg;base64,${this.props.navigation.state.params.img64}`}} />
            </View>
        )
    }
}