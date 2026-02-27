import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SubHeader from "./SubHeader";
import { CalculateSalary, salaryReport } from "../../assets/images/index";
import Feather from "@react-native-vector-icons/feather";

const Salary = ({ navigation }: any) => {
    return (
        <View style={styles.container}>

            <SubHeader title="Salary" />

            <View style={{ marginTop: 25 }}>

                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('CalculateSalary')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={CalculateSalary} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 18 }}>CALCULATE SALARY</Text>
                    </View>
                    <Feather name="arrow-right" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, { marginTop: 15 }]} activeOpacity={0.7} onPress={() => navigation.navigate('SalaryReport')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={salaryReport} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 18 }}>SALARY REPORT</Text>
                    </View>
                    <Feather name="arrow-right" size={20} />
                </TouchableOpacity>

            </View>

        </View>
    );
};

export default Salary;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15,
    },
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
        paddingHorizontal: 10,
        borderRadius: 8,
        borderColor: '#ccc'
    },
});