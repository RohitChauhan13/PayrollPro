import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    FlatList,
    Alert,
    ToastAndroid,
} from "react-native";
import CustomDatePicker from "./CustomDatePicker";
import SubHeader from "./SubHeader";
import { apiCall } from "./salaryApi";

const PRIMARY_BLUE = "#1565C0";
const LIGHT_BLUE = "#E3F2FD";

const TotalSalary = () => {
    const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
    const [toDate, setToDate] = useState<Date | undefined>(new Date());
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [rate, setRate] = useState<any>(null);
    const [grandTotal, setGrandTotal] = useState(0);
    const [activeTab, setActiveTab] = useState<"work" | "amount">("work");

    const formatAmount = (num: number) => {
        if (!num) return "0.00";

        return new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };

    const quantityTotals = useMemo(() => {
        const totals: any = {
            awak: 0,
            jawak: 0,
            dockawak: 0,
            dockjawak: 0,
            jawakwarning: 0,
            dockjawakwarning: 0,
            checkbox: 0,
            panni: 0,
            potti5: 0,
            potti10: 0,
            solapur: 0,
            other: 0,
        };

        rows.forEach((item) => {
            Object.keys(totals).forEach((key) => {
                totals[key] += Number(item[key] || 0);
            });
        });

        return totals;
    }, [rows]);

    const amountSummary = useMemo(() => {
        if (!rate || rows.length === 0) {
            return {
                totalAwakAmt: 0,
                totalJawakAmt: 0,
                tds: 0,
                online: 0,
                offline: 0,
            };
        }

        let totalAwakAmt = 0;
        let totalJawakAmt = 0;

        rows.forEach((item) => {
            totalAwakAmt += item.awak * rate.awak_rate;
            totalJawakAmt += item.jawak * rate.jawak_rate;
        });

        const onlineBeforeTDS = totalAwakAmt + totalJawakAmt;
        const tds = onlineBeforeTDS * 0.01;
        const online = onlineBeforeTDS - tds;
        const offline = grandTotal - online - tds;

        return {
            totalAwakAmt,
            totalJawakAmt,
            tds,
            online,
            offline,
        };
    }, [rows, rate, grandTotal]);

    const fetchReport = async () => {
        if (!fromDate || !toDate) {
            Alert.alert("Validation", "Please select both dates");
            return;
        }

        try {
            setLoading(true);
            setRows([]);
            setGrandTotal(0);

            const startDate = fromDate.toISOString().split("T")[0];
            const endDate = toDate.toISOString().split("T")[0];

            const workRes = await apiCall.get(`/work-range`, {
                params: { startDate, endDate },
            });

            if (workRes.data.data.length === 0) {
                ToastAndroid.showWithGravity('NO DATA FOUNT IN RANGE', ToastAndroid.SHORT, ToastAndroid.BOTTOM)
                return;
            }

            const rateRes = await apiCall.get(
                `/get-latest-private-rate`
            );

            const latestRate = rateRes.data.data;
            setRate(latestRate);

            let total = 0;

            const updatedRows = workRes.data.data.map((item: any) => {
                const calc = (qty: number, r: number) => qty * r;

                const dayTotal =
                    calc(item.awak, latestRate.awak_rate) +
                    calc(item.jawak, latestRate.jawak_rate) +
                    calc(item.dockawak, latestRate.dockawak_rate) +
                    calc(item.dockjawak, latestRate.dockjawak_rate) +
                    calc(item.jawakwarning, latestRate.jawakwarning_rate) +
                    calc(item.dockjawakwarning, latestRate.dockjawakwarning_rate) +
                    calc(item.checkbox, latestRate.checkbox_rate) +
                    calc(item.panni, latestRate.panni_rate) +
                    calc(item.potti5, latestRate.potti5_rate) +
                    calc(item.potti10, latestRate.potti10_rate) +
                    calc(item.solapur, latestRate.solapur_rate) +
                    calc(item.other, item.other_rate || 0);

                total += dayTotal;

                return { ...item, dayTotal };
            });

            setRows(updatedRows);
            setGrandTotal(total);
        } catch (err: any) {
            Alert.alert(
                "Error",
                err?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const renderWorkRow = ({ item, index }: any) => (
        <View
            style={[
                styles.row,
                { backgroundColor: index % 2 === 0 ? "#fff" : LIGHT_BLUE },
            ]}
        >
            <Text style={styles.cell}>{item.work_date.toString().split("T")[0]}</Text>
            <Text style={styles.cell}>{item.awak}</Text>
            <Text style={styles.cell}>{item.jawak}</Text>
            <Text style={styles.cell}>{item.dockawak}</Text>
            <Text style={styles.cell}>{item.dockjawak}</Text>
            <Text style={styles.cell}>{item.jawakwarning}</Text>
            <Text style={styles.cell}>{item.dockjawakwarning}</Text>
            <Text style={styles.cell}>{item.checkbox}</Text>
            <Text style={styles.cell}>{item.panni}</Text>
            <Text style={styles.cell}>{item.potti5}</Text>
            <Text style={styles.cell}>{item.potti10}</Text>
            <Text style={styles.cell}>{item.solapur}</Text>
            <Text style={styles.cell}>{item.other}</Text>
        </View>
    );

    const renderTotalRow = () => (
        <View style={[styles.row, { backgroundColor: "#BBDEFB" }]}>
            <Text style={[styles.cell, styles.totalCell]}>TOTAL</Text>
            {Object.keys(quantityTotals).map((key, i) => (
                <Text key={i} style={[styles.cell, styles.totalCell]}>
                    {quantityTotals[key]}
                </Text>
            ))}
        </View>
    );

    const renderAmountRow = ({ item, index }: any) => {
        const calc = (qty: number, r: number) => formatAmount(qty * r);

        return (
            <View
                style={[
                    styles.row,
                    { backgroundColor: index % 2 === 0 ? "#fff" : LIGHT_BLUE },
                ]}
            >
                <Text style={styles.cell}>{item.work_date.toString().split("T")[0]}</Text>
                <Text style={styles.cell}>₹{calc(item.awak, rate.awak_rate)}</Text>
                <Text style={styles.cell}>₹{calc(item.jawak, rate.jawak_rate)}</Text>
                <Text style={styles.cell}>₹{calc(item.dockawak, rate.dockawak_rate)}</Text>
                <Text style={styles.cell}>₹{calc(item.dockjawak, rate.dockjawak_rate)}</Text>
                <Text style={styles.cell}>₹{calc(item.jawakwarning, rate.jawakwarning_rate)}</Text>
                <Text style={styles.cell}>₹{calc(item.dockjawakwarning, rate.dockjawakwarning_rate)}</Text>
                <Text style={styles.cell}>₹{calc(item.checkbox, rate.checkbox_rate)}</Text>
                <Text style={styles.cell}>₹{calc(item.panni, rate.panni_rate)}</Text>
                <Text style={styles.cell}>₹{calc(item.potti5, rate.potti5_rate)}</Text>
                <Text style={styles.cell}>₹{calc(item.potti10, rate.potti10_rate)}</Text>
                <Text style={styles.cell}>₹{calc(item.solapur, rate.solapur_rate)}</Text>
                <Text style={styles.cell}>₹{calc(item.other, item.other_rate || 0)}</Text>
                <Text style={[styles.cell, styles.totalCell]}>
                    ₹{formatAmount(item.dayTotal)}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={{ padding: 10 }}>
                <SubHeader title="Total Salary Report" />
            </View>

            <ScrollView contentContainerStyle={{ padding: 15 }}>
                {/* Date Filters */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <CustomDatePicker
                        label="From"
                        value={fromDate}
                        onChange={setFromDate}
                        maximumDate={new Date()}
                        horizontal
                    />
                    <CustomDatePicker
                        label="To"
                        value={toDate}
                        onChange={setToDate}
                        maximumDate={new Date()}
                        horizontal
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={fetchReport}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Generate Salary</Text>
                    )}
                </TouchableOpacity>

                {
                    grandTotal > 0 &&
                    <View style={styles.grandTotalCard}>
                        <Text style={styles.GrandTotalHeadText}>Grand Total</Text>
                        <Text style={styles.GrandAmt}>₹{formatAmount(grandTotal)}</Text>
                    </View>
                }

                {rows.length > 0 && (
                    <>
                        {/* Tabs */}
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === "work" && styles.activeTab,
                                ]}
                                onPress={() => setActiveTab("work")}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "work" && styles.activeTabText,
                                    ]}
                                >
                                    Work Quantity
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === "amount" && styles.activeTab,
                                ]}
                                onPress={() => setActiveTab("amount")}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "amount" && styles.activeTabText,
                                    ]}
                                >
                                    Amount Calculation
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* WORK TAB */}
                        {activeTab === "work" && (
                            <ScrollView horizontal>
                                <View>
                                    <View style={[styles.row, styles.headerRow]}>
                                        {[
                                            "Date", "Awak", "Jawak", "DockAwak", "DockJawak",
                                            "JWarn", "DJWarn", "Checkbox", "Panni",
                                            "Potti5", "Potti10", "Solapur", "Other"
                                        ].map((h, i) => (
                                            <Text key={i} style={styles.headerCell}>{h}</Text>
                                        ))}
                                    </View>

                                    <FlatList
                                        data={rows}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={renderWorkRow}
                                    />

                                    {renderTotalRow()}
                                </View>
                            </ScrollView>
                        )}

                        {/* AMOUNT TAB */}
                        {activeTab === "amount" && rate && (
                            <ScrollView horizontal>
                                <View>
                                    <View style={[styles.row, styles.headerRow]}>
                                        {[
                                            "Date", "AwakAmt", "JawakAmt", "DockAwakAmt",
                                            "DockJawakAmt", "JWarnAmt", "DJWarnAmt",
                                            "CheckboxAmt", "PanniAmt", "Potti5Amt",
                                            "Potti10Amt", "SolapurAmt", "OtherAmt", "Day Total"
                                        ].map((h, i) => (
                                            <Text key={i} style={styles.headerCell}>{h}</Text>
                                        ))}
                                    </View>

                                    <FlatList
                                        data={rows}
                                        keyExtractor={(item) => item.id.toString() + "amt"}
                                        renderItem={renderAmountRow}
                                    />
                                </View>
                            </ScrollView>
                        )}

                        {activeTab === "amount" && rows.length > 0 && (
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryTitle}>Payment Summary</Text>

                                <View style={styles.inLine}>
                                    <Text style={styles.summaryText}>Total Amount (A + J)</Text>
                                    <Text style={styles.summaryText}>₹{formatAmount(amountSummary.totalAwakAmt + amountSummary.totalJawakAmt)}</Text>
                                </View>
                                <View style={styles.inLine}>
                                    <Text style={styles.summaryText}>TDS</Text>
                                    <Text style={styles.summaryText}>₹{formatAmount(amountSummary.tds)}</Text>
                                </View>
                                <View style={[styles.inLine, {marginTop: 10}]}>
                                    <Text style={styles.summaryText}>Online (After 1% TDS)</Text>
                                    <Text style={styles.summaryText}>₹{formatAmount(amountSummary.online)}</Text>
                                </View>
                                <View style={styles.inLine}>
                                    <Text style={styles.summaryText}>Cash</Text>
                                    <Text style={styles.summaryText}>₹{formatAmount(amountSummary.offline)}</Text>
                                </View>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default TotalSalary;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    button: {
        backgroundColor: PRIMARY_BLUE,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },

    buttonText: { color: "#fff", fontWeight: "600" },

    row: { flexDirection: "row" },

    headerRow: { backgroundColor: PRIMARY_BLUE },

    headerCell: {
        width: 110,
        padding: 10,
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
    },

    cell: {
        width: 110,
        padding: 10,
        fontSize: 12,
        borderBottomWidth: 1,
        borderColor: "#E3F2FD",
    },

    totalCell: {
        fontWeight: "700",
        color: PRIMARY_BLUE,
    },

    tabContainer: {
        flexDirection: "row",
        marginTop: 20,
        backgroundColor: LIGHT_BLUE,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 15
    },

    tab: {
        flex: 1,
        padding: 12,
        alignItems: "center",
    },

    activeTab: {
        backgroundColor: PRIMARY_BLUE,
    },

    tabText: {
        color: PRIMARY_BLUE,
        fontWeight: "600",
    },

    activeTabText: {
        color: "#fff",
    },

    grandTotalCard: {
        backgroundColor: LIGHT_BLUE,
        padding: 10,
        marginTop: 15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },

    GrandTotalHeadText: {
        color: PRIMARY_BLUE,
        fontSize: 20,
        fontWeight: '500'
    },

    GrandAmt: {
        fontSize: 25,
        color: PRIMARY_BLUE,
        fontWeight: 'bold'
    },

    summaryCard: {
        backgroundColor: LIGHT_BLUE,
        padding: 15,
        borderRadius: 12,
        marginTop: 20,
    },

    summaryTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: PRIMARY_BLUE,
        marginBottom: 10,
    },

    summaryText: {
        fontSize: 16,
        fontWeight: '700',
        // color: PRIMARY_BLUE
        color: '#4979b0'
    },

    inLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});