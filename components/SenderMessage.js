import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Image} from "react-native"
import Header from "../components/Header";
import ChatList from "../components/ChatList";
import { onSnapshot } from "firebase/firestore";
import tw from "tailwind-rn";


const SenderMessage = ({ message }) => {
    
    return (
        <View
        style={[
            tw("bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2"),
            {alignSelf: "flex-start", marginLeft: "auto"},
        ]}>
            <Text style={tw("text-white")}>{message.message}</Text>
        </View>
    )
}

export default SenderMessage;