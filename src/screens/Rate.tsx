import React, { useState } from "react";
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import SubHeader from "./SubHeader";
import CustomInput from "./CustomeInput";
import { RadioButton } from "react-native-paper";
import Loader from "./Loader";
import { apiCall } from "./salaryApi";

const Rate = () => {
    const [awakRate, setAwakRate] = useState("");
    const [jawakRate, setJawakRate] = useState("");
    const [dockAwakRate, setDockAwakRate] = useState("");
    const [dockJawakRate, setDockJawakRate] = useState("");
    const [jawakVarningRate, setJawakVarningRate] = useState("");
    const [dockJawakVarningRate, setDockJawakVarningRate] = useState("");
    const [checkBoxRate, setCheckBoxRate] = useState("");
    const [panniRate, setPanniRate] = useState("");
    const [potti5Rate, setPotti5Rate] = useState("");
    const [potti10Rate, setPotti10Rate] = useState("");
    const [solapurRate, setSolapurRate] = useState("");
    const [value, setValue] = useState("public");
    const [loading, setLoading] = useState(false);

    const resetFields = () => {
        setAwakRate("");
        setJawakRate("");
        setDockAwakRate("");
        setDockJawakRate("");
        setJawakVarningRate("");
        setDockJawakVarningRate("");
        setCheckBoxRate("");
        setPanniRate("");
        setPotti5Rate("");
        setPotti10Rate("");
        setSolapurRate("");
    }

    const fetchPublicRates = async () => {
        try {
            setLoading(true);

            const response = await apiCall.get(
                `/get-latest-public-rate`
            );

            const rate = response.data.data;

            setAwakRate(rate?.awak_rate);
            setJawakRate(rate?.jawak_rate);
            setDockAwakRate(rate?.dockawak_rate);
            setDockJawakRate(rate?.dockjawak_rate);
            setJawakVarningRate(rate?.jawakwarning_rate);
            setDockJawakVarningRate(rate?.dockjawakwarning_rate);
            setCheckBoxRate(rate?.checkbox_rate);
            setPanniRate(rate?.panni_rate);
            setPotti5Rate(rate?.potti5_rate);
            setPotti10Rate(rate?.potti10_rate);
            setSolapurRate(rate?.solapur_rate);
            setValue('public');

        } catch (error: any) {
            if (error.response) {
                ToastAndroid.show(
                    error.response.data.message || "Something went wrong",
                    ToastAndroid.LONG
                );
            } else {
                ToastAndroid.show(
                    "Network Error",
                    ToastAndroid.LONG
                );
            }
            console.log('Error in getPublicRates: ', error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPrivateRates = async () => {
        try {
            setLoading(true);

            const response = await apiCall.get(
                `/get-latest-private-rate`
            );

            const rate = response.data.data;

            setAwakRate(rate?.awak_rate);
            setJawakRate(rate?.jawak_rate);
            setDockAwakRate(rate?.dockawak_rate);
            setDockJawakRate(rate?.dockjawak_rate);
            setJawakVarningRate(rate?.jawakwarning_rate);
            setDockJawakVarningRate(rate?.dockjawakwarning_rate);
            setCheckBoxRate(rate?.checkbox_rate);
            setPanniRate(rate?.panni_rate);
            setPotti5Rate(rate?.potti5_rate);
            setPotti10Rate(rate?.potti10_rate);
            setSolapurRate(rate?.solapur_rate);
            setValue('private');

        } catch (error: any) {
            if (error.response) {
                ToastAndroid.show(
                    error.response.data.message || "Something went wrong",
                    ToastAndroid.LONG
                );
                setValue('private');
                resetFields();
            } else {
                ToastAndroid.show(
                    "Network Error",
                    ToastAndroid.LONG
                );
                resetFields();
            }
            console.log('Error in getPrivateRates: ', error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    const validateData = () => {
        if (
            !awakRate ||
            !jawakRate ||
            !dockAwakRate ||
            !dockJawakRate ||
            !jawakVarningRate ||
            !dockJawakVarningRate ||
            !checkBoxRate ||
            !panniRate ||
            !potti5Rate ||
            !potti10Rate ||
            !solapurRate ||
            !value
        ) {
            ToastAndroid.showWithGravity("All fields are required", ToastAndroid.BOTTOM, ToastAndroid.SHORT);
            return false;
        }

        return true;
    };

    const addRates = async () => {
        try {
            const payload = {
                awak_rate: Number(awakRate) || 0.0,
                jawak_rate: Number(jawakRate) || 0.0,
                dockawak_rate: Number(dockAwakRate) || 0.0,
                dockjawak_rate: Number(dockJawakRate) || 0.0,
                jawakwarning_rate: Number(jawakVarningRate) || 0.0,
                dockjawakwarning_rate: Number(dockJawakVarningRate) || 0.0,
                checkbox_rate: Number(checkBoxRate) || 0.0,
                panni_rate: Number(panniRate) || 0.0,
                potti5_rate: Number(potti5Rate) || 0.0,
                potti10_rate: Number(potti10Rate) || 0.0,
                solapur_rate: Number(solapurRate) || 0.0,
                rate_type: value
            }

            const valid = validateData();

            if (!valid) {
                ToastAndroid.showWithGravity(
                    "All fields required",
                    ToastAndroid.BOTTOM,
                    ToastAndroid.SHORT
                );
                return;
            }

            setLoading(true);

            const result = await apiCall.post(
                `/add-rate`,
                payload
            );

            console.log(result);

        } catch (error: any) {
            if (error.response) {
                ToastAndroid.showWithGravity(error.response.data.message || 'Something went wrong',
                    ToastAndroid.BOTTOM, ToastAndroid.SHORT
                )
            } else {
                ToastAndroid.show(
                    "Network Error",
                    ToastAndroid.LONG
                );
            }
            console.log("Error in addRates: ", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>

            <SubHeader title="Rate" />

            <View style={{ marginTop: 25 }} />

            <View style={styles.inline}>
                <CustomInput
                    label="Awak Rate"
                    value={awakRate}
                    onChangeText={setAwakRate}
                    horizontal={true}
                />
                <CustomInput
                    label="Jawak Rate"
                    value={jawakRate}
                    onChangeText={setJawakRate}
                    horizontal={true}
                />
            </View>

            <View style={styles.inline}>
                <CustomInput
                    label="Dock Awak Rate"
                    value={dockAwakRate}
                    onChangeText={setDockAwakRate}
                    horizontal={true}
                />
                <CustomInput
                    label="Dock Jawak Rate"
                    value={dockJawakRate}
                    onChangeText={setDockJawakRate}
                    horizontal={true}
                />
            </View>

            <View style={styles.inline}>
                <CustomInput
                    label="Jawak Varning Rate"
                    value={jawakVarningRate}
                    onChangeText={setJawakVarningRate}
                    horizontal={true}
                />
                <CustomInput
                    label="Dock Jawak Varning"
                    value={dockJawakVarningRate}
                    onChangeText={setDockJawakVarningRate}
                    horizontal={true}
                />
            </View>

            <View style={styles.inline}>
                <CustomInput
                    label="Check Box Rate"
                    value={checkBoxRate}
                    onChangeText={setCheckBoxRate}
                    horizontal={true}
                />
                <CustomInput
                    label="Panni Rate"
                    value={panniRate}
                    onChangeText={setPanniRate}
                    horizontal={true}
                />
            </View>

            <View style={styles.inline}>
                <CustomInput
                    label="Potti (Rs.5) Rate"
                    value={potti5Rate}
                    onChangeText={setPotti5Rate}
                    horizontal={true}
                />
                <CustomInput
                    label="Potti (Rs.10) Rate"
                    value={potti10Rate}
                    onChangeText={setPotti10Rate}
                    horizontal={true}
                />
            </View>

            <View style={styles.inline}>
                <CustomInput
                    label="Solapur Varning Rate"
                    value={solapurRate}
                    onChangeText={setSolapurRate}
                    horizontal={true}
                />
            </View>

            <RadioButton.Group
                onValueChange={newValue => {
                    setValue(newValue);
                    resetFields();
                }}
                value={value}
            >
                <View style={{ flexDirection: 'row', gap: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value="public" color="blue" />
                        <Text>Employee Rate</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value="private" color="blue" />
                        <Text>Actual Rate</Text>
                    </View>
                </View>
            </RadioButton.Group>

            <TouchableOpacity activeOpacity={0.7} style={styles.btn} onPress={fetchPublicRates}>
                <Text style={{ fontSize: 18, color: '#fff' }}>Fetch Employee's Rate</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} style={styles.btn} onPress={fetchPrivateRates}>
                <Text style={{ fontSize: 18, color: '#fff' }}>Fetch Actual Rate</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} style={styles.btn} onPress={addRates}>
                <Text style={{ fontSize: 18, color: '#fff' }}>SAVE</Text>
            </TouchableOpacity>

            <Loader visible={loading} />

        </View>
    )
}

const styles = StyleSheet.create({
    inline: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    btn: {
        backgroundColor: 'blue',
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 5,
    }
})

export default Rate;