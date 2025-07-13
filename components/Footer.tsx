import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Powered by AI • All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#f4f4f7',
    borderTopWidth: 1,
    borderTopColor: '#ececec',
  },
  text: {
    color: '#888',
    fontSize: 13,
    letterSpacing: 0.2,
  },
}); 