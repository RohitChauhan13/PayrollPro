import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Animated, ActivityIndicator,
} from 'react-native';
import { DayFilter, RangeFilter, EmployeeFilter } from './Filters';
import SalaryTable from './SalaryTable';
import StatsRow from './StatsRow';
import {
  fetchAllEmployees,
  fetchSalaryByDay,
  fetchSalaryByRange,
  fetchSalaryByEmployee,
  cancelAllRequests,
} from './salaryApi';
import { Employee } from './EmployeePickerModal';
import SubHeader from './SubHeader';

type TabKey = 'day' | 'range' | 'employee';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'day', label: '📅 By Date' },
  { key: 'range', label: '📆 Date Range' },
  { key: 'employee', label: '👤 Employee' },
];

export default function SalaryScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('day');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [empLoading, setEmpLoading] = useState(true);
  const [salaryData, setSalaryData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setEmpLoading(true);
    fetchAllEmployees()
      .then(setEmployees)
      .catch(() => setError('Employees load nahi hue. Server check karo.'))
      .finally(() => setEmpLoading(false));

    // Cleanup function to cancel all requests when component unmounts
    return () => {
      cancelAllRequests();
    };
  }, []);

  const animateIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  };

  const handleFetch = async (fetchFn: () => Promise<any>) => {
    setError('');
    setLoading(true);
    setSalaryData(null);
    try {
      const result = await fetchFn();
      setSalaryData(result);
      animateIn();
    } catch (e: any) {
      setError(e?.message ?? 'Server se data nahi mila. Connection check karo.');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (key: TabKey) => {
    setActiveTab(key);
    setSalaryData(null);
    setError('');
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={{ padding: 10 }}>
        <SubHeader title='Salary Report' />
      </View>

      <View style={s.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabScroll}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[s.tabBtn, activeTab === tab.key && s.tabBtnActive]}
              onPress={() => switchTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[s.tabText, activeTab === tab.key && s.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={s.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={s.filterCard}>
          <Text style={s.filterCardLabel}>
            {activeTab === 'day' ? 'DATE SE DEKHO'
              : activeTab === 'range' ? 'DATE RANGE SE DEKHO'
                : 'EMPLOYEE KI SALARY DEKHO'}
          </Text>

          {activeTab === 'day' && (
            <DayFilter onFetch={(date) => handleFetch(() => fetchSalaryByDay(date))} loading={loading} />
          )}
          {activeTab === 'range' && (
            <RangeFilter
              employees={employees}
              onFetch={(params) => handleFetch(() => fetchSalaryByRange(params))}
              loading={loading}
            />
          )}
          {activeTab === 'employee' && (
            <EmployeeFilter
              employees={employees}
              onFetch={(params) => handleFetch(() => fetchSalaryByEmployee(params))}
              loading={loading}
            />
          )}
        </View>

        {!!error && (
          <View style={s.errorBox}>
            <Text style={s.errorText}>⚠  {error}</Text>
          </View>
        )}

        {loading && (
          <View style={s.stateBox}>
            <ActivityIndicator color="#1a6ef7" size="large" />
            <Text style={s.stateText}>Data fetch ho raha hai…</Text>
          </View>
        )}

        {salaryData && !loading && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <StatsRow data={salaryData} mode={activeTab} />
            <SalaryTable data={salaryData} />
          </Animated.View>
        )}

        {!salaryData && !loading && !error && (
          <View style={s.stateBox}>
            <Text style={s.stateIcon}>💸</Text>
            <Text style={s.stateText}>Upar filter lagao aur salary records fetch karo</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', shadowColor: '#1a6ef7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
  accent: { color: '#1a6ef7' },
  headerSub: { fontSize: 11, color: '#94a3b8', marginTop: 3 },
  empBadge: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  empBadgeText: { fontSize: 10, color: '#1a6ef7', fontWeight: '700', letterSpacing: 0.8 },
  tabBar: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  tabScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tabBtn: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  tabBtnActive: { backgroundColor: '#1a6ef7', borderColor: '#1a6ef7' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  tabTextActive: { color: '#ffffff' },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  filterCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16, shadowColor: '#1a6ef7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  filterCardLabel: { fontSize: 10, color: '#94a3b8', letterSpacing: 1.5, fontWeight: '700', marginBottom: 16 },
  errorBox: { backgroundColor: '#fff5f5', borderWidth: 1, borderColor: '#fed7d7', borderRadius: 10, padding: 14, marginBottom: 14 },
  errorText: { color: '#e53e3e', fontSize: 13 },
  stateBox: { alignItems: 'center', paddingVertical: 60, gap: 14 },
  stateIcon: { fontSize: 44, opacity: 0.4 },
  stateText: { color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
