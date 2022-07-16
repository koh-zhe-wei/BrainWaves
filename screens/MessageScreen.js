import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Image} from "react-native"
import Header from "../components/Header";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import { auth } from "./firebase";



const MessageScreen = ({matchDetails}) => {
    const user = auth.currentUser;

    return (
        <SafeAreaView>
            <Header title={getMatchedUserInfo(matchDetails?.users, user.uid).fullName}
            callEnabled />
            <Text>Message screen</Text>
        </SafeAreaView>
    )
}

export default MessageScreen;