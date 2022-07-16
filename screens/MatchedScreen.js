import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity, Image} from 'react-native'
import tw from "tailwind-rn";

const MatchedScreen = () => {
    const navigation = useNavigation();
    const {params} = useRoute();

    const { loggedInProfile, userSwiped } = params;



    return (
        <View style ={tw('h-full bg-green-500 pt-20', { opacity: 1.2 })}>
            <View style={tw("justify-center px-10 pt-20")}>
                <Image
                style={tw("h-20 w-full")}
                source = {{ uri: "https://links.papareact.com/mg9"}} />
            </View>

            <Text style={tw('text-white text-center mt-5')}>
                {userSwiped.fullName} is your successful tutee match!
            </Text>

            <View style={tw("flex-row justify-evenly mt-5")}>
                <Image
                 style={tw("h-32 w-32 rounded-full")}
                 source={{
                    uri: loggedInProfile.url,
                 }}
                 />
                 <Image
                 style={tw("h-32 w-32 rounded-full")}
                 source={{
                    uri: userSwiped.url,
                 }}
                 />
            </View>

            <TouchableOpacity
            style={tw("bg-white m-5 px-10 py-8 rounded-full mt-20")}
            onPress={() => {
                navigation.goBack();
                navigation.navigate("Chat");
            }}>
                <Text style={tw("text-center")}> Send a Message</Text>
            </TouchableOpacity>

        </View>
    )
}

export default MatchedScreen