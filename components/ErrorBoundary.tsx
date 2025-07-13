import React, { Component, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: '#F0FDF4',
          padding: 20
        }}>
          <Text style={{ 
            fontSize: 18, 
            color: '#EF4444', 
            textAlign: 'center', 
            marginBottom: 16,
            fontWeight: 'bold'
          }}>
            Something went wrong
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: '#64748B', 
            textAlign: 'center',
            marginBottom: 20
          }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Pressable
            style={{
              backgroundColor: '#2563EB',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8
            }}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Try Again
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
} 