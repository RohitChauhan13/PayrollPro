// SalaryTable.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SalaryRow {
  id?: number;
  employee_id: number;
  employee_name: string;
  salary_date: string;
  salary_amount: number | string;
}

interface Props {
  data: {
    mode: string;
    data: SalaryRow[];
  };
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const getDayName = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { weekday: 'short' });

const fmtAmt = (a: number | string) =>
  Number(a) > 0 ? `₹ ${Number(a).toLocaleString('en-IN')}` : '—';

export default function SalaryTable({ data }: Props) {
  const rows  = data.data ?? [];
  const isDay = data.mode === 'day';

  if (rows.length === 0) {
    return (
      <View style={s.emptyWrap}>
        <Text style={s.emptyIcon}>🔍</Text>
        <Text style={s.emptyText}>Is filter ke liye koi record nahi mila</Text>
      </View>
    );
  }

  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>
        {isDay ? `${rows.length} EMPLOYEES` : `${rows.length} RECORDS`}
      </Text>

      {/* Header */}
      <View style={[s.row, s.headerRow]}>
        <Text style={[s.hCell, { width: 28 }]}>#</Text>
        {isDay ? (
          <>
            <Text style={[s.hCell, { flex: 2 }]}>EMPLOYEE</Text>
            <Text style={[s.hCell, { flex: 1 }]}>STATUS</Text>
            <Text style={[s.hCell, { flex: 1.2, textAlign: 'right' }]}>AMOUNT</Text>
          </>
        ) : (
          <>
            <Text style={[s.hCell, { flex: 1.6 }]}>DATE</Text>
            <Text style={[s.hCell, { flex: 0.8 }]}>DAY</Text>
            <Text style={[s.hCell, { flex: 1.2, textAlign: 'right' }]}>AMOUNT</Text>
            <Text style={[s.hCell, { flex: 1.3, textAlign: 'right' }]}>RUNNING</Text>
          </>
        )}
      </View>

      {/* Rows */}
      {rows.map((row, i) => {
        const amt     = Number(row.salary_amount ?? 0);
        const running = rows.slice(0, i + 1).reduce((sum, r) => sum + Number(r.salary_amount ?? 0), 0);

        return (
          <View key={i} style={[s.row, s.dataRow, i % 2 === 0 && s.altRow]}>
            <Text style={[s.indexCell, { width: 28 }]}>{i + 1}</Text>

            {isDay ? (
              <>
                <View style={{ flex: 2 }}>
                  <Text style={s.empName}>{row.employee_name}</Text>
                  <Text style={s.empId}>ID #{row.employee_id}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  {amt > 0
                    ? <View style={s.presentBadge}><Text style={s.presentText}>Present</Text></View>
                    : <View style={s.absentBadge}><Text style={s.absentText}>Absent</Text></View>
                  }
                </View>
                <Text style={[{ flex: 1.2, textAlign: 'right' }, amt > 0 ? s.amtBlue : s.amtZero]}>
                  {fmtAmt(amt)}
                </Text>
              </>
            ) : (
              <>
                <View style={{ flex: 1.6 }}>
                  <Text style={s.dateText}>{fmtDate(row.salary_date)}</Text>
                </View>
                <Text style={[s.dayCell, { flex: 0.8 }]}>{getDayName(row.salary_date)}</Text>
                <Text style={[{ flex: 1.2, textAlign: 'right' }, amt > 0 ? s.amtBlue : s.amtZero]}>
                  {fmtAmt(amt)}
                </Text>
                <Text style={[s.runningCell, { flex: 1.3, textAlign: 'right' }]}>
                  ₹ {running.toLocaleString('en-IN')}
                </Text>
              </>
            )}
          </View>
        );
      })}

      {/* Footer */}
      <View style={s.footer}>
        <Text style={s.footerLabel}>TOTAL</Text>
        <Text style={s.footerAmt}>
          ₹ {rows.reduce((sum, r) => sum + Number(r.salary_amount ?? 0), 0).toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card:           { backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', marginBottom: 12, shadowColor: '#1a6ef7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle:      { fontSize: 10, color: '#94a3b8', letterSpacing: 1.5, fontWeight: '700', padding: 16, paddingBottom: 10 },

  row:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  headerRow:      { backgroundColor: '#f8faff', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  dataRow:        { paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  altRow:         { backgroundColor: '#fafcff' },

  hCell:          { fontSize: 9, color: '#94a3b8', fontWeight: '700', letterSpacing: 0.8 },
  indexCell:      { fontSize: 11, color: '#cbd5e1' },

  empName:        { fontSize: 13, fontWeight: '600', color: '#0f172a' },
  empId:          { fontSize: 10, color: '#94a3b8', marginTop: 1 },
  dateText:       { fontSize: 13, fontWeight: '500', color: '#0f172a' },
  dayCell:        { fontSize: 12, color: '#94a3b8' },
  amtBlue:        { fontSize: 13, fontWeight: '700', color: '#1a6ef7' },
  amtZero:        { fontSize: 13, color: '#cbd5e1' },
  runningCell:    { fontSize: 12, color: '#94a3b8' },

  presentBadge:   { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  presentText:    { fontSize: 10, color: '#16a34a', fontWeight: '600' },
  absentBadge:    { backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  absentText:     { fontSize: 10, color: '#dc2626', fontWeight: '600' },

  footer:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#e2e8f0', backgroundColor: '#f8faff' },
  footerLabel:    { fontSize: 11, fontWeight: '700', color: '#94a3b8', letterSpacing: 1 },
  footerAmt:      { fontSize: 17, fontWeight: '800', color: '#1a6ef7' },

  emptyWrap:      { alignItems: 'center', paddingVertical: 50, backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  emptyIcon:      { fontSize: 32, marginBottom: 10, opacity: 0.4 },
  emptyText:      { color: '#94a3b8', fontSize: 13 },
});
