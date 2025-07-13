import React from 'react';
import { StyleSheet, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatureCard from './FeatureCard';

export default function Features() {
  return (
    <View style={styles.container}>
      <FeatureCard
        icon={<Ionicons name="ios-brain" size={36} color="#4F8EF7" />}
        title="AI-Powered Insights"
        description="Get instant, intelligent analysis of your documents using advanced AI."
      />
      <FeatureCard
        icon={<Feather name="shield" size={36} color="#34C759" />}
        title="Secure & Private"
        description="Your data stays safe and confidential with industry-leading security."
      />
      <FeatureCard
        icon={<Feather name="zap" size={36} color="#FFB300" />}
        title="Lightning Fast"
        description="Analyze documents in seconds, not minutes."
      />
      <FeatureCard
        icon={<Ionicons name="ios-document-text" size={36} color="#A259FF" />}
        title="Universal Format Support"
        description="Works with PDFs, images, and more—no conversion needed."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    marginTop: 8,
  },
}); 