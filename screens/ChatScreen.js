import React from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Image} from "react-native"
import Header from "../components/Header";
import ChatList from "../components/ChatList";


const ChatScreen = () => {
    return (
        <SafeAreaView>
            <Header title="Chat"/>
            <ChatList />
        </SafeAreaView>
    )
}

export default ChatScreen;