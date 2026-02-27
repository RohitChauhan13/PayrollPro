import React, { useEffect, useState, useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    Switch,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ToastAndroid,
    Platform
} from "react-native";
import SubHeader from "./SubHeader";
import Loader from "./Loader";
import CustomDatePicker from "./CustomDatePicker";
import { apiCall } from "./salaryApi";

interface Employee {
    id: number;
    name: string;
    status: number;
}

const AddAttendance = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendance, setAttendance] = useState<{ [key: number]: boolean }>({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date | null>(new Date());

    // Theme Colors
    const PRIMARY_BLUE = "#2196F3";
    const LIGHT_BLUE = "#E3F2FD";
    const DANGER_RED = "#F44336";

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await apiCall.get(`/employees`);
            const employeeArray = response.data.data;

            if (Array.isArray(employeeArray)) {
                const activeEmployees = employeeArray.filter((emp: Employee) => emp.status === 1);
                setEmployees(activeEmployees);

                const defaultAttendance: { [key: number]: boolean } = {};
                activeEmployees.forEach((emp: Employee) => {
                    defaultAttendance[emp.id] = true;
                });
                setAttendance(defaultAttendance);
            }
        } catch (error) {
            console.log("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveAttendance = async () => {
        try {
            if (!date) return;
            setLoading(true);

            const payload = {
                attendance_date: formatDate(date),
                attendance: employees.map(emp => ({
                    employee_id: emp.id,
                    status: attendance[emp.id] ? 1 : 0,
                    employee_name: emp.name
                }))
            };

            const response = await apiCall.post(
                `/add-attendance`,
                payload
            );

            if (response.data.success) {
                ToastAndroid.show('Attendance saved successfully', ToastAndroid.SHORT);
            }
        } catch (error: any) {
            ToastAndroid.show(error.response?.data?.message || 'Error saving attendance', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const totalPresent = useMemo(() => Object.values(attendance).filter(val => val === true).length, [attendance]);
    const totalAbsent = useMemo(() => Object.values(attendance).filter(val => val === false).length, [attendance]);

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()));
    }, [search, employees]);

    const toggleAttendance = (id: number) => {
        setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <View style={styles.container}>

            <View style={{padding: 10}}>
                <SubHeader title="Add Attendance" />
            </View>

            <View style={styles.headerControls}>
                <View style={styles.dateContainer}>
                    <CustomDatePicker
                        label="Date"
                        horizontal={true}
                        maximumDate={new Date()}
                        onChange={(date) => setDate(date)}
                        value={date || new Date()}
                    />
                </View>
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search name..."
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            {/* Bulk Action Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: PRIMARY_BLUE }]}
                    onPress={() => {
                        const updated = { ...attendance };
                        employees.forEach(e => updated[e.id] = true);
                        setAttendance(updated);
                    }}
                >
                    <Text style={styles.actionBtnText}>Mark All Present</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: LIGHT_BLUE, borderWidth: 1, borderColor: PRIMARY_BLUE }]}
                    onPress={() => {
                        const updated = { ...attendance };
                        employees.forEach(e => updated[e.id] = false);
                        setAttendance(updated);
                    }}
                >
                    <Text style={[styles.actionBtnText, { color: PRIMARY_BLUE }]}>Mark All Absent</Text>
                </TouchableOpacity>
            </View>

            {/* Employee List */}
            <FlatList
                data={filteredEmployees}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.employeeCard}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                        </View>
                        <View style={styles.employeeInfo}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.idText}>ID: {item.id}</Text>
                        </View>
                        <View style={styles.switchWrapper}>
                            <Text style={[styles.statusLabel, { color: attendance[item.id] ? PRIMARY_BLUE : DANGER_RED }]}>
                                {attendance[item.id] ? "Present" : "Absent"}
                            </Text>
                            <Switch
                                value={attendance[item.id] || false}
                                onValueChange={() => toggleAttendance(item.id)}
                                trackColor={{ false: "#ddd", true: LIGHT_BLUE }}
                                thumbColor={attendance[item.id] ? PRIMARY_BLUE : "#999"}
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No employees found</Text>}
            />

            {/* Summary Information */}
            <View style={styles.summaryRow}>
                <View style={[styles.summaryBox, { backgroundColor: PRIMARY_BLUE }]}>
                    <Text style={styles.summaryNum}>{totalPresent}</Text>
                    <Text style={styles.summaryTxt}>Present</Text>
                </View>
                <View style={[styles.summaryBox, { backgroundColor: "#f5f5f5", borderWidth: 1, borderColor: "#ddd" }]}>
                    <Text style={[styles.summaryNum, { color: "#333" }]}>{totalAbsent}</Text>
                    <Text style={[styles.summaryTxt, { color: "#666" }]}>Absent</Text>
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={saveAttendance} activeOpacity={0.8}>
                <Text style={styles.saveBtnText}>SAVE ATTENDANCE</Text>
            </TouchableOpacity>

            <Loader visible={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
    },
    headerControls: {
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    dateContainer: {
        flex: 1,
    },
    searchContainer: {
        flex: 1.4,
    },
    searchInput: {
        height: 50,
        backgroundColor: "#F8F9FA",
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        fontSize: 14,
        color: "#333",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 15,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    actionBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },
    employeeCard: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#2196F3",
        fontWeight: "bold",
        fontSize: 18,
    },
    employeeInfo: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },
    idText: {
        fontSize: 12,
        color: "#888",
    },
    switchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    statusLabel: {
        fontSize: 11,
        fontWeight: "bold",
        width: 45,
        textAlign: "right",
    },
    summaryRow: {
        flexDirection: "row",
        gap: 12,
        marginVertical: 15,
    },
    summaryBox: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        ...Platform.select({
            android: { elevation: 2 },
            ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }
        }),
    },
    summaryNum: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    summaryTxt: {
        fontSize: 12,
        fontWeight: "600",
        color: "#fff",
    },
    saveBtn: {
        backgroundColor: "#2196F3",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 15,
        elevation: 3,
    },
    saveBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 30,
        color: "#999",
    },
});

export default AddAttendance;