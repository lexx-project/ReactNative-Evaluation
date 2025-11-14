import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';

type GlobalErrorBoundaryProps = {
  children: React.ReactNode;
  onReset?: () => void;
};

type GlobalErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export default class GlobalErrorBoundary extends React.Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(
      'GlobalErrorBoundary menangkap error:',
      error,
      errorInfo.componentStack,
    );
  }

  handleReset() {
    this.setState({ hasError: false, error: null }, () => {
      this.props.onReset?.();
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle}>
            Aplikasi mengalami masalah tak terduga.
          </Text>
          {this.state.error?.message ? (
            <Text style={styles.fallbackSubtitle}>
              {this.state.error.message}
            </Text>
          ) : null}
          <Pressable style={styles.resetButton} onPress={this.handleReset}>
            <Text style={styles.resetButtonText}>Mulai Ulang Aplikasi</Text>
          </Pressable>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f7fb',
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  fallbackSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 8,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#1e90ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
