// StatsRow.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  data: any;
  mode: 'day' | 'range' | 'employee';
}

const fmtAmt = (n: number) => `₹ ${Math.floor(n).toLocaleString('en-IN')}`;

export default function StatsRow({ data, mode }: Props) {
  const total        = Number(data.totalSalary ?? 0);
  const records      = Number(data.records ?? data.data?.length ?? 0);
  const presentCount = mode === 'day'
    ? (data.data?.filter((r: any) => Number(r.salary_amount) > 0).length ?? 0)
    : null;
  const uniqueDays   = mode !== 'day'
    ? [...new Set((data.data ?? []).map((r: any) => r.salary_date))].length
    : null;
  const avgPerDay    = uniqueDays ? (uniqueDays > 0 ? total / uniqueDays : 0) : 0;
  const emp          = data.employee ?? null;
  const weekStart    = data.weekStart ?? null;
  const weekEnd      = data.weekEnd ?? null;

  return (
    <View style={s.row}>
      {/* Total */}
      <View style={[s.card, s.blueTop]}>
        <Text style={s.label}>TOTAL SALARY</Text>
        <Text style={s.valBlue}>{fmtAmt(total)}</Text>
        {weekStart && (
          <Text style={s.sub}>
            {new Date(weekStart).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} →{' '}
            {new Date(weekEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </Text>
        )}
      </View>

      {/* Records / Present */}
      <View style={[s.card, s.greenTop]}>
        <Text style={s.label}>{mode === 'day' ? 'PRESENT' : 'RECORDS'}</Text>
        <Text style={s.val}>{mode === 'day' ? `${presentCount} / ${records}` : records}</Text>
        <Text style={s.sub}>{mode === 'day' ? 'employees' : 'salary entries'}</Text>
      </View>

      {/* Employee / Avg */}
      {emp ? (
        <View style={[s.card, s.indigoTop]}>
          <Text style={s.label}>EMPLOYEE</Text>
          <Text style={s.val} numberOfLines={1}>{emp.name}</Text>
          <Text style={s.sub}>ID #{emp.id}</Text>
        </View>
      ) : (
        <View style={[s.card, s.indigoTop]}>
          <Text style={s.label}>AVG / PRESENT</Text>
          <Text style={s.val}>
            {fmtAmt(presentCount && presentCount > 0 ? total / presentCount : 0)}
          </Text>
          <Text style={s.sub}>per employee</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row:        { flexDirection: 'row', gap: 10, marginBottom: 14 },
  card:       { flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e2e8f0', borderTopWidth: 3, shadowColor: '#1a6ef7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  blueTop:    { borderTopColor: '#1a6ef7' },
  greenTop:   { borderTopColor: '#10b981' },
  indigoTop:  { borderTopColor: '#6366f1' },

  label:      { fontSize: 9, color: '#94a3b8', letterSpacing: 1.3, fontWeight: '700', marginBottom: 6 },
  val:        { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  valBlue:    { fontSize: 18, fontWeight: '800', color: '#1a6ef7' },
  sub:        { fontSize: 10, color: '#94a3b8', marginTop: 3 },
});
