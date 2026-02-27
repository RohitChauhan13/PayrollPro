import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface CustomDatePickerProps {
  label: string;
  value?: Date | null; 
  onChange?: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  horizontal?: boolean;
  disable?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  maximumDate,
  minimumDate,
  horizontal,
  disable = false,
}) => {
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
      setIsFocused(false);
    }

    if (event.type === "set" && selectedDate) {
      onChange?.(selectedDate);
    } else {
      setIsFocused(false);
      setShow(false);
    }
  };

  const formattedDate = value instanceof Date 
    ? value.toLocaleDateString("en-GB") 
    : "Select Date";

  return (
    <View style={[styles.container, { flex: horizontal ? 1 : 0 }]}>
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: disable
              ? "#e0e0e0"
              : isFocused
              ? "#2196F3" 
              : "#ccc",
            backgroundColor: disable ? "#f5f5f5" : "#fff",
          },
        ]}
      >
        <View style={[styles.labelContainer, { backgroundColor: disable ? "#f5f5f5" : "#fff" }]}>
          <Text style={[styles.label, isFocused && { color: "#2196F3" }]}>{label}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={disable}
          onPress={() => {
            if (disable) return;
            setShow(true);
            setIsFocused(true);
          }}
          style={styles.inputArea}
        >
          <Text style={[styles.dateText, { color: value ? "#333" : "#999" }]}>
            {formattedDate}
          </Text>
        </TouchableOpacity>
      </View>

      {show && !disable && (
        <DateTimePicker
          value={value instanceof Date ? value : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
    position: "relative",
    height: 50, 
    justifyContent: 'center'
  },
  labelContainer: {
    position: "absolute",
    top: -8,
    left: 10,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    color: "#666",
    fontWeight: '600'
  },
  inputArea: {
    width: '100%',
  },
  dateText: {
    fontSize: 15,
  },
});