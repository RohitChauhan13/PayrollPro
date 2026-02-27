// EmployeePickerModal.tsx
import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, FlatList,
  TouchableOpacity, StyleSheet, Pressable,
} from 'react-native';

export interface Employee {
  id: number;
  name: string;
  mobile: string;
  dob?: string;
  address?: string;
  status: number;
}

interface Props {
  visible: boolean;
  employees: Employee[];
  onSelect: (emp: Employee) => void;
  onClose: () => void;
}

export default function EmployeePickerModal({ visible, employees, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');

  const active   = employees.filter(e => e.status === 1);
  const filtered = active.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.mobile.includes(query)
  );

  const handleClose = () => { setQuery(''); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <Pressable style={s.backdrop} onPress={handleClose} />

      <View style={s.sheet}>
        <View style={s.handle} />

        <View style={s.titleRow}>
          <Text style={s.title}>Employee Select Karo</Text>
          <TouchableOpacity onPress={handleClose} style={s.closeBtn}>
            <Text style={s.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.countText}>{active.length} active employees</Text>

        {/* Search */}
        <View style={s.searchWrap}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Naam ya mobile number se dhundo…"
            placeholderTextColor="#94a3b8"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={s.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={s.emptyWrap}>
              <Text style={s.emptyIcon}>🙅</Text>
              <Text style={s.emptyText}>Koi employee nahi mila</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.empRow}
              onPress={() => { setQuery(''); onSelect(item); }}
              activeOpacity={0.7}
            >
              <View style={s.avatar}>
                <Text style={s.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.empName}>{item.name}</Text>
                <Text style={s.empMobile}>{item.mobile}</Text>
              </View>
              <View style={s.idBadge}>
                <Text style={s.idBadgeText}>#{item.id}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop:       { flex: 1, backgroundColor: 'rgba(15,23,42,0.4)' },
  sheet:          { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 12, maxHeight: '78%' },
  handle:         { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },

  titleRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title:          { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  closeBtn:       { padding: 4 },
  closeBtnText:   { color: '#94a3b8', fontSize: 16 },
  countText:      { fontSize: 11, color: '#94a3b8', marginBottom: 14 },

  searchWrap:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8faff', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12, borderWidth: 1, borderColor: '#dbeafe' },
  searchIcon:     { fontSize: 14, marginRight: 8 },
  searchInput:    { flex: 1, paddingVertical: 13, fontSize: 14, color: '#0f172a' },
  clearBtn:       { color: '#94a3b8', fontSize: 14, paddingLeft: 8 },

  empRow:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 12 },
  avatar:         { width: 42, height: 42, borderRadius: 21, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  avatarText:     { fontSize: 17, fontWeight: '700', color: '#1a6ef7' },
  empName:        { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  empMobile:      { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  idBadge:        { backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#bfdbfe' },
  idBadgeText:    { fontSize: 11, color: '#1a6ef7', fontWeight: '600' },

  emptyWrap:      { alignItems: 'center', paddingVertical: 40 },
  emptyIcon:      { fontSize: 32, marginBottom: 10, opacity: 0.5 },
  emptyText:      { color: '#94a3b8', fontSize: 13 },
});
