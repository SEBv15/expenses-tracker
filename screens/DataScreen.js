import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
  Dimensions,
  RefreshControl,
} from 'react-native';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from 'react-native-chart-kit'

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
}

class AverageExpensesChart extends React.Component {
    state = {
        color: {
            "week": "#05668d",
            "month": "#37718e"
        }
    }
    async componentDidMount() {
        this.getData(this.props.view)
        this.props.addRefreshHandler(() => this.getData(this.props.view))
    }
    getData = async (range = "week") => {
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
            console.log(rgb)
            this.line.datasets[categoryToNum(category) + 1] = {
                data: [],
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
            }
        }

        //console.log("DOCS", res.docs)

        if (range == "week") {
            for (var i = 6; i >= 0; i--) {
                if (i != 0)
                    this.line.labels.push(moment().clone().subtract(i, 'days').format("ddd"))
                else
                    this.line.labels.push("Today");

                for (var j = 0; j <= 5; j++) {
                    this.line.datasets[j].data[i] = 0
                }

                for (var doc of res.docs) {
                    if (moment(doc.data().date).isSame(moment().subtract(6 - i, 'days'), 'd')) {
                        this.line.datasets[0].data[i] += parseFloat(doc.data().amount)
                        if (categoryToNum(doc.data().category) != -1)
                            this.line.datasets[categoryToNum(doc.data().category) + 1].data[i] += parseFloat(doc.data().amount)
                    }
                }
            }
        } else if (range == "month") {
            for (var i = 30; i >= 0; i--) {
                if (i % 6 == 3)
                    this.line.labels.push(moment().subtract(i, 'days').format("MM/DD"))
                else 
                    this.line.labels.push("")

                for (var j = 0; j <= 5; j++) {
                    this.line.datasets[j].data[i] = 0
                }

                for (var doc of res.docs) {
                    if (moment(doc.data().date).isSame(moment().subtract(30 - i, 'days'), 'd')) {
                        this.line.datasets[0].data[i] += parseFloat(doc.data().amount)
                        if (categoryToNum(doc.data().category) != -1)
                            this.line.datasets[categoryToNum(doc.data().category) + 1].data[i] += parseFloat(doc.data().amount)
                    }
                }
            }
        }
        console.log(this.line)
        this.setState({loading: false})
    }
    line = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43],
            strokeWidth: 2, // optional
            label: "asdaa"
          },
          {
              data: [29,53,121,23,23,23],
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`
          }
        ],
      };
    getData = async (range = "week") => {
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
            console.log(rgb)
            this.line.datasets[categoryToNum(category) + 1] = {
                data: [],
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
            }
        }

        //console.log("DOCS", res.docs)

        if (range == "week") {
            for (var i = 6; i >= 0; i--) {
                if (i != 0)
                    this.line.labels.push(moment().clone().subtract(i, 'days').format("ddd"))
                else
                    this.line.labels.push("Today");

                for (var j = 0; j <= 5; j++) {
                    this.line.datasets[j].data[i] = 0
                }

                for (var doc of res.docs) {
                    if (moment(doc.data().date).isSame(moment().subtract(6 - i, 'days'), 'd')) {
                        this.line.datasets[0].data[i] += parseFloat(doc.data().amount)
                        if (categoryToNum(doc.data().category) != -1)
                            this.line.datasets[categoryToNum(doc.data().category) + 1].data[i] += parseFloat(doc.data().amount)
                    }
                }
            }
        } else if (range == "month") {
            for (var i = 30; i >= 0; i--) {
                if (i % 6 == 3)
                    this.line.labels.push(moment().subtract(i, 'days').format("MM/DD"))
                else 
                    this.line.labels.push("")

                for (var j = 0; j <= 5; j++) {
                    this.line.datasets[j].data[i] = 0
                }

                for (var doc of res.docs) {
                    if (moment(doc.data().date).isSame(moment().subtract(30 - i, 'days'), 'd')) {
                        this.line.datasets[0].data[i] += parseFloat(doc.data().amount)
                        if (categoryToNum(doc.data().category) != -1)
                            this.line.datasets[categoryToNum(doc.data().category) + 1].data[i] += parseFloat(doc.data().amount)
                    }
                }
            }
        }
        console.log(this.line)
        this.setState({loading: false})
    }
    render() {
        return (
            <View style={{backgroundColor: this.state.color[this.props.view], paddingVertical: 8}}>
                <Text style={{fontSize: 24, color: "white", fontFamily: "Comfortaa-SemiBold", marginHorizontal: 16, marginVertical: 16}}>This {this.props.view == "week"?"Week":"Month"}</Text>
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
            </View>
        )
    }
}

class ExpenseDistribution extends React.Component {
    state = {
        color: "#18314f"
    }
    data = [
      ];
    componentDidMount() {
        this.getData()
        this.props.addRefreshHandler(() => this.getData())
    }
    getData = async () => {
        var res = await firebase
        .firestore()
        .collection("expenses")
        .where("user", "==", firebase.auth().currentUser.uid)
        .orderBy("date", "desc")
        .get()

        this.data = []

        for (let category of Object.keys(colors)) {
            let rgb = hexToRgb(colors[category])
            console.log(rgb)
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

        //console.log("DOCS", res.docs)

        for (let doc of res.docs) {
            if (categoryToNum(doc.data().category) >= 0)
                this.data[categoryToNum(doc.data().category)].amount += parseFloat(doc.data().amount)
        }
        console.log(this.data)
        this.setState({loading: false})
    }
    render() {
        return (
            <View style={{backgroundColor: this.state.color}}>
                <Text style={{fontSize: 24, color: "white", fontFamily: "Comfortaa-SemiBold", marginHorizontal: 16, marginVertical: 16}}>Makeup</Text>
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
                    absolute
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
            <View style={{flex: 1}}>
                <View style={styles.legend}>
                    <Text style={styles.legendItem}>Total</Text>
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
        borderBottomColor: "#ddd",
    },
    legendItem: {
        flex: 1,
        fontSize: 9,
        paddingTop: 26,
        textAlign: "center",
        paddingBottom: 2,
    },
    title: {
        fontSize: 48,
        textAlign: "center",
        fontFamily: "Comfortaa-Bold"
    }
})