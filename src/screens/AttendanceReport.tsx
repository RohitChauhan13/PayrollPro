import React from "react";
import { StyleSheet, View } from "react-native";
import SubHeader from "./SubHeader";

const AttendanceReport = () => {
    return(
        <View style={styles.container}>
            <SubHeader title="Attendance Report"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff'
    }
})

export default AttendanceReport;