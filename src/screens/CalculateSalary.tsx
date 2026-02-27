import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import SubHeader from "./SubHeader";
import CustomDatePicker from "./CustomDatePicker";
import Loader from "./Loader";
import { apiCall } from "./salaryApi";

const CalculateSalary = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState<any>(null);

    const formatDate = (inputDate: any) => {
        const d = new Date(inputDate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleCalculate = async () => {
        if (!date) {
            Alert.alert("Error", "Please enter date");
            return;
        }

        try {
            setLoading(true);
            setResponseData(null);

            const formattedDate = formatDate(date);

            const res = await apiCall.post(
                `/salary-calculate`,
                { date: formattedDate }
            );

            if (!res.data.status) {
                Alert.alert("Success", res.data.message);
                return;
            }

            setResponseData(res.data);

        } catch (error: any) {
            if (error.response?.data?.message) {
                Alert.alert("Error", error.response.data.message);
            } else {
                Alert.alert("Error", "Server error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <SubHeader title="Calculate Salary" />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <CustomDatePicker
                        label="Enter Date"
                        value={date}
                        onChange={(prev) => setDate(prev)}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleCalculate}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>Calculate Salary</Text>
                    </TouchableOpacity>
                </View>

                {/* Result Section */}
                {responseData && (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultTitle}>Salary Summary</Text>

                        <View style={styles.row}>
                            <Text style={styles.key}>Total Salary</Text>
                            <Text style={styles.value}>
                                ₹ {responseData.total_salary}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.key}>Per Employee Salary</Text>
                            <Text style={styles.value}>
                                ₹ {responseData.per_employee_salary}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.key}>Present Employees</Text>
                            <Text style={styles.value}>
                                {responseData.present_count}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            <Loader visible={loading} />

        </View>
    );
};

export default CalculateSalary;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f1f5f9",
        padding: 15,
    },
    card: {
        backgroundColor: "#ffffff",
        padding: 18,
        borderRadius: 12,
        elevation: 4,
        marginBottom: 20,
        marginTop: 20
    },
    button: {
        backgroundColor: "#2563eb",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "600",
        fontSize: 16,
    },
    resultCard: {
        backgroundColor: "#ffffff",
        padding: 18,
        borderRadius: 12,
        elevation: 3,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
        color: "#0f172a",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    key: {
        fontSize: 14,
        color: "#64748b",
    },
    value: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
});