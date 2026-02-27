// Filters.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CustomDatePicker from './CustomDatePicker';
import EmployeePickerModal, { Employee } from './EmployeePickerModal';

const fmtApi = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// ─────────────────────────────────────────────────────────────
// 1. DayFilter
// ─────────────────────────────────────────────────────────────
interface DayFilterProps {
  onFetch: (date: string) => void;
  loading?: boolean;
}

export function DayFilter({ onFetch, loading }: DayFilterProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFetch = () => {
    if (isProcessing || loading) return;
    setIsProcessing(true);
    onFetch(fmtApi(date));
    // Reset after 2 seconds to prevent accidental double clicks
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <View>
      <CustomDatePicker
        label="Date"
        value={date}
        onChange={setDate}
        maximumDate={new Date()}
      />
      <TouchableOpacity 
        style={[s.fetchBtn, (loading || isProcessing) && s.fetchBtnDisabled]} 
        onPress={handleFetch} 
        activeOpacity={0.8}
        disabled={loading || isProcessing}
      >
        <Text style={s.fetchBtnText}>↗  Salary Fetch Karo</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. RangeFilter
// ─────────────────────────────────────────────────────────────
interface RangeFilterProps {
  employees: Employee[];
  onFetch: (params: { employee_id: number; start_date: string; end_date: string }) => void;
  loading?: boolean;
}

export function RangeFilter({ employees, onFetch, loading }: RangeFilterProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate]     = useState<Date>(new Date());
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFetch = () => {
    if (isProcessing || loading) return;
    if (!employee) { Alert.alert('Pehle employee select karo'); return; }
    if (startDate > endDate) { Alert.alert('Start date, end date se pehle honi chahiye'); return; }
    
    setIsProcessing(true);
    onFetch({ employee_id: employee.id, start_date: fmtApi(startDate), end_date: fmtApi(endDate) });
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <View>
      <Text style={s.fieldLabel}>EMPLOYEE</Text>
      <TouchableOpacity style={s.selector} onPress={() => setShowModal(true)} activeOpacity={0.7}>
        <View style={s.selectorLeft}>
          {employee
            ? <View style={s.mini}><Text style={s.miniText}>{employee.name.charAt(0)}</Text></View>
            : <Text style={s.selectorIcon}>👤</Text>
          }
          <Text style={[s.selectorText, !employee && s.placeholder]}>
            {employee ? employee.name : 'Employee chunlo…'}
          </Text>
        </View>
        <View style={s.selectorRight}>
          {employee && <View style={s.pill}><Text style={s.pillText}>#{employee.id}</Text></View>}
          <Text style={s.chevron}>›</Text>
        </View>
      </TouchableOpacity>

      <View style={s.dateRow}>
        <View style={{ flex: 1 }}>
          <CustomDatePicker label="From Date" value={startDate} onChange={setStartDate} maximumDate={endDate} horizontal />
        </View>
        <View style={{ flex: 1 }}>
          <CustomDatePicker label="To Date" value={endDate} onChange={setEndDate} minimumDate={startDate} maximumDate={new Date()} horizontal />
        </View>
      </View>

      <TouchableOpacity 
        style={[s.fetchBtn, (loading || isProcessing) && s.fetchBtnDisabled]} 
        onPress={handleFetch} 
        activeOpacity={0.8}
        disabled={loading || isProcessing}
      >
        <Text style={s.fetchBtnText}>↗  Range Fetch Karo</Text>
      </TouchableOpacity>

      <EmployeePickerModal
        visible={showModal}
        employees={employees}
        onSelect={(emp) => { setEmployee(emp); setShowModal(false); }}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. EmployeeFilter
// ─────────────────────────────────────────────────────────────
interface EmployeeFilterProps {
  employees: Employee[];
  onFetch: (params: {
    employee_id: number;
    period: 'all' | 'thisweek' | 'custom';
    start_date?: string;
    end_date?: string;
  }) => void;
  loading?: boolean;
}

const PERIODS: { key: 'all' | 'thisweek' | 'custom'; label: string; icon: string }[] = [
  { key: 'all',      label: 'All Time',  icon: '📋' },
  { key: 'thisweek', label: 'This Week', icon: '📆' },
  { key: 'custom',   label: 'Custom',    icon: '✏️'  },
];

export function EmployeeFilter({ employees, onFetch, loading }: EmployeeFilterProps) {
  const [employee, setEmployee]   = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [period, setPeriod]       = useState<'all' | 'thisweek' | 'custom'>('all');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate]     = useState<Date>(new Date());
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFetch = () => {
    if (isProcessing || loading) return;
    if (!employee) { Alert.alert('Pehle employee select karo'); return; }
    if (period === 'custom' && startDate > endDate) { Alert.alert('Start date, end date se pehle honi chahiye'); return; }
    
    setIsProcessing(true);
    onFetch({ employee_id: employee.id, period, start_date: fmtApi(startDate), end_date: fmtApi(endDate) });
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <View>
      <Text style={s.fieldLabel}>EMPLOYEE</Text>
      <TouchableOpacity style={s.selector} onPress={() => setShowModal(true)} activeOpacity={0.7}>
        <View style={s.selectorLeft}>
          {employee
            ? <View style={s.mini}><Text style={s.miniText}>{employee.name.charAt(0)}</Text></View>
            : <Text style={s.selectorIcon}>👤</Text>
          }
          <Text style={[s.selectorText, !employee && s.placeholder]}>
            {employee ? employee.name : 'Employee chunlo…'}
          </Text>
        </View>
        <View style={s.selectorRight}>
          {employee && <View style={s.pill}><Text style={s.pillText}>#{employee.id}</Text></View>}
          <Text style={s.chevron}>›</Text>
        </View>
      </TouchableOpacity>

      <Text style={[s.fieldLabel, { marginTop: 16 }]}>PERIOD</Text>
      <View style={s.periodRow}>
        {PERIODS.map(p => (
          <TouchableOpacity
            key={p.key}
            style={[s.periodBtn, period === p.key && s.periodBtnActive]}
            onPress={() => setPeriod(p.key)}
            activeOpacity={0.7}
          >
            <Text style={s.periodIcon}>{p.icon}</Text>
            <Text style={[s.periodText, period === p.key && s.periodTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {period === 'custom' && (
        <View style={s.dateRow}>
          <View style={{ flex: 1 }}>
            <CustomDatePicker label="From Date" value={startDate} onChange={setStartDate} maximumDate={endDate} horizontal />
          </View>
          <View style={{ flex: 1 }}>
            <CustomDatePicker label="To Date" value={endDate} onChange={setEndDate} minimumDate={startDate} maximumDate={new Date()} horizontal />
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={[s.fetchBtn, (loading || isProcessing) && s.fetchBtnDisabled]} 
        onPress={handleFetch} 
        activeOpacity={0.8}
        disabled={loading || isProcessing}
      >
        <Text style={s.fetchBtnText}>↗  Employee Salary Dekho</Text>
      </TouchableOpacity>

      <EmployeePickerModal
        visible={showModal}
        employees={employees}
        onSelect={(emp) => { setEmployee(emp); setShowModal(false); }}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  fieldLabel:         { fontSize: 10, color: '#94a3b8', letterSpacing: 1.5, fontWeight: '700', marginBottom: 8 },

  selector:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8faff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1, borderColor: '#dbeafe', marginBottom: 4 },
  selectorLeft:       { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  selectorIcon:       { fontSize: 16 },
  selectorText:       { fontSize: 14, color: '#0f172a', fontWeight: '500' },
  placeholder:        { color: '#94a3b8' },
  selectorRight:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mini:               { width: 28, height: 28, borderRadius: 14, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  miniText:           { fontSize: 13, fontWeight: '700', color: '#1a6ef7' },
  pill:               { backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#bfdbfe' },
  pillText:           { fontSize: 11, color: '#1a6ef7', fontWeight: '600' },
  chevron:            { fontSize: 20, color: '#94a3b8' },

  dateRow:            { flexDirection: 'row', gap: 10, marginTop: 10 },

  periodRow:          { flexDirection: 'row', gap: 8, marginBottom: 14 },
  periodBtn:          { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', gap: 4 },
  periodBtnActive:    { backgroundColor: '#eff6ff', borderColor: '#1a6ef7' },
  periodIcon:         { fontSize: 16 },
  periodText:         { fontSize: 11, fontWeight: '600', color: '#64748b' },
  periodTextActive:   { color: '#1a6ef7' },

  fetchBtn:           { backgroundColor: '#1a6ef7', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 16, shadowColor: '#1a6ef7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  fetchBtnDisabled:   { backgroundColor: '#94a3b8', opacity: 0.6 },
  fetchBtnText:       { fontSize: 14, fontWeight: '700', color: '#ffffff', letterSpacing: 0.3 },
});
