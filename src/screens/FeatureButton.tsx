import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

interface FeatureButtonProps {
    featureName: string;
    iconImage: any;
    onClick: () => void;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ onClick, featureName, iconImage }) => {
    return (
        <TouchableOpacity style={styles.card} 
            activeOpacity={0.7}
            onPress={onClick}
        >
            <Image source={iconImage} style={styles.image}/>
            <Text style={styles.featureName}>{featureName}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: '40%',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    featureName: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '500'
    },
    image: {
        width:35,
        height: 35
    }
})

export default FeatureButton;