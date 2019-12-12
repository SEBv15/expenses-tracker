import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from 'react-native-chart-kit'

import { Input, Button, Overlay, ButtonGroup } from 'react-native-elements'

import * as firebase from 'firebase';
import 'firebase/firestore';

import moment from 'moment';

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function categoryToNum(category) {
    switch (category) {
        case "default":
            return -1;
        case "groceries":
            return 0;
        case "clothes":
            return 1;
        case "transportation":
            return 2;
        case "supplies":
            return 3;
        case "miscellaneous":
            return 4;
        case "geoff":
            return 5;
        default:
            return -1;
    }
}

var colors = {
    groceries: "#264653",
    clothes: "#2a9d8f",
    transportation: "#e9c46a",
    supplies: "#f4a261",
    miscellaneous: "#e76f51",
    geoff: "#ffc0cb"
}

class AverageExpensesChart extends React.Component {
    state = {
        color: {
            "week": "#05668d",
            "month": "#37718e"
        },
        loading: true,
    }
    async componentDidMount() {
        this.getData(this.props.view)
        this.props.addRefreshHandler(() => this.getData(this.props.view))
    }
    line = {};
    getData = async (range = "week") => {
        this.setState({loading: true})

        var res = await firebase
        .firestore()
        .collection("expenses")
        .where("user", "==", firebase.auth().currentUser.uid)
        .orderBy("date", "desc")
        .endAt(Date.now() - 1000*60*60*24*(range == "week"?7:31))
        .get()

        this.line = {
            labels: [],
            datasets: [
                {
                    data: [],
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
                }
            ]
        }

        for (let category of Object.keys(colors)) {
            let rgb = hexToRgb(colors[category])
            this.line.datasets[categoryToNum(category) + 1] = {
                data: [],
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
            }
        }

        var total = 0;

        if (range == "week") {
            for (var i = 6; i >= 0; i--) {
                if (i != 0)
                    this.line.labels.push(moment().clone().subtract(i, 'days').format("ddd"))
                else
                    this.line.labels.push("Today");

                for (var j = 0; j <= 6; j++) {
                    this.line.datasets[j].data[i] = 0
                }

                for (var doc of res.docs) {
                    if (moment(doc.data().date).isSame(moment().subtract(6 - i, 'days'), 'd')) {
                        this.line.datasets[0].data[i] += parseFloat(doc.data().amount)
                        total += this.line.datasets[0].data[i]
                        if (categoryToNum(doc.data().category) != -1)
                            this.line.datasets[categoryToNum(doc.data().category) + 1].data[i] += parseFloat(doc.data().amount)
                    }
                }
            }
        } else if (range == "month") {
            for (var i = 29; i >= 0; i--) {
                if (i % 6 == 3)
                    this.line.labels.push(moment().subtract(i, 'days').format("MM/DD"))
                else 
                    this.line.labels.push("")

                for (var j = 0; j <= 6; j++) {
                    this.line.datasets[j].data[i] = 0
                }

                for (var doc of res.docs) {
                    if (moment(doc.data().date).isSame(moment().subtract(29 - i, 'days'), 'd')) {
                        this.line.datasets[0].data[i] += parseFloat(doc.data().amount)
                        total += this.line.datasets[0].data[i]
                        if (categoryToNum(doc.data().category) != -1)
                            this.line.datasets[categoryToNum(doc.data().category) + 1].data[i] += parseFloat(doc.data().amount)
                    }
                }
            }
        }
        this.setState({loading: false, avg: total / ((range == "week")?7:30)})
    }
    render() {
        return (
            <View style={{backgroundColor: this.state.color[this.props.view], paddingVertical: 8}}>
                <Text style={{fontSize: 24, color: "white", fontFamily: "Comfortaa-SemiBold", marginHorizontal: 16, marginTop: 16, marginBottom: 0}}>This {this.props.view == "week"?"Week":"Month"}</Text>
                {this.state.loading?(
                <ActivityIndicator color="#fff" style={{height: 220 + 24 + 16, marginVertical: 8}} size="large" />
                ):(
                <React.Fragment>
                    <Text style={{
                        fontFamily: "Comfortaa",
                        fontSize: 16,
                        color: "white",
                        opacity: 0.7,
                        marginHorizontal: 16,
                        marginBottom: 16,
                        marginTop: 0,
                        height: 24,
                    }}>Daily Avg: <Text style={{fontFamily: "space-mono"}}>${this.state.avg.toFixed(2)}</Text></Text>
                    <LineChart
                        data={this.line}
                        width={Dimensions.get('window').width} // from react-native
                        height={220}
                        yAxisLabel={'$'}
                        chartConfig={{
                            backgroundColor: this.state.color[this.props.view],
                            backgroundGradientFrom: this.state.color[this.props.view],
                            backgroundGradientTo: this.state.color[this.props.view],
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                            marginRight: 0
                        }}
                    />
                </React.Fragment>
                )}
            </View>
        )
    }
}

class ExpenseDistribution extends React.Component {
    state = {
        color: "#18314f",
        loading: true,
        range: 0,
        total: 0,
    }
    data = [
      ];
    buttons = ["Week", "Month", "All"]
    componentDidMount() {
        this.getData()
        this.props.addRefreshHandler(() => this.getData())
    }
    getData = async (range) => {
        this.setState({loading: true})

        var res = await firebase
        .firestore()
        .collection("expenses")
        .where("user", "==", firebase.auth().currentUser.uid)
        .orderBy("date", "desc")
        .endBefore(range == 2?0:(moment().subtract((range?30:7), 'days').valueOf()))
        .get()

        this.data = []

        for (let category of Object.keys(colors)) {
            let rgb = hexToRgb(colors[category])
            if (categoryToNum(category) >= 0) {
                this.data[categoryToNum(category)] = {
                    name: category.charAt(0).toUpperCase() + category.substr(1),
                    amount: 0,
                    color: colors[category],
                    legendFontColor: colors[category],
                    legendFontSize: 12
                }
            }
        }

        var total = 0;

        for (let doc of res.docs) {
            if (categoryToNum(doc.data().category) >= 0)
                this.data[categoryToNum(doc.data().category)].amount += parseFloat(doc.data().amount)
            total += parseFloat(doc.data().amount)
        }
        this.setState({loading: false, total: total})
    }
    updateRange = (r) => {
        this.setState({range: r})
        this.getData(r);
    }
    render() {
        return (
            <View style={{backgroundColor: this.state.color}}>
                <Text style={{fontSize: 24, color: "white", fontFamily: "Comfortaa-SemiBold", marginHorizontal: 16, marginTop: 16}}>Makeup</Text>
                {this.state.loading?(
                <ActivityIndicator size="large" color="#fff" style={{height: 220 + 24 + 16}} />
                ):(
                <React.Fragment>
                    <Text style={{
                        fontFamily: "Comfortaa",
                        fontSize: 16,
                        color: "white",
                        opacity: 0.7,
                        marginHorizontal: 16,
                        marginBottom: 16,
                        marginTop: 0,
                        height: 24,
                    }}>Total: <Text style={{fontFamily: "space-mono"}}>${this.state.total.toFixed(2)}</Text></Text>
                    <PieChart
                        data={this.data}
                        width={Dimensions.get("window").width}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                            borderRadius: 16
                            },
                            propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                            }
                        }}
                        accessor="amount"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        />
                    </React.Fragment>

                )}
                <ButtonGroup
                    onPress={this.updateRange}
                    selectedIndex={this.state.range}
                    buttons={this.buttons}
                    containerStyle={{
                        height: 36,
                        borderWidth: 0, 
                        backgroundColor: "transparent",
                        marginBottom: 24
                    }}
                    buttonStyle={{
                        backgroundColor: "rgba(255,255,255,0.3)",
                    }}
                    selectedButtonStyle={{
                        backgroundColor: "white"
                    }}
                    textStyle={{
                        color: "white"
                    }}
                    innerBorderStyle={{
                        color: "rgba(255,255,255,0.4)"
                    }}
                    selectedTextStyle={{
                        color: this.state.color
                    }}
                    />
            </View>
        )
    }
}

export default class DataScreen extends React.Component {
    state = {
        refreshing: false,
    }
    cbs = []
    addRefreshHandler = (cb) => {
        this.cbs.push(cb)
    }
    refresh = async () => {
        this.setState({refreshing: true})
        for (let cb in this.cbs) {
            await this.cbs[cb]()
        }
        this.setState({refreshing: false})
    }
    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#05668d"}}>
                <View style={styles.legend}>
                    <Text style={[styles.legendItem, {backgroundColor: "white"}]}>Total</Text>
                    {Object.keys(colors).map((c) => (<Text style={[styles.legendItem, {backgroundColor: colors[c]}]} key={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Text>))}
                </View>
                <ScrollView style={styles.container} contentContainerStyle={{}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />}>
                    <AverageExpensesChart addRefreshHandler={this.addRefreshHandler} view="week" />
                    <AverageExpensesChart addRefreshHandler={this.addRefreshHandler} view="month" />
                    <ExpenseDistribution addRefreshHandler={this.addRefreshHandler} />
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    legend: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#777",
    },
    legendItem: {
        flex: 1,
        fontSize: 8,
        paddingTop: (Platform.OS == 'ios'?32:26),
        textAlign: "center",
        paddingBottom: 2,
    },
    title: {
        fontSize: 48,
        textAlign: "center",
        fontFamily: "Comfortaa-Bold"
    }
})