import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
} from "react-native";
import SubHeader from "./SubHeader";
import CustomDatePicker from "./CustomDatePicker";
import { apiCall } from "./salaryApi";

const PRIMARY_BLUE = "#1E88E5";

const AddCommission = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    const generateCommission = async () => {
        if (!selectedDate) {
            Alert.alert("Validation", "Please select commission date");
            return;
        }

        try {
            setLoading(true);
            setData(null);

            const formattedDate = selectedDate.toISOString().split("T")[0];

            const response = await apiCall.post(
                `/add-commission`,
                {
                    commission_date: formattedDate,
                }
            );

            setData(response.data.data);
        } catch (error: any) {
            Alert.alert(
                "Error",
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <SubHeader title="Add Commission" />

            <View style={{ marginBottom: 15 }} />

            <ScrollView>
                <CustomDatePicker
                    label="Commission Date"
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    maximumDate={new Date()}
                />

                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={generateCommission}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Generate Commission</Text>
                    )}
                </TouchableOpacity>

                {data && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Commission Summary</Text>

                        <View style={styles.row}>
                            <Text style={styles.label}>Total Salary</Text>
                            <Text style={styles.value}>₹ {data.totalSalary}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Payable Salary</Text>
                            <Text style={styles.value}>₹ {data.payableSalary}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <Text style={styles.commissionLabel}>Commission</Text>
                            <Text style={styles.commissionValue}>
                                ₹ {data.commissionAmount}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default AddCommission;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10
    },

    button: {
        backgroundColor: PRIMARY_BLUE,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
        elevation: 3,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 18,
        marginTop: 30,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#E3F2FD",
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
        color: PRIMARY_BLUE,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 6,
    },

    label: {
        fontSize: 15,
        color: "#555",
    },

    value: {
        fontSize: 15,
        fontWeight: "500",
    },

    commissionLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: PRIMARY_BLUE,
    },

    commissionValue: {
        fontSize: 18,
        fontWeight: "700",
        color: PRIMARY_BLUE,
    },

    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 10,
    },
});