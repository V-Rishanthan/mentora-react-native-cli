import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ZIMKit } from '@zegocloud/zimkit-rn';
import {useNavigation} from "@react-navigation/native"

const ChatLogin = () => {
  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');

  const navigation = useNavigation()

 const appConfig = {
    appID: 68270551, // The AppID you get from ZEGOCLOUD Admin Console.
    appSign: '0485d64e055a2c832518605cd8ed32437f6d8081956add41b054165279d1d98f', // The AppSign you get from ZEGOCLOUD Admin Console.
  };

   useEffect(()=>{
     ZIMKit.init(appConfig.appID, appConfig.appSign);
   },[])

  //  const chatToLogin = () =>{
  //   ZIMKit.connectUser({userID,userName},'').then(data =>{
  //       if(data===userID){
  //          navigation.navigate('ChatHome');
  //       }
  //   })
  //  }

  const chatToLogin = async () => {
  try {
    if (!userID || !userName) {
      console.log("Please enter userID and userName");
      return;
    }

    const result = await ZIMKit.connectUser({ userID, userName }, "");
    console.log(" ZIM connected:", result);

    //  Navigate + pass params
    navigation.navigate("ChatHome", { userID, userName });
  } catch (e) {
    console.log(" zim login err", e);
  }
};


  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-3xl font-bold mb-8 text-blue-600">Welcome Back</Text>
      
      {/* User ID Input */}
      <View className="w-full mb-4">
        <Text className="text-gray-600 mb-2 ml-1">User ID</Text>
        <TextInput
          className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-gray-50"
          placeholder="Enter your ID"
          value={userID}
          onChangeText={setUserID}
        />
      </View>

      {/* Username Input */}
      <View className="w-full mb-8">
        <Text className="text-gray-600 mb-2 ml-1">Username</Text>
        <TextInput
          className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-gray-50"
          placeholder="Enter username"
          value={userName}
          onChangeText={setUserName}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity 
        className="w-full bg-blue-600 h-14 rounded-xl justify-center items-center shadow-lg"
        onPress={chatToLogin}
      >
        <Text className="text-white text-lg font-semibold">Login</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ChatLogin