import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Alert,
    ScrollView,
} from "react-native";
import SubHeader from "./SubHeader";
import CustomDatePicker from "./CustomDatePicker";
import { apiCall } from "./salaryApi";

const PRIMARY_BLUE = "#1E88E5";

const ViewCommission = () => {
    const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
    const [toDate, setToDate] = useState<Date | undefined>(new Date());
    const [loading, setLoading] = useState(false);
    const [commissions, setCommissions] = useState<any[]>([]);
    const [total, setTotal] = useState(0);

    const fetchCommissions = async () => {
        if (!fromDate || !toDate) {
            Alert.alert("Validation", "Please select both dates");
            return;
        }

        if (fromDate > toDate) {
            Alert.alert("Validation", "From date cannot be after To date");
            return;
        }

        try {
            setLoading(true);
            setCommissions([]);
            setTotal(0);

            const from = fromDate.toISOString().split("T")[0];
            const to = toDate.toISOString().split("T")[0];

            const response = await apiCall.get(
                `/get-commission-in-range`,
                {
                    params: { from, to },
                }
            );

            setCommissions(response.data.data);
            setTotal(response.data.totalCommission);
        } catch (error: any) {
            Alert.alert(
                "Error",
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }: any) => (
        <View
            style={[
                styles.tableRow,
                { backgroundColor: index % 2 === 0 ? "#F9F9F9" : "#FFFFFF" },
            ]}
        >
            <Text style={[styles.cell, { flex: 0.5 }]}>
                {index + 1}
            </Text>
            <Text style={[styles.cell, { flex: 1.5 }]}>
                {item.commission_date.toString().split("T")[0]}
            </Text>
            <Text style={[styles.cell, { flex: 1, textAlign: "right" }]}>
                ₹ {Number(item.commission_amount).toFixed(2)}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ padding: 10 }}>
                <SubHeader title="Commission Report" />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Date Filters */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <CustomDatePicker
                        label="From"
                        value={fromDate}
                        onChange={(d) => setFromDate(d)}
                        maximumDate={new Date()}
                        horizontal
                    />
                    <CustomDatePicker
                        label="To"
                        value={toDate}
                        onChange={(d) => setToDate(d)}
                        maximumDate={new Date()}
                        horizontal
                    />
                </View>

                {/* Fetch Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={fetchCommissions}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Fetch Report</Text>
                    )}
                </TouchableOpacity>

                {/* 🔥 Total Summary Card (UPAR) */}
                {commissions.length > 0 && (
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>
                            Total Commission
                        </Text>
                        <Text style={styles.summaryAmount}>
                            ₹ {Number(total).toFixed(2)}
                        </Text>
                    </View>
                )}

                {/* 📊 Table */}
                {commissions.length > 0 && (
                    <View style={styles.tableContainer}>
                        {/* Header Row */}
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={[styles.headerCell, { flex: 0.5 }]}>
                                #
                            </Text>
                            <Text style={[styles.headerCell, { flex: 1.5 }]}>
                                Date
                            </Text>
                            <Text
                                style={[
                                    styles.headerCell,
                                    { flex: 1, textAlign: "right" },
                                ]}
                            >
                                Amount
                            </Text>
                        </View>

                        <FlatList
                            data={commissions}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            scrollEnabled={false}
                        />
                    </View>
                )}

                {!loading && commissions.length === 0 && (
                    <Text style={styles.emptyText}>
                        No commission found for selected range
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};

export default ViewCommission;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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

    /* 🔥 Summary Card */
    summaryCard: {
        backgroundColor: "#E3F2FD",
        padding: 18,
        borderRadius: 12,
        marginTop: 25,
        alignItems: "center",
    },

    summaryTitle: {
        fontSize: 16,
        color: PRIMARY_BLUE,
        fontWeight: "600",
    },

    summaryAmount: {
        fontSize: 22,
        fontWeight: "700",
        marginTop: 6,
        color: PRIMARY_BLUE,
    },

    /* 📊 Table */
    tableContainer: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#E3F2FD",
        borderRadius: 10,
        overflow: "hidden",
    },

    tableHeader: {
        backgroundColor: PRIMARY_BLUE,
    },

    tableRow: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#E3F2FD",
    },

    headerCell: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },

    cell: {
        fontSize: 14,
        color: "#333",
    },

    emptyText: {
        textAlign: "center",
        marginTop: 30,
        color: "#888",
    },
});