import { Pressable, StyleSheet, Text, View } from 'react-native';
import './global.css';
import BoxRedBlueGreen from './src/components/BoxRedBlueGreen';
import { useState } from 'react';

const App = () => {
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('center');
  const [alignItems, setAlignItems] = useState('center');

  return (
    <View style={styles.body}>
      <Text style={styles.text}>Tugas No 1</Text>
      <BoxRedBlueGreen
        flexDirection={flexDirection as 'row' | 'column'}
        justifyContent={
          justifyContent as 'flex-start' | 'center' | 'space-between'
        }
        alignItems={alignItems as 'flex-start' | 'center' | 'flex-end'}
      />
      <Text style={styles.text}>Tugas No 2</Text>
      <Pressable
        style={styles.button}
        onPress={() =>
          setFlexDirection(prev => (prev === 'row' ? 'column' : 'row'))
        }
      >
        <Text style={styles.buttonText}>Change Direction</Text>
      </Pressable>
      <Text style={styles.text}>Tugas No 3</Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          setJustifyContent(prev => {
            if (prev === 'flex-start') return 'center';
            if (prev === 'center') return 'space-between';
            return 'flex-start';
          });
        }}
      >
        <Text style={styles.buttonText}>Change Justify Content</Text>
      </Pressable>
      <Text style={styles.text}>Tugas No 4</Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          setAlignItems(prev => {
            if (prev === 'flex-start') return 'center';
            if (prev === 'center') return 'flex-end';
            return 'flex-start';
          });
        }}
      >
        <Text style={styles.buttonText}>Change Align Items</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#A72703',
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#CD2C58',
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default App;
