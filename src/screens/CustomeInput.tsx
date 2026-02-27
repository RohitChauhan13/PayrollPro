import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";

interface CustomInputProps {
  label: string;
  type?: "number" | "text";
  value: string;
  onChangeText: (text: string) => void;
  horizontal?: boolean;
  maxLength?: number;
  editable?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  horizontal,
  label,
  type = "number",
  value,
  onChangeText,
  maxLength,
  editable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const keyboardType: KeyboardTypeOptions =
    type === "number" ? "numeric" : "default";

  const handleChange = (text: string) => {
    if (type === "number") {
      const regex = /^\d*\.?\d*$/; 

      if (regex.test(text)) {
        onChangeText(text);
      }
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={[styles.container, { flex: horizontal ? 1 : 0 }]}>
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: !editable
              ? "#e0e0e0"
              : isFocused
                ? "#1f6feb"
                : "#ccc",
            backgroundColor: !editable ? "#f5f5f5" : "#fff",
          },
        ]}
      >
        {/* Label */}
        <View
          style={styles.labelContainer}
        >
          <Text
            style={styles.label}
          >
            {label}
          </Text>
        </View>

        <TextInput
          value={value}
          keyboardType={keyboardType}
          onChangeText={handleChange}
          onFocus={() => editable && setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            { color: !editable ? "#999" : "#000" },
          ]}
          maxLength={maxLength}
          editable={editable}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },

  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 8,
    position: "relative",
  },

  labelContainer: {
    position: "absolute",
    top: -8,
    left: 10,
    paddingHorizontal: 5,
    backgroundColor: '#fff'
  },

  label: {
    fontSize: 12,
  },

  input: {
    fontSize: 16,
    padding: 0,
  },
});

export default CustomInput;