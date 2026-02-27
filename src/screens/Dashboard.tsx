import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Platform, RefreshControl } from "react-native";
import Headers from "./Headers";
import FeatureButton from "./FeatureButton";
import { attendance, commission, employees, rate, salary, work } from "../../assets/images";
import { apiCall } from "./salaryApi";

const Dashboard = ({ navigation }: any) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [todayEarning, setTodayEarning] = useState(0);
    const [weekEarning, setWeekEarning] = useState(0);
    const [workedDays, setWorkedDays] = useState(0);
    const [greeting, setGreeting] = useState("");
    const [userName, setUserName] = useState("");

    const employeeId = 1; 

    const updateGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning! ☀️");
        else if (hour < 16) setGreeting("Good Afternoon! 🍜");
        else if (hour < 20) setGreeting("Good Evening! 🌆");
        else setGreeting("Working late? Good Night! 🌙");
    };

    const fetchDashboardData = async () => {
        try {
            updateGreeting();
            const todayDate = new Date().toISOString().split('T')[0];

            const todayRes = await apiCall.post(`/salary/by-date`, {
                employee_id: employeeId,
                date: todayDate
            });

            const emp = await apiCall.get(`/employees/${employeeId}`);

            if(emp.data.success) {
                setUserName(emp.data.data.name);
            } else {
                setUserName('');
            }

            if (todayRes.data.success && todayRes.data.data.length > 0) {
                setTodayEarning(todayRes.data.data[0].salary_amount);
            } else {
                setTodayEarning(0);
            }

            const weekRes = await apiCall.get(`/salary/this-week/${employeeId}`);
            if (weekRes.data.success) {
                setWeekEarning(weekRes.data.totalSalary);
                setWorkedDays(weekRes.data.records); 
            }

        } catch (error) {
            console.log("Dashboard Fetch Error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={{marginTop: 10, color: '#666'}}>Loading Dashboard...</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Headers userName={userName}/>

            <View style={styles.greetingSection}>
                <Text style={styles.greetingText}>{greeting}</Text>
                <Text style={styles.subGreeting}>Aaj ka hisaab-kitaab dekhte hain.</Text>
            </View>

            <View style={[styles.card, { marginTop: 10 }]}>
                <View style={styles.subCard}>
                    <Text style={styles.cardLabel}>Today's Earning</Text>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>LIVE</Text>
                    </View>
                </View>
                <Text style={styles.salaryText}>₹ {todayEarning}</Text>
            </View>

            {/* Weekly Revenue Card */}
            <View style={[styles.card, { marginTop: 15 }]}>
                <View style={styles.subCard}>
                    <Text style={styles.cardLabel}>Weekly Revenue (Sun-Sat)</Text>
                    <View style={[styles.tag, { borderColor: '#2196F3' }]}>
                        <Text style={[styles.tagText, { color: '#2196F3' }]}>THIS WEEK</Text>
                    </View>
                </View>
                <Text style={styles.salaryText}>₹ {weekEarning}</Text>

                {/* Progress Bar for Worked Days */}
                <View style={styles.weekContainer}>
                    {Array.from({ length: 7 }).map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dayLine,
                                { backgroundColor: index < workedDays ? '#2196F3' : '#E0E0E0' }
                            ]}
                        />
                    ))}
                </View>
                <Text style={styles.footerInfo}>{workedDays} days recorded this week</Text>
            </View>

            <Text style={styles.headerText}>Features</Text>

            {/* Buttons Grid */}
            <View style={styles.featureWrapper}>
                <View style={styles.buttonRow}>
                    <FeatureButton featureName="Work" iconImage={work} onClick={() => navigation.navigate('Work')} />
                    <FeatureButton featureName="Attendance" iconImage={attendance} onClick={() => navigation.navigate('Attendance')} />
                </View>

                <View style={styles.buttonRow}>
                    <FeatureButton featureName="Employee" iconImage={employees} onClick={() => navigation.navigate('Employee')} />
                    <FeatureButton featureName="Rate" iconImage={rate} onClick={() => navigation.navigate('Rate')} />
                </View>

                <View style={styles.buttonRow}>
                    <FeatureButton featureName="Salary" iconImage={salary} onClick={() => navigation.navigate('Salary')} />
                    <FeatureButton featureName="Commission" iconImage={commission} onClick={() => navigation.navigate('Commission')} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    greetingSection: {
        paddingHorizontal: 15,
        marginBottom: 5
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212121'
    },
    subGreeting: {
        fontSize: 14,
        color: '#777',
        marginTop: 2
    },
    card: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        marginHorizontal: 15,
        padding: 15,
        backgroundColor: '#fff',
        ...Platform.select({
            android: { 
                elevation: 3 
            },
            ios: { 
                shadowColor: '#000', 
                shadowOffset: { 
                    width: 0, 
                    height: 2 
                }, shadowOpacity: 0.1, 
                shadowRadius: 4 
            }
        })
    },
    subCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardLabel: { fontSize: 13, color: '#666', fontWeight: '500' },
    salaryText: { marginTop: 8, fontSize: 30, fontWeight: 'bold', color: '#212121' },
    tag: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, borderColor: 'green' },
    tagText: { color: 'green', fontSize: 10, fontWeight: 'bold' },
    weekContainer: { flexDirection: 'row', gap: 5, marginTop: 15, height: 6 },
    dayLine: { flex: 1, borderRadius: 3 },
    footerInfo: { fontSize: 11, color: '#999', marginTop: 10 },
    headerText: { marginTop: 25, marginLeft: 15, fontSize: 18, fontWeight: 'bold', color: '#333' },
    featureWrapper: { marginTop: 10, paddingBottom: 30 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15, paddingHorizontal: 5 }
});

export default Dashboard;