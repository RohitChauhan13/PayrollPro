import React, { useState } from "react";
import SubHeader from "./SubHeader";
import CustomInput from "./CustomeInput";
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import CustomDatePicker from "./CustomDatePicker";
import { RadioButton } from "react-native-paper";
import Loader from "./Loader";
import { apiCall } from "./salaryApi";

const AddWork = () => {
  const [awak, setAwak] = useState("");
  const [jawak, setJawak] = useState("");
  const [dockAwak, setDockAwak] = useState("");
  const [dockJawak, setDockJawak] = useState("");
  const [jawakVarning, setJawakVarning] = useState("");
  const [dockJawakVarning, setDockJawakVarning] = useState("");
  const [checkBox, setCheckBox] = useState("");
  const [panni, setPanni] = useState("");
  const [potti5, setPotti5] = useState("");
  const [potti10, setPotti10] = useState("");
  const [solapur, setSolapur] = useState("");
  const [other, setOther] = useState("");

  const [otherRate, setOtherRate] = useState("");
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [actionType, setActionType] = useState<"add" | "update" | null>(null);

  const [value, setValue] = useState("add");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setAwak("");
    setJawak("");
    setDockAwak("");
    setDockJawak("");
    setJawakVarning("");
    setDockJawakVarning("");
    setCheckBox("");
    setPanni("");
    setPotti5("");
    setPotti10("");
    setSolapur("");
    setOther("");
    setOtherRate("");
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const buildPayload = () => ({
    work_date: formatDate(date!),
    awak: Number(awak) || 0,
    jawak: Number(jawak) || 0,
    dockawak: Number(dockAwak) || 0,
    dockjawak: Number(dockJawak) || 0,
    jawakwarning: Number(jawakVarning) || 0,
    dockjawakwarning: Number(dockJawakVarning) || 0,
    checkbox: Number(checkBox) || 0,
    panni: Number(panni) || 0,
    potti5: Number(potti5) || 0,
    potti10: Number(potti10) || 0,
    solapur: Number(solapur) || 0,
    other: Number(other) || 0,
    other_rate: Number(otherRate) || 0,
  });

  const addWork = async () => {
    try {
      if (!date) {
        ToastAndroid.show("Please select date", ToastAndroid.SHORT);
        return;
      }

      setLoading(true);

      await apiCall.post(
        `/add-work`,
        buildPayload()
      );

      ToastAndroid.show("Work saved successfully", ToastAndroid.SHORT);
      resetFields();
    } catch (error: any) {
      ToastAndroid.show(
        error.response?.data?.message || "Network Error",
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  const updateWork = async () => {
    try {
      if (!date) {
        ToastAndroid.show("Please select date", ToastAndroid.SHORT);
        return;
      }

      setLoading(true);

      await apiCall.put(
        `/update-work/${formatDate(
          date
        )}`,
        buildPayload()
      );

      ToastAndroid.show("Work updated successfully", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Failed to update work", ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const getWorkByDate = async () => {
    try {
      if (!date) {
        ToastAndroid.show("Please select date", ToastAndroid.SHORT);
        return;
      }

      setLoading(true);

      const result = await apiCall.get(
        `/get-work/${formatDate(
          date
        )}`
      );

      if (result.data.count > 0) {
        const data = result.data.data[0];

        setAwak(String(data.awak ?? ""));
        setJawak(String(data.jawak ?? ""));
        setDockAwak(String(data.dockawak ?? ""));
        setDockJawak(String(data.dockjawak ?? ""));
        setJawakVarning(String(data.jawakwarning ?? ""));
        setDockJawakVarning(String(data.dockjawakwarning ?? ""));
        setCheckBox(String(data.checkbox ?? ""));
        setPanni(String(data.panni ?? ""));
        setPotti5(String(data.potti5 ?? ""));
        setPotti10(String(data.potti10 ?? ""));
        setSolapur(String(data.solapur ?? ""));
        setOther(String(data.other ?? ""));
        setOtherRate(String(data.other_rate ?? ""));

        ToastAndroid.show("Data loaded", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("No data found", ToastAndroid.SHORT);
        resetFields();
      }
    } catch (error) {
      ToastAndroid.show("Failed to get work", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (Number(other) > 0) {
      setActionType(value === "add" ? "add" : "update");
      setShowOtherModal(true);
    } else {
      value === "add" ? addWork() : updateWork();
    }
  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1, padding: 10 }}>
      <SubHeader title="Work" />

      <View style={{ marginTop: 15 }} />

      <RadioButton.Group
        onValueChange={(newValue) => {
          setValue(newValue);
          resetFields();
        }}
        value={value}
      >
        <View style={{ flexDirection: "row", gap: 20, marginBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value="add" color="blue" />
            <Text>ADD</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value="edit" color="blue" />
            <Text>EDIT</Text>
          </View>
        </View>
      </RadioButton.Group>

      {/* Date + Fetch */}
      <View
        style={{
          flexDirection: "row",
          justifyContent:
            value !== "add" ? "space-between" : "flex-start",
          alignItems: "center",
        }}
      >
        <CustomDatePicker
          maximumDate={new Date()}
          onChange={(selectedDate) => {
            setDate(selectedDate);
            resetFields(); // 🔥 reset when date changes
          }}
          label="Date *"
          value={date}
        />

        {value !== "add" && (
          <TouchableOpacity style={styles.btn1} onPress={getWorkByDate}>
            <Text style={{ color: "white", fontSize: 16 }}>
              Fetch Data
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* All Inputs */}
      <View style={styles.inline}>
        <CustomInput label="Awak *" value={awak} onChangeText={setAwak} horizontal />
        <CustomInput label="Jawak *" value={jawak} onChangeText={setJawak} horizontal />
      </View>

      <View style={styles.inline}>
        <CustomInput label="Dock Awak *" value={dockAwak} onChangeText={setDockAwak} horizontal />
        <CustomInput label="Dock Jawak *" value={dockJawak} onChangeText={setDockJawak} horizontal />
      </View>

      <View style={styles.inline}>
        <CustomInput label="Jawak Varning *" value={jawakVarning} onChangeText={setJawakVarning} horizontal />
        <CustomInput label="Dock Jawak Varning *" value={dockJawakVarning} onChangeText={setDockJawakVarning} horizontal />
      </View>

      <View style={styles.inline}>
        <CustomInput label="Check Box *" value={checkBox} onChangeText={setCheckBox} horizontal />
        <CustomInput label="Panni *" value={panni} onChangeText={setPanni} horizontal />
      </View>

      <View style={styles.inline}>
        <CustomInput label="Potti (Rs.5)" value={potti5} onChangeText={setPotti5} horizontal />
        <CustomInput label="Potti (Rs.10)" value={potti10} onChangeText={setPotti10} horizontal />
      </View>

      <View style={styles.inline}>
        <CustomInput label="Solapur Varning" value={solapur} onChangeText={setSolapur} horizontal />
        <CustomInput label="Other" value={other} onChangeText={setOther} horizontal />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={{ color: "white", fontSize: 18 }}>
          {value === "add" ? "SAVE" : "UPDATE"}
        </Text>
      </TouchableOpacity>

      {/* Other Rate Modal */}
      <Modal visible={showOtherModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              Enter Other Rate
            </Text>

            <CustomInput
              label="Other Rate"
              value={otherRate}
              onChangeText={setOtherRate}
              type="number"
            />

            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <TouchableOpacity
                style={[styles.btn, { flex: 1, marginRight: 5 }]}
                onPress={() => setShowOtherModal(false)}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { flex: 1, marginLeft: 5 }]}
                onPress={() => {
                  if (!otherRate) {
                    ToastAndroid.show("Enter Other Rate", ToastAndroid.SHORT);
                    return;
                  }
                  setShowOtherModal(false);
                  actionType === "add" ? addWork() : updateWork();
                }}
              >
                <Text style={{ color: "#fff" }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Loader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  inline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  btn: {
    paddingVertical: 10,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  btn1: {
    backgroundColor: "blue",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
});

export default AddWork;