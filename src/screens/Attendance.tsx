import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SubHeader from "./SubHeader";
import Feather from "@react-native-vector-icons/feather";
import { addAttendance, attendanceReport, updateAttendance, viewAttendance } from "../../assets/images";

const Attedance = ({ navigation }: any) => {

    return (
        <View style={{ padding: 10, flex: 1, backgroundColor: '#fff' }}>
            <SubHeader title="Attendance" />

            <View style={{ marginTop: 25 }}>
                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('AddAttendance')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={addAttendance} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 18 }}>ADD ATTENDANCE</Text>
                    </View>
                    <Feather name="arrow-right" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, {marginTop: 15}]} activeOpacity={0.7} onPress={() => navigation.navigate('UpdateAttendance')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={updateAttendance} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 18 }}>UPDATE ATTENDANCE</Text>
                    </View>
                    <Feather name="arrow-right" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, {marginTop: 15}]} activeOpacity={0.7} onPress={() => navigation.navigate('ViewAttendance')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={viewAttendance} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 18 }}>VIEW ATTENDANCE</Text>
                    </View>
                    <Feather name="arrow-right" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, {marginTop: 15}]} activeOpacity={0.7} onPress={() => navigation.navigate('AttendanceReport')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={attendanceReport} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 18 }}>ATTENDANCE REPORT</Text>
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

export default Attedance;