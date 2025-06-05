import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar as ExpoStatusBar, // Renamed to avoid conflict with StatusBar component from expo-status-bar
} from 'react-native';
import { Feather } from '@expo/vector-icons'; // Using Feather icons for the send button

// Initial messages, slightly adapted for mobile context
const messagesInitial = [
  {
    id: '1',
    sender: 'assistant',
    text: 'مرحبًا! أنا مساعد Same AI البرمجي. كيف يمكنني مساعدتك اليوم في تطبيق الجوال هذا؟',
  },
  {
    id: '2',
    sender: 'assistant',
    text: 'يمكنك أن تطلب مني المساعدة في تصميم الواجهات، كتابة الأكواد، تصحيح الأخطاء، أو حتى الإجابة على أسئلتك البرمجية العامة.',
  },
];

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>(messagesInitial);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList<Message> | null>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: input,
    };

    let assistantResponseText = 'شكرًا لك! أقوم بمعالجة طلبك الآن...';
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('تصميم') || lowerInput.includes('design')) {
      assistantResponseText =
        'بالتأكيد! يمكنني المساعدة في التصميم. صف لي ما الذي تفكر فيه؟ ما هي الألوان أو الأسلوب الذي تفضله لتطبيق الجوال؟';
    } else if (lowerInput.includes('انسخ') || lowerInput.includes('copy') || lowerInput.includes('clone')) {
      assistantResponseText =
        'حسنًا، يمكنني محاولة نسخ الواجهة. هل لديك صورة للتصميم الذي تريد نسخه لتطبيق الجوال؟';
    } else if (
      lowerInput.includes('كود') ||
      lowerInput.includes('code') ||
      lowerInput.includes('أنشئ') ||
      lowerInput.includes('create') ||
      lowerInput.includes('اكتب') ||
      lowerInput.includes('write')
    ) {
      assistantResponseText =
        'أنا جاهز لكتابة الكود! ما هي اللغة أو التقنية (React Native, Swift, Kotlin, etc.) التي تريد استخدامها، وما هي وظيفة الكود المطلوبة؟';
    } else if (lowerInput.includes('خطأ') || lowerInput.includes('debug') || lowerInput.includes('error') || lowerInput.includes('صحح')) {
      assistantResponseText =
        'لا مشكلة، يمكنني المساعدة في تصحيح الأخطاء. فضلاً، الصق الكود الذي به مشكلة أو صف الخطأ الذي يظهر لك في تطبيق الجوال.';
    } else if (lowerInput.includes('سؤال') || lowerInput.includes('question') || lowerInput.includes('كيف') || lowerInput.includes('what') || lowerInput.includes('how')) {
      assistantResponseText =
        'هذا سؤال جيد! سأحاول الإجابة عليه. ما هو سؤالك بالتحديد في سياق تطوير تطبيقات الجوال؟';
    } else {
      assistantResponseText = 'تم استلام رسالتك! أفكر في أفضل طريقة لمساعدتك... (هنا سيظهر رد الذكاء الاصطناعي الحقيقي)';
    }

    const assistantMessage: Message = {
      id: String(Date.now() + 1),
      sender: 'assistant',
      text: assistantResponseText,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage, assistantMessage]);
    setInput('');
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed
      >
        <View style={styles.appContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Same AI Coding Assistant</Text>
            <Text style={styles.headerSubtitle}>مساعدك البرمجي الذكي للجوال</Text>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
          />

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="اكتب سؤالك البرمجي هنا..."
              placeholderTextColor="#A0A0A0" // Lighter placeholder text
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend} // Send on keyboard submit
              blurOnSubmit={false} // Keep keyboard open on submit for quick follow-ups if needed
              textAlign="right" // For RTL text input
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Feather name="send" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212', // Dark background for the safe area
  },
  container: {
    flex: 1,
  },
  appContainer: {
    flex: 1,
    backgroundColor: 'rgba(24, 28, 43, 0.85)', // Main app container background (glassmorphism base)
    margin: Platform.OS === 'ios' ? 8 : 5, // Slightly less margin on Android
    borderRadius: 20,
    overflow: 'hidden', // Crucial for border radius to apply to children
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border for glass effect
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(35, 41, 70, 0.7)', // Header background (slightly different for depth)
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
    marginTop: 4,
    textAlign: 'center',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageListContent: {
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  userMessage: {
    backgroundColor: '#007AFF', // Blue for user messages
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
    marginRight: 5,
  },
  assistantMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Lighter, semi-transparent for assistant
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    marginLeft: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'left', // Default to left, RTL handled by TextInput for user input
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(35, 41, 70, 0.7)', // Input area background
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 25, // Circular button
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
