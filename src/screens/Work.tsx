import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SubHeader from "./SubHeader";
import { addWork, viewWork } from "../../assets/images";
import Feather from "@react-native-vector-icons/feather";

const Work = ({ navigation }: any) => {

    return (
        <View style={{ padding: 10, flex: 1, backgroundColor: '#fff' }}>
            <SubHeader title="Work" />

            <View style={{ marginTop: 25 }}>
                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('AddWork')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={addWork} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 18 }}>ADD / UPDATE WORK</Text>
                    </View>
                    <Feather name="arrow-right" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, {marginTop: 15}]} activeOpacity={0.7} onPress={() => navigation.navigate('ViewWork')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={viewWork} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 18 }}>WORK REPORT</Text>
                    </View>
                    <Feather name="arrow-right" size={20} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    card: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal:10,
        borderRadius: 8,
        borderColor: '#ccc'
    },
})

export default Work;