import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationThreadProps {
  messages: Message[];
  t: (key: string) => string;
}

const ConversationThread: React.FC<ConversationThreadProps> = ({ messages, t }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  return (
    <View style={styles.conversationContainer}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.conversationScroll}
        contentContainerStyle={styles.conversationContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.length === 0 ? (
          <Text style={styles.conversationPlaceholder}>{t('messages.placeholder')}</Text>
        ) : (
          messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.role === 'user' ? styles.userText : styles.assistantText,
                ]}
              >
                {msg.content}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  conversationContainer: {
    flex: 1,
    minHeight: 200,
    maxHeight: 350,
    backgroundColor: '#F8F9FB',
    borderRadius: 16,
    marginVertical: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  conversationScroll: {
    flex: 1,
  },
  conversationContent: {
    paddingVertical: 8,
    gap: 8,
  },
  conversationPlaceholder: {
    color: '#A0AEC0',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userText: {
    color: '#222',
  },
  assistantText: {
    color: '#444',
  },
});

export default ConversationThread; 