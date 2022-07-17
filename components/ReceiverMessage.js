import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Image} from "react-native"
import Header from "../components/Header";
import ChatList from "../components/ChatList";
import { onSnapshot } from "firebase/firestore";
import tw from "tailwind-rn";


const ReceiverMessage = ({ message }) => {
    
    return (
        <View
        style={[
            tw("bg-red-400 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14"),
            {alignSelf: "flex-start", marginLeft: "auto"},
        ]}>
            <Image
            style={tw("h-12 w-12 rounded-full absolute top-0 -left-14")}
            source={{
                uri: message.url,
            }}
            />
            <Text style={tw("text-white")}>{message.message}</Text>
        </View>
    )
}

export default ReceiverMessage;