import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Image} from "react-native"
import { FlatList } from "react-native";
import tw from "tailwind-rn";
import { auth, db } from "../screens/firebase";
import ChatRow from "../components/ChatRow";



const ChatList = () => {
    const [matches, setMatches] = useState([]);
    const user = auth.currentUser;
    const userUID = user.uid;

    useEffect(
        () => 
        onSnapshot(
            query(
                collection(db, 'matches'),
                where('usersMatched', 'array-contains', user.uid)
                ),
                (snapshot) => 
                setMatches(
                    snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
        )
        ),
        [user]
        );

    return matches.length > 0 ? (
        <FlatList
        style={tw('h-full')}
        data={matches}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ChatRow matchDetails={item} />}
        />
    ) : (
        <View style={tw("p-5")}>
            <Text style={tw("text-center text-lg")}>No matches at the moment 😔</Text>
        </View>
    )
}

export default ChatList;