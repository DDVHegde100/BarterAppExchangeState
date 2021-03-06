import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class ExchangeScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      itemName:"",
      itemDescription:"",
      IsExchangeRequestActive:""
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }
  getIsExchangeRequestActive(){
db.collection()
.where('username','==','this.state.userName')
.onSnapshot(querySnapshot=>{
querySnapshot.forEach(doc =>{
this.setState({
IsExchangeRequestActive:doc.data().IsExchangeRequestActive,
userDocId:doc.id
    })
  })
})
getExchangeRequest=()=>{
var exchangeRequest=db.collection('exchange_requests')
.where('username','==',this.state.userName)
.get()
.then((snapshot)=>{
snapshot.forEach((doc)=>{
if(doc.data().item_status !== "received"){
this.setState({
exchangeId:doc.data().exchangeId,
requestedItemName:doc.data().item_name,
itemStatus:doc.data().item_status,
docId:doc.id
              })
            }
          })
        })
      }}
    }
   addRequest =(itemName,itemDescription)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_items').add({
        "user_id": userId,
        "item_name":itemName,
        "item_description":itemDescription,
        "request_id"  : randomRequestId,
    })

    this.setState({
        itemName :'',
        itemDescription : ''
    })

    return Alert.alert( 
      'Item ready to exchange ',
    '',
    [
      {text : 'Ok',onPress:()=>{
      this.props.navigation.navigate('HomeScreen')
      }}
      ]
      );
  }


  render(){
    return(
        <View style={{flex:1}}>
          <MyHeader title="Add Item"/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter item name"}
                onChangeText={(text)=>{
                    this.setState({
                        itemName:text
                    })
                }}
                value={this.state.itemName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Description of item"}
                onChangeText ={(text)=>{
                    this.setState({
                      itemDescription:text
                    })
                }}
                value ={this.state.itemDescription}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.itemName,this.state.itemDescription)}}
                >
                <Text>Add Item</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
