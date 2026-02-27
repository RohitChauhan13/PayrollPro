import React, { FC } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { emptyUser } from "../../assets/images";

interface HeaderProps {
    userName: string;
}

const Headers: FC<HeaderProps> = ({ userName }) => {
    return (
        <View style={styles.container}>
            <View style={styles.profileAndNameContainer}>
                <Image source={emptyUser} style={styles.profileImage} />
                <View>
                    <Text>{'WELCOME,'}</Text>
                    <Text>
                        {userName ? userName.toUpperCase() : 'USER'}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    profileImage: {
        height: 50,
        width: 50,
    },
    profileAndNameContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    }
})

export default Headers;