import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import SubHeader from "./SubHeader";
import CustomDatePicker from "./CustomDatePicker";
import { apiCall } from "./salaryApi";

interface Attendance {
  id: number;
  employee_id: number;
  employee_name?: string;
  status: number;
}

const ViewAttendance = () => {
  const [activeTab, setActiveTab] = useState<"present" | "absent">("present");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchAttendance = async () => {
    try {
      if (!date) {
        ToastAndroid.show("Date is required", ToastAndroid.SHORT);
        return;
      }

      setLoading(true);
      const formattedDate = formatDate(date);

      const response = await apiCall.post(
        `/get-attendance`,
        { attendance_date: formattedDate }
      );

      if (response.data.success) {
        setAttendanceData(response.data.data);
      } else {
        setAttendanceData([]);
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

  const filteredData = useMemo(() => {
    return attendanceData.filter((item) =>
      activeTab === "present" ? item.status === 1 : item.status === 0
    );
  }, [attendanceData, activeTab]);

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerText, { flex: 1 }]}>ID</Text>
      <Text style={[styles.headerText, { flex: 3 }]}>Employee Name</Text>
      <Text style={[styles.headerText, { flex: 1.5, textAlign: "right" }]}>
        Status
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>

      <View style={{padding: 10}}>
        <SubHeader title="View Attendance" />
      </View>

      <CustomDatePicker
        horizontal={false}
        label="Date of attendance"
        value={date}
        onChange={(prev) => {
          setDate(prev);
          setAttendanceData([]);
        }}
        maximumDate={new Date()}
      />

      <View style={styles.BtnContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "present" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("present")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "present" && styles.activeTabText,
            ]}
          >
            Present ({attendanceData.filter((i) => i.status === 1).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "absent" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("absent")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "absent" && styles.activeTabText,
            ]}
          >
            Absent ({attendanceData.filter((i) => i.status === 0).length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <TableHeader />
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.empty}>No records found for this date.</Text>
            }
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                ]}
              >
                <Text style={[styles.cellText, { flex: 1 }]}>
                  {item.employee_id}
                </Text>
                <Text style={[styles.cellText, { flex: 3 }]} numberOfLines={1}>
                  {item.employee_name || "Unknown"}
                </Text>
                <Text
                  style={[
                    styles.cellText,
                    {
                      flex: 1.5,
                      textAlign: "right",
                      fontWeight: "bold",
                      color: item.status === 1 ? "#1f6feb" : "#D32F2F",
                    },
                  ]}
                >
                  {item.status === 1 ? "Present" : "Absent"}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  topSection: {
    marginTop: 20,
  },
  BtnContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 4,
    marginBottom: 10,
    marginTop: 10
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#1f6feb",
    elevation: 2,
  },
  tabText: {
    color: "#777",
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: "#fff",
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden", 
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 13,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  rowEven: {
    backgroundColor: "#FFFFFF",
  },
  rowOdd: {
    backgroundColor: "#FAFAFA",
  },
  cellText: {
    fontSize: 14,
    color: "#444",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
    color: "#999",
  },
});

export default ViewAttendance;