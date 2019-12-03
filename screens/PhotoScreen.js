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

export default class PhotoScreen extends Component {
    render() {
        return (
            <View>
                <Image style={{flex: 1}} source={{uri: `data:image/jpg;base64,${this.props.navigation.params.state.img64}`}} />
            </View>
        )
    }
}