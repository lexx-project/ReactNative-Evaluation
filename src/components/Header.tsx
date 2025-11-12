import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStack';

type HeaderProps = {
  count?: number;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onCartPress?: () => void;
  onMenuPress?: () => void;
  onAddPress?: () => void;
};

export default function Header({
  count = 0,
  searchValue = '',
  onSearchChange,
  onMenuPress,
  onAddPress,
}: HeaderProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchPress = () => {
    setIsSearching(prev => {
      if (prev && onSearchChange) {
        onSearchChange('');
      }
      return !prev;
    });
  };

  const handleSearchTextChange = (text: string) => {
    if (onSearchChange) {
      onSearchChange(text);
    }
  };

  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const onCartPress = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      navigation.navigate('Checkout');
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <Pressable onPress={onMenuPress} style={styles.iconButton}>
          <FontAwesome name="bars" size={22} color="#fff" />
        </Pressable>

        <Text style={styles.logoText}>Lexx Store</Text>

        <View style={styles.actions}>
          {onAddPress && (
            <Pressable onPress={onAddPress} style={styles.iconButton}>
              <FontAwesome name="plus" size={22} color="#fff" />
            </Pressable>
          )}

          <Pressable onPress={handleSearchPress} style={styles.iconButton}>
            <Image
              source={{
                uri: 'https://upload.lexxganz.my.id/uploads/search.png',
              }}
              style={styles.icon}
            />
          </Pressable>

          <Pressable style={styles.cartWrapper} onPress={onCartPress}>
            <Image
              source={{
                uri: 'https://upload.lexxganz.my.id/uploads/cart%20(1).png',
              }}
              style={styles.icon}
            />
            {count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {count > 99 ? '99+' : count}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {isSearching && (
        <View style={styles.searchWrapper}>
          <Image
            source={{ uri: 'https://upload.lexxganz.my.id/uploads/search.png' }}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari produk apa hari ini?"
            placeholderTextColor="#7a7f87"
            value={searchValue}
            onChangeText={handleSearchTextChange}
            autoFocus
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#1e90ff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    padding: 6,
  },
  logoText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  cartWrapper: {
    position: 'relative',
    padding: 6,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#1e90ff',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#1e2530',
    fontSize: 16,
  },
});
