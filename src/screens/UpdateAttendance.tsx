import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Switch,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "./SubHeader";
import Loader from "./Loader";
import CustomDatePicker from "./CustomDatePicker";
import { apiCall } from "./salaryApi";

interface Employee {
  id: number;
  name: string;
}

const UpdateAttendance = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<{ [key: number]: boolean }>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date());

  // Theme Constants
  const PRIMARY_BLUE = "#2196F3";
  const LIGHT_BLUE = "#E3F2FD";
  const DANGER_RED = "#F44336";

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchAttendance = async () => {
    try {
      if (!date) return;
      setLoading(true);

      const formattedDate = formatDate(date);
      const res = await apiCall.post(
        `/get-attendance`,
        { attendance_date: formattedDate }
      );

      if (res.data.success) {
        const data = res.data.data;
        setEmployees(
          data.map((item: any) => ({
            id: item.employee_id,
            name: item.employee_name,
          }))
        );

        const attendanceMap: { [key: number]: boolean } = {};
        data.forEach((item: any) => {
          attendanceMap[item.employee_id] = item.status === 1;
        });
        setAttendance(attendanceMap);
      } else {
        setEmployees([]);
        setAttendance({});
      }
    } catch (error: any) {
      ToastAndroid.show(
        error?.message || "Network Error",
        ToastAndroid.SHORT
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const toggleAttendance = (id: number) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markAll = (status: boolean) => {
    const updated: { [key: number]: boolean } = {};
    employees.forEach((emp) => {
      updated[emp.id] = status;
    });
    setAttendance(updated);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  const saveAttendance = async () => {
    try {
      if (!date) return;
      setLoading(true);

      const payload = {
        attendance_date: formatDate(date),
        attendance: employees.map((emp) => ({
          employee_id: emp.id,
          employee_name: emp.name,
          status: attendance[emp.id] ? 1 : 0,
        })),
      };

      await apiCall.put(
        `/update-attendance`,
        payload
      );

      ToastAndroid.show("Attendance Updated", ToastAndroid.SHORT);
    } catch (error: any) {
      ToastAndroid.show(
        error?.message || "Update Failed",
        ToastAndroid.SHORT
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <View style={{ padding: 10 }}>
        <SubHeader title="Update Attendance" />
      </View>

      <View style={styles.headerControls}>
        <View style={styles.dateWrapper}>
          <CustomDatePicker
            label="Date"
            horizontal
            maximumDate={new Date()}
            onChange={(d) => setDate(d)}
            value={date}
          />
        </View>
        <View style={styles.searchWrapper}>
          <TextInput
            placeholder="Search..."
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
          onPress={() => markAll(true)}
        >
          <Text style={styles.actionBtnText}>Mark All Present</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: LIGHT_BLUE, borderWidth: 1, borderColor: PRIMARY_BLUE }]}
          onPress={() => markAll(false)}
        >
          <Text style={[styles.actionBtnText, { color: PRIMARY_BLUE }]}>Mark All Absent</Text>
        </TouchableOpacity>
      </View>

      {/* Employee List */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No records found for this date.</Text>}
        renderItem={({ item }) => (
          <View style={styles.employeeCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.employeeInfo}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.idText}>ID: {item.id}</Text>
            </View>
            <View style={styles.statusWrapper}>
              <Text style={[styles.statusText, { color: attendance[item.id] ? PRIMARY_BLUE : DANGER_RED }]}>
                {attendance[item.id] ? "Present" : "Absent"}
              </Text>
              <Switch
                value={attendance[item.id] || false}
                onValueChange={() => toggleAttendance(item.id)}
                trackColor={{ false: "#eee", true: LIGHT_BLUE }}
                thumbColor={attendance[item.id] ? PRIMARY_BLUE : "#999"}
              />
            </View>
          </View>
        )}
      />

      {/* Primary Update Button */}
      <TouchableOpacity
        style={styles.mainUpdateBtn}
        onPress={saveAttendance}
        activeOpacity={0.8}
      >
        <Text style={styles.mainUpdateBtnText}>UPDATE ATTENDANCE</Text>
      </TouchableOpacity>

      <Loader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  headerControls: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
    marginBottom: 15,
    alignItems: "center",
  },
  dateWrapper: {
    flex: 1,
  },
  searchWrapper: {
    flex: 1.4,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F9FA",
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
  nameText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  idText: {
    fontSize: 12,
    color: "#888",
  },
  statusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    width: 45,
    textAlign: "right",
  },
  mainUpdateBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mainUpdateBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 14,
  },
});

export default UpdateAttendance;