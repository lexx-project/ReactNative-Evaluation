import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const DEFAULT_USER = {
  name: 'Lexy Evandra',
  email: 'lexx@gmail.com',
  avatar: 'https://upload.lexxganz.my.id/uploads/my.png',
};

const EMPTY_USER = {
  name: '',
  email: '',
  avatar: '',
};

type MenuItem = {
  label: string;
  targetTab: 'Beranda' | 'Pengaturan' | 'Riwayat';
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Beranda', targetTab: 'Beranda' },
  { label: 'Pengaturan', targetTab: 'Pengaturan' },
  { label: 'Riwayat', targetTab: 'Riwayat' },
];

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { status, logout } = useAuth();
  const isAuthenticated = status === 'authenticated';

  const user = isAuthenticated ? DEFAULT_USER : EMPTY_USER;

  const activeTab = props.state.routes[props.state.index].name;

  const displayName = user.name || 'Guest';
  const displayEmail = user.email || 'user@example.com';

  const handleAuthToggle = () => {
    props.navigation.closeDrawer();
    logout(() => {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' as never }],
        }),
      );
    });
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>?</Text>
            </View>
          )}

          <View style={styles.textContainer}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{displayEmail}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>MENU</Text>
        </View>

        <View style={styles.items}>
          {MENU_ITEMS.map(item => {
            const isActive = activeTab === item.targetTab;

            return (
              <Pressable
                key={item.targetTab}
                onPress={() => {
                  props.navigation.navigate(item.targetTab);
                }}
                style={[
                  styles.menuItem,
                  isActive ? styles.menuItemActive : undefined,
                ]}
              >
                <Text
                  style={[
                    styles.menuLabel,
                    isActive ? styles.menuLabelActive : undefined,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.logoutButton} onPress={handleAuthToggle}>
          <Image
            source={{
              uri: 'https://upload.lexxganz.my.id/uploads/logout.png',
            }}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>
            {isAuthenticated ? 'Logout' : 'Login'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#94a3b8',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: '#cbd5f5',
    fontSize: 24,
    fontWeight: '600',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
  },
  email: {
    fontSize: 13,
    color: '#cbd5f5',
    marginTop: 4,
  },
  sectionHeader: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    letterSpacing: 1,
    color: '#94a3b8',
  },
  items: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 4,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  menuItemActive: {
    backgroundColor: '#e2e8f0',
  },
  menuLabel: {
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '500',
  },
  menuLabelActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  logoutIcon: {
    width: 20,
    height: 20,
    tintColor: '#475569',
  },
  logoutText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },
});
