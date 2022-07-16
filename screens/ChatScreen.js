import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Image} from "react-native"
import Header from "../components/Header";
import ChatList from "../components/ChatList";
import { onSnapshot } from "firebase/firestore";


const ChatScreen = () => {
    
    return (
        <SafeAreaView>
            <Header title="Chat"/>
            <ChatList />
        </SafeAreaView>
    )
}

export default ChatScreen;