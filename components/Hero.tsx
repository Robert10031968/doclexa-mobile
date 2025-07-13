import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Hero() {
  const handleStart = () => {
    console.log('Start pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DocLexa</Text>
      <Text style={styles.subtitle}>Understand any document with AI-powered clarity.</Text>
      <View style={styles.buttonWrapper}>
        <Button title="Start Analyzing" onPress={handleStart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 8,
  },
}); 