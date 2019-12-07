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
  SectionList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';

import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe';

import * as firebase from 'firebase';
import 'firebase/firestore';

import moment from 'moment';

function CategoryIcon({category}) {
  var colors = {
    groceries: "#264653",
    clothes: "#2a9d8f",
    transportation: "#e9c46a",
    supplies: "#f4a261",
    miscellaneous: "#e76f51",
    default: "white"
  }
  function getIcon(category) {
    switch(category) {
      case "groceries":
        return <MaterialIcons size={24} style={styles.categoryIcon} name="local-grocery-store" />
      case "clothes":
        return <Ionicons size={24} style={styles.categoryIcon} name={(Platform.OS == 'ios')?"ios-shirt":"md-shirt"} />
      case "transportation":
        return <Ionicons size={24} style={styles.categoryIcon} name={(Platform.OS == 'ios')?"ios-bus":"md-bus"} />
      case "supplies":
        return <Ionicons size={24} style={styles.categoryIcon} name={(Platform.OS == 'ios')?"ios-flower":"md-flower"} />
      case "miscellaneous":
        return <FontAwesome size={24} style={styles.categoryIcon} name="question-circle-o" />
      default:
        return null
    }
  }
  return (
    <View style={[styles.categoryIconContainer, {backgroundColor: colors[category?category:"default"]}]}>
      {getIcon(category)}
    </View>
  )
}

function Expense({ navigate, ...props }) {
  return (
    <TouchableNativeFeedbackSafe 
      style={styles.expenseView}
      onPress={() => navigate("Expense",{...props})}
      background={TouchableNativeFeedbackSafe.SelectableBackground()}>
      <CategoryIcon category={props.category} />
      <Text numberOfLines={1} style={styles.expenseTitle}>{props.title}</Text>
      <Text style={styles.expenseAmount}>${parseFloat(props.amount).toFixed(2)}</Text>
    </TouchableNativeFeedbackSafe>
  );
}

function DateTitle({date}) {
  return (
    <View style={styles.dateView}>
      <Text style={styles.date}>{date}</Text>
    </View>
  )
}

function dateToString(date) {
  date = moment(date)
  var now = moment()
  if (date.isSame(now, 'd')) {
    return "Today"
  } else if (date.isSame(now.clone().subtract(1, 'days'), 'd')) {
    return "Yesterday"
  }
  for (var i = 2; i < 7; i++) {
    if (date.isSame(now.clone().subtract(i, 'days'), 'd')) {
      return date.format('dddd')
    }
  }
  if (date.isSame(now, 'y')) {
    return date.format("MMMM D")
  }
  return date.format("MMMM D, Y")
}

export default class HomeScreen extends React.Component {
  state = {
    lastExpense: null,
    loading: false,
    refreshing: false
  }
  expenses = [

  ]
  lastExpense = null;
  componentDidMount() {
    this.loadExpenses()
  }
  loadExpenses = async (after) => {
    this.setState({loading: true})
    var ref = firebase
    .firestore()
    .collection("expenses")
    .where("user", "==", firebase.auth().currentUser.uid)
    .orderBy("date", "desc")

    if (after) {
      ref = ref.startAfter(after)
    }

    var data = await ref.limit(5).get()

    if (!after) {
      this.lastDate = null
      this.expenses = []
    }

    for (var doc of data.docs) {
      //console.log(doc.data())
      var date = new Date(doc.get("date"))
      //console.log(date, doc.get("date"))
      date = date.toDateString()
      if (this.lastDate === null || this.lastDate != date) {
        this.lastDate = date
        this.expenses.push({
          title: dateToString(doc.get("date")),
          data: []
        })
      }
      this.expenses[this.expenses.length - 1].data.push({...doc.data(), ...{firestoreRef: doc.ref}})
    }
    this.lastExpense = data.docs[data.docs.length - 1]
    this.setState({loading: false})
  }
  loadMore = () => {
    if (!this.state.loading)
      this.loadExpenses(this.lastExpense)
  }
  refresh = async () => {
    this.setState({refreshing: true})
    await this.loadExpenses()
    this.setState({refreshing: false})
  }
  buttonPressHandler = () => {
    this.props.navigation.navigate("NewExpense", {
      callback: this.loadExpenses
    })
  }
  render() {
    return (
      <View style={styles.container}>
        {/*<Text style={styles.title}>Expenses</Text>*/}
        <NavigationEvents
         // onWillFocus={payload => this.loadExpenses()}
        />
        <View style={{height: (Platform.OS == 'ios'?18:24)}} />
        <SectionList
          sections={this.expenses}
          style={styles.list}
          keyExtractor={(item, index) => item.date + index}
          renderItem={({ item }) => <Expense {...item} refresh={this.loadExpenses} navigate={this.props.navigation.navigate} />}
          ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: "#eee", marginHorizontal: 12}} />}
          ListFooterComponent={() => <View style={{height: 70}}>{(this.state.loading?<ActivityIndicator color="#000" style={{marginTop: 8}} size="small" />:null)}</View>}
          ListEmptyComponent={() => <View style={{flex: 1, justifyContent: "center", marginTop: Dimensions.get("window").height / 3}}><Text style={{textAlign: "center", fontFamily: "Comfortaa-SemiBold", fontSize: 32, marginHorizontal: 36, color: "#aaa"}}>No expenses yet. Add some!</Text></View>}
          stickySectionHeadersEnabled={true}
          onEndReached={()=>this.loadMore()}
          onRefresh={this.refresh}
          refreshing={this.state.refreshing}
          renderSectionHeader={({ section: { title } }) => (
            <DateTitle date={title} />
          )}
        />
        <TouchableOpacity
          style={{
              borderWidth:1,
              borderColor:'rgba(0,0,0,0.2)',
              alignItems:'center',
              justifyContent:'center',
              width:70,
              position: 'absolute',                                          
              bottom: 10,                                                    
              right: 10,
              height:70,
              backgroundColor:'#fff',
              borderRadius:100,
            }}
            onPress={this.buttonPressHandler}
          >
          <Ionicons name={Platform.OS == 'ios'?"ios-add":"md-add"}  size={30} color="#994411" />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: "center",
  },
  addButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 36,
    height: 36
  },
  title: {
    fontSize: 48,
    textAlign: "center",
    fontFamily: "Comfortaa"
  },
  dateView: {
    backgroundColor: "#fafafa",
    borderTopColor: "#eee",
    borderTopWidth: 1,
  },
  date: {
    textAlign: "center",
    color: "#777"
  },
  expenseView: {
    flexDirection: "row",
    padding: 16
  },
  expenseTitle: {
    fontSize: 20,
    flex: 1,
    fontFamily: "Comfortaa",
  },
  expenseAmount: {
    fontSize: 21,
    fontFamily: "space-mono",
  },
  categoryIconContainer: {
    marginRight: 24,
    marginLeft: 12,
    marginTop: 2,
    width: 28,
    backgroundColor: "red",
    borderRadius: 20,
    height: 28,
    justifyContent: "center",
    alignItems: "center"
  },
  categoryIcon: {
    opacity: .7,
    color: "#fff",
  }
});
