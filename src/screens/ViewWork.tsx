import React, { useState, useMemo } from "react";
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    FlatList,
    ScrollView,
    Modal,
    TouchableOpacity,
} from "react-native";
import SubHeader from "./SubHeader";
import CustomDatePicker from "./CustomDatePicker";
import { apiCall } from "./salaryApi";

interface WorkItem {
    id: number;
    work_date: string;
    awak: number;
    jawak: number;
    dockawak: number;
    dockjawak: number;
    jawakwarning: number;
    dockjawakwarning: number;
    checkbox: number;
    panni: number;
    potti5: number;
    potti10: number;
    solapur: number;
    other: number;
}

const PRIMARY_BLUE = "#2196F3";
const LIGHT_BLUE = "#E3F2FD";

const ViewWork = () => {
    const [data, setData] = useState<WorkItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);
    const [selectedType, setSelectedType] = useState<"all" | "single" | "range" | null>(null);
    const [singleDate, setSingleDate] = useState<Date>();
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const fetchData = async () => {
        if (!selectedType) return;

        setLoading(true);

        try {
            let url = "";

            if (selectedType === "all") {
                url = "/all-work";
            }
            else if (selectedType === "single" && singleDate) {
                url = `/get-work/${formatDate(singleDate)}`;
            }
            else if (selectedType === "range" && startDate && endDate) {
                url = `/work-range`;
            }

            const response = await apiCall.get(url, {
                params:
                    selectedType === "range"
                        ? {
                            startDate: formatDate(startDate as Date),
                            endDate: formatDate(endDate as Date),
                        }
                        : undefined,
            });

            const result = response.data;

            if (result.success) {
                setData(result.data);
                setModalVisible(false);
            }

        } catch (error: any) {
            console.log("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Totals for the footer
    const totals = useMemo(() => {
        return data.reduce((acc, item) => ({
            awak: acc.awak + (Number(item.awak) || 0),
            jawak: acc.jawak + (Number(item.jawak) || 0),
            dockawak: acc.dockawak + (Number(item.dockawak) || 0),
            dockjawak: acc.dockjawak + (Number(item.dockjawak) || 0),
            jawakwarning: acc.jawakwarning + (Number(item.jawakwarning) || 0),
            dockjawakwarning: acc.dockjawakwarning + (Number(item.dockjawakwarning) || 0),
            checkbox: acc.checkbox + (Number(item.checkbox) || 0),
            panni: acc.panni + (Number(item.panni) || 0),
            potti5: acc.potti5 + (Number(item.potti5) || 0),
            potti10: acc.potti10 + (Number(item.potti10) || 0),
            solapur: acc.solapur + (Number(item.solapur) || 0),
            other: acc.other + (Number(item.other) || 0),
        }), {
            awak: 0, jawak: 0, dockawak: 0, dockjawak: 0, jawakwarning: 0,
            dockjawakwarning: 0, checkbox: 0, panni: 0, potti5: 0, potti10: 0,
            solapur: 0, other: 0
        });
    }, [data]);

    const renderRow = ({ item, index }: { item: WorkItem; index: number }) => (
        <View style={[styles.row, { backgroundColor: index % 2 === 0 ? "#fff" : "#F8F9FA" }]}>
            <Text style={[styles.cell, styles.dateCell]}>{item.work_date.split("T")[0]}</Text>
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

    return (
        <View style={styles.container}>
            <SubHeader title="Work Report" />

            {!modalVisible && (
                <TouchableOpacity style={styles.changeFilterBtn} onPress={() => setModalVisible(true)}>
                    <Text style={styles.changeFilterText}>CHANGE FILTER</Text>
                </TouchableOpacity>
            )}

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filter Work Data</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={{ color: '#999', fontSize: 22 }}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.filterOptions}>
                            {['all', 'single', 'range'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.optionBtn, selectedType === type && styles.selectedOption]}
                                    onPress={() => setSelectedType(type as any)}
                                >
                                    <Text style={[styles.optionText, selectedType === type && { color: PRIMARY_BLUE }]}>
                                        {type === 'all' ? 'All Data' : type === 'single' ? 'Specific Date' : 'Date Range'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {selectedType === "single" && (
                            <CustomDatePicker label="Select Date" value={singleDate} onChange={setSingleDate} />
                        )}

                        {selectedType === "range" && (
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <CustomDatePicker label="From" value={startDate} onChange={setStartDate} horizontal />
                                <CustomDatePicker label="To" value={endDate} onChange={setEndDate} horizontal minimumDate={startDate} />
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.fetchBtn, !selectedType && { backgroundColor: '#ccc' }]}
                            disabled={!selectedType}
                            onPress={fetchData}
                        >
                            <Text style={styles.fetchBtnText}>SHOW REPORT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color={PRIMARY_BLUE} /></View>
            ) : data.length === 0 && !modalVisible ? (
                <View style={styles.center}><Text style={styles.noDataText}>No data found for this selection.</Text></View>
            ) : !modalVisible && (
                <View style={styles.tableWrapper}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View>
                            {/* Table Header */}
                            <View style={[styles.row, styles.headerRow]}>
                                <Text style={[styles.headerCell, styles.dateCell]}>Date</Text>
                                <Text style={styles.headerCell}>Awak</Text>
                                <Text style={styles.headerCell}>Jawak</Text>
                                <Text style={styles.headerCell}>D-Awak</Text>
                                <Text style={styles.headerCell}>D-Jawak</Text>
                                <Text style={styles.headerCell}>J-Warn</Text>
                                <Text style={styles.headerCell}>D-Warn</Text>
                                <Text style={styles.headerCell}>Box</Text>
                                <Text style={styles.headerCell}>Panni</Text>
                                <Text style={styles.headerCell}>P5</Text>
                                <Text style={styles.headerCell}>P10</Text>
                                <Text style={styles.headerCell}>Solapur</Text>
                                <Text style={styles.headerCell}>Other</Text>
                            </View>

                            <FlatList
                                data={data}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderRow}
                                contentContainerStyle={{ paddingBottom: 5 }}
                            />

                            <View style={[styles.row, styles.footerRow]}>
                                <Text style={[styles.cell, styles.dateCell, styles.totalLabel]}>TOTAL</Text>
                                <Text style={styles.totalCell}>{totals.awak}</Text>
                                <Text style={styles.totalCell}>{totals.jawak}</Text>
                                <Text style={styles.totalCell}>{totals.dockawak}</Text>
                                <Text style={styles.totalCell}>{totals.dockjawak}</Text>
                                <Text style={styles.totalCell}>{totals.jawakwarning}</Text>
                                <Text style={styles.totalCell}>{totals.dockjawakwarning}</Text>
                                <Text style={styles.totalCell}>{totals.checkbox}</Text>
                                <Text style={styles.totalCell}>{totals.panni}</Text>
                                <Text style={styles.totalCell}>{totals.potti5}</Text>
                                <Text style={styles.totalCell}>{totals.potti10}</Text>
                                <Text style={styles.totalCell}>{totals.solapur}</Text>
                                <Text style={styles.totalCell}>{totals.other}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default ViewWork;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    tableWrapper: {
        flex: 1,
        marginTop: 5,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee'
    },
    row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#eee" },
    headerRow: { backgroundColor: PRIMARY_BLUE },
    footerRow: {
        backgroundColor: LIGHT_BLUE,
        borderTopWidth: 2,
        borderTopColor: PRIMARY_BLUE,
        marginBottom: 0
    },
    cell: {
        width: 80,
        paddingVertical: 14,
        fontSize: 12,
        textAlign: "center",
        color: "#444"
    },
    dateCell: { width: 100 },
    headerCell: {
        width: 80,
        paddingVertical: 14,
        fontWeight: "bold",
        textAlign: "center",
        color: "#fff",
        fontSize: 12
    },
    totalCell: {
        width: 80,
        paddingVertical: 14,
        fontSize: 13,
        textAlign: "center",
        color: PRIMARY_BLUE,
        fontWeight: 'bold'
    },
    totalLabel: {
        fontWeight: 'bold',
        color: PRIMARY_BLUE,
        textAlign: 'center'
    },
    changeFilterBtn: {
        backgroundColor: PRIMARY_BLUE,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 10,
        elevation: 2
    },
    changeFilterText: { color: "#fff", fontWeight: "bold", letterSpacing: 1 },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalBox: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
        elevation: 10
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
    filterOptions: { marginBottom: 15 },
    optionBtn: {
        padding: 14,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center"
    },
    selectedOption: { backgroundColor: LIGHT_BLUE, borderColor: PRIMARY_BLUE },
    optionText: { color: "#666", fontWeight: "600" },
    fetchBtn: {
        backgroundColor: PRIMARY_BLUE,
        padding: 16,
        alignItems: "center",
        borderRadius: 12,
        marginTop: 10
    },
    fetchBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    noDataText: { color: "#999", fontSize: 14 },
});