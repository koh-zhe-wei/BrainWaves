import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Image} from "react-native"
import { auth } from "../screens/firebase";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import tw from "tailwind-rn";
import { StyleSheet } from "react-native";
import { db } from "../screens/firebase";
import { doc } from "firebase/firestore";


const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation();
    const user = auth.currentUser;
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);

    console.log('MatchDeets:', matchDetails)

    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
    }, [matchDetails, user])

    return (
        <TouchableOpacity 
        style={[
            tw("flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg"),
        styles.cardShadow,
        ]}>
            <Image
            style={tw('rounded-full h-16 w-16 mr-4')}
            source={{uri: matchedUserInfo?.url}} 
            />

            <View>
                <Text style={tw("text-lg font-semibold")}>
                    {matchedUserInfo?.fullName}
                </Text>
                <Text>"Say Hi!"</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatRow;

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    avatar: {
        
        width: 80,
        height: 80,
        borderRadius: 50, 
        
       },
       
});