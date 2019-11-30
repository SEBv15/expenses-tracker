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
} from 'react-native';
import { NavigationEvents } from 'react-navigation';

import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe';

import * as firebase from 'firebase';
import 'firebase/firestore';

function CategoryIcon({category}) {
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
      return <View style={styles.categoryIcon} />
  }
}

function Expense({ navigate, ...props }) {
  return (
    <TouchableNativeFeedbackSafe 
      style={styles.expenseView}
      onPress={() => navigate("Expense",{...props})}
      background={TouchableNativeFeedbackSafe.SelectableBackground()}>
      <CategoryIcon category={props.category} />
      <Text style={styles.expenseTitle}>{props.title}</Text>
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

export default class HomeScreen extends React.Component {
  state = {
    lastExpense: null
  }
  expenses = [

  ]
  componentDidMount() {
    this.loadExpenses()
  }
  loadExpenses = async () => {
    var ref = firebase
    .firestore()
    .collection("expenses")
    .where("user", "==", firebase.auth().currentUser.uid)
    .orderBy("date", "desc")

    var data = await ref.limit(20).get()

    this.expenses = []
    var lastDate = null
    for (var doc of data.docs) {
      console.log(doc.data())
      var date = new Date(doc.get("date"))
      console.log(date, doc.get("date"))
      date = date.toDateString()
      if (lastDate === null || lastDate != date) {
        lastDate = date
        this.expenses.push({
          title: date,
          data: []
        })
      }
      this.expenses[this.expenses.length - 1].data.push({...doc.data(), ...{firestoreRef: doc.ref}})
    }
    this.setState({lastExpense: data.docs[data.docs.length - 1]})
  }
  buttonPressHandler = () => {
    this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().navigate("NewExpense")
  }
  render() {
    return (
      <View style={styles.container}>
        {/*<Text style={styles.title}>Expenses</Text>*/}
        <NavigationEvents
          onWillFocus={payload => this.loadExpenses()}
        />
        <View style={{height: (Platform.OS == 'ios'?18:24)}} />
        <SectionList
          sections={this.expenses}
          style={styles.list}
          keyExtractor={(item, index) => item.date + index}
          renderItem={({ item }) => <Expense {...item} navigate={this.props.navigation.navigate} />}
          ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: "#eee", marginHorizontal: 12}} />}
          ListFooterComponent={() => <View style={{height: 70}} />}
          stickySectionHeadersEnabled={true}
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
    textAlign: "center"
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
  },
  expenseAmount: {
    fontSize: 20,
    fontFamily: "monospace",
  },
  categoryIcon: {
    marginRight: 24,
    marginLeft: 12,
    marginTop: 2,
    width: 20
  }
});
