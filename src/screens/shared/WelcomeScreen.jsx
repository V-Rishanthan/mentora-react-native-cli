import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native' 

const WelcomeScreen = () => {
    const navigation = useNavigation() 

    useEffect(() => {
        setTimeout(()=>{
             navigation.replace("Landing") 
        },3000)
       
    }, [])

    return (
        <View className="flex-1 justify-center items-center px-5 bg-white">
            <View className="w-full max-w-80 h-64 mb-8">
                <Image
                    source={require("../../assets/logo-1.jpeg")}
                    className="w-full h-full"
                    resizeMode="contain"
                />
            </View>
        </View>
    )
}

export default WelcomeScreen