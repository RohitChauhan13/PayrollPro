import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import SubHeader from "./SubHeader";
import Feather from "@react-native-vector-icons/feather";
import { addCommission, totalSalary, viewCommission } from "../../assets/images";

const Commission = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <SubHeader title="Commission" />

            <View style={{ marginTop: 25 }}>
                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('AddCommission')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={addCommission} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 18 }}>ADD / UPDATE WORK</Text>
                    </View>
                    <Feather name="arrow-right" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, { marginTop: 15 }]} activeOpacity={0.7} onPress={() => navigation.navigate('ViewCommission')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={viewCommission} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 18 }}>WORK REPORT</Text>
                    </View>
                    <Feather name="arrow-right" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, { marginTop: 15 }]} activeOpacity={0.7} onPress={() => navigation.navigate('TotalSalary')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={totalSalary} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 18 }}>TOTAL SALARY</Text>
                    </View>
                    <Feather name="arrow-right" size={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Commission;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10
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