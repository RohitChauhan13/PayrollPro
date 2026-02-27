import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Switch,
    ToastAndroid,
    FlatList,
} from "react-native";
import SubHeader from "./SubHeader";
import CustomInput from "./CustomeInput";
import CustomDatePicker from "./CustomDatePicker";
import Loader from "./Loader";
import { apiCall } from "./salaryApi";

const Employee = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [dob, setDob] = useState<Date | null>(null);
    const [status, setStatus] = useState(true);

    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("add");

    const resetFields = () => {
        setName("");
        setMobile("");
        setAddress("");
        setDob(null);
        setStatus(true);
        setSelectedEmployee(null);
    };

    useEffect(() => {
        if (activeTab === "update") {
            fetchEmployees();
        }
    }, [activeTab]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await apiCall.get(`/employees`);
            setEmployees(res.data.data);
            console.log("$$: ", res.data.data);
        } catch (err) {
            ToastAndroid.show("Failed to load employees", ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEmployee = (emp: any) => {
        setSelectedEmployee(emp);
        setName(emp.name);
        setMobile(emp.mobile);
        setAddress(emp.address);
        const [day, month, year] = emp.dob.split("-");
        const parsedDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );
        setDob(parsedDate);
        setStatus(emp.status === 1);
    };

    const updateEmployee = async () => {
        if (!selectedEmployee) return;

        if (!address) {
            ToastAndroid.show("Address required", ToastAndroid.SHORT);
            return;
        }

        try {
            setLoading(true);

            await apiCall.put(`/update-employee`, {
                id: selectedEmployee.id,
                address,
                status: status ? 1 : 0,
            });

            ToastAndroid.show("Employee updated", ToastAndroid.SHORT);
            resetFields();
            fetchEmployees();
        } catch (err: any) {
            ToastAndroid.show(
                err.response?.data?.message || "Update failed",
                ToastAndroid.SHORT
            );
        } finally {
            setLoading(false);
        }
    };

    const addEmployee = async () => {
        if (!name || !mobile || !address || !dob) {
            ToastAndroid.show("All fields required", ToastAndroid.SHORT);
            return;
        }

        try {
            setLoading(true);

            await apiCall.post(`/add-employee`, {
                name,
                mobile,
                address,
                dob: dob.toISOString().split("T")[0],
            });

            ToastAndroid.show("Employee added", ToastAndroid.SHORT);
            resetFields();
        } catch (err: any) {
            ToastAndroid.show(
                err.response?.data?.message || "Add failed",
                ToastAndroid.SHORT
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <SubHeader title="Employee" />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {["add", "update"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tabButton,
                            activeTab === tab && styles.activeTab,
                        ]}
                        onPress={() => {
                            setActiveTab(tab);
                            resetFields();
                        }}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* UPDATE LIST */}
            {activeTab === "update" && !selectedEmployee && (
                <FlatList
                    data={employees}
                    keyExtractor={(item) => item.id.toString()}
                    style={{ marginTop: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handleSelectEmployee(item)}
                        >
                            <Text style={styles.cardText}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* FORM */}
            {(activeTab === "add" || selectedEmployee) && (
                <View style={{ marginTop: 20, gap: 12 }}>

                    {activeTab === "update" && (
                        <TouchableOpacity
                            onPress={() => setSelectedEmployee(null)}
                        >
                            <Text style={{ color: "blue", marginBottom: 10 }}>
                                ← Change Employee
                            </Text>
                        </TouchableOpacity>
                    )}

                    <CustomInput
                        value={name}
                        label="Employee Name"
                        type="text"
                        onChangeText={setName}
                        editable={activeTab === "add"}
                    />

                    <CustomInput
                        value={mobile}
                        label="Mobile Number"
                        type="number"
                        onChangeText={setMobile}
                        editable={activeTab === "add"}
                        maxLength={10}
                    />

                    <CustomDatePicker
                        value={dob ?? undefined}
                        label="Date of Birth"
                        onChange={setDob}
                        maximumDate={new Date()}
                        disable={activeTab === "update"}
                    />

                    <CustomInput
                        value={address}
                        label="Permanent Address"
                        type="text"
                        onChangeText={setAddress}
                    />

                    <View style={styles.statusRow}>
                        <Text style={{ fontSize: 16 }}>Status</Text>
                        <Switch value={status} onValueChange={setStatus} />
                    </View>

                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={
                            activeTab === "add"
                                ? addEmployee
                                : updateEmployee
                        }
                    >
                        <Text style={styles.saveText}>
                            {activeTab === "add" ? "SAVE" : "UPDATE"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <Loader visible={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#e5e5e5",
        borderRadius: 25,
        padding: 4,
        marginTop: 20,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: "#1f6feb",
    },
    tabText: {
        color: "#555",
        fontWeight: "600",
    },
    activeTabText: {
        color: "#fff",
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    cardText: {
        fontSize: 16,
        fontWeight: "600",
    },
    statusRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    saveBtn: {
        backgroundColor: "#1f6feb",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 15,
    },
    saveText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default Employee;