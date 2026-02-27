import Feather from "@react-native-vector-icons/feather";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface SubHeaderProps {
    title: string;
}

const SubHeader: React.FC<SubHeaderProps> = ({ title }) => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.7} hitSlop={10} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={25} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    }
})

export default SubHeader;