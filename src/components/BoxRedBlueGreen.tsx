import { StyleSheet, View } from 'react-native';

interface BoxRedBlueGreenProps {
  flexDirection: 'row' | 'column';
  justifyContent: 'flex-start' | 'center' | 'space-between';
  alignItems: 'flex-start' | 'center' | 'flex-end';
}

export default function BoxRedBlueGreen({
  flexDirection,
  justifyContent,
  alignItems,
}: BoxRedBlueGreenProps) {
  const isRow = flexDirection === 'row';

  return (
    <View
      style={[
        styles.container,
        isRow ? styles.containerRow : styles.containerColumn,
        { flexDirection, justifyContent, alignItems },
      ]}
    >
      <View style={styles.boxRed}></View>
      <View style={styles.boxBlue}></View>
      <View style={styles.boxGreen}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
    gap: 20,
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  containerRow: {
    height: 220,
    alignSelf: 'stretch',
  },
  containerColumn: {
    minHeight: 220,
    width: '100%',
    alignSelf: 'center',
  },
  boxRed: {
    width: 90,
    height: 90,
    backgroundColor: 'red',
    borderRadius: 12,
  },
  boxBlue: {
    width: 90,
    height: 90,
    backgroundColor: 'blue',
    borderRadius: 12,
  },
  boxGreen: {
    width: 90,
    height: 90,
    backgroundColor: 'green',
    borderRadius: 12,
  },
});
