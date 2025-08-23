import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Animated,
  Alert,
  StatusBar,
  Keyboard,
  Dimensions
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { useTheme } from '../../ThemeContext';

// Chat API Base URL - Update this to your backend URL

const API_BASE_URL = 'https://futureguide-backend.onrender.com/api/chats';

// Enhanced Chat API Functions with better error handling
const chatAPI = {
  createSmartChat: async (profileId, question) => {
    try {
      console.log('=== Creating Smart Chat ===');
      console.log('Profile ID:', profileId);
      console.log('Question:', question);
      console.log('API URL:', API_BASE_URL);

      // Validate inputs before making request
      if (!profileId) {
        throw new Error('Profile ID is required but not provided');
      }
      if (!question || question.trim() === '') {
        throw new Error('Question is required but not provided');
      }

      const requestBody = {
        profileId: profileId.toString(), // Ensure it's a string
        question: question.trim()
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        console.error('HTTP Error:', response.status, response.statusText);
        console.error('Error response body:', responseText);

        // Try to parse error response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }

        throw new Error(`API Error: ${errorMessage}`);
      }

      // Try to parse successful response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed response data:', JSON.stringify(data, null, 2));

      // Validate response structure
      if (!data) {
        throw new Error('Empty response from server');
      }

      // Check if response has expected structure
      if (!data._id && !data.id) {
        console.warn('Response missing ID field:', data);
      }

      return data;

    } catch (error) {
      console.error('=== Create Chat Error ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      // Re-throw with more context
      if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
        throw new Error('Network connection failed. Please check your internet connection and try again.');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check the API URL and try again.');
      }

      throw error;
    }
  },

  sendMessageToChat: async (chatId, question) => {
    try {
      console.log('=== Sending Message to Chat ===');
      console.log('Chat ID:', chatId);
      console.log('Question:', question);

      // Validate inputs
      if (!chatId) {
        throw new Error('Chat ID is required but not provided');
      }
      if (!question || question.trim() === '') {
        throw new Error('Question is required but not provided');
      }

      const requestBody = {
        chatId: chatId.toString(),
        question: question.trim()
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        console.error('HTTP Error:', response.status, response.statusText);
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // Keep default error message
        }
        throw new Error(`API Error: ${errorMessage}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed response data:', JSON.stringify(data, null, 2));
      return data;

    } catch (error) {
      console.error('=== Send Message Error ===');
      console.error('Error:', error.message);
      throw error;
    }
  },

  getChatById: async (chatId) => {
    try {
      console.log('=== Getting Chat by ID ===');
      console.log('Chat ID:', chatId);

      if (!chatId) {
        throw new Error('Chat ID is required but not provided');
      }

      const response = await fetch(`${API_BASE_URL}/${chatId}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // Keep default error message
        }
        throw new Error(`API Error: ${errorMessage}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed response data:', JSON.stringify(data, null, 2));
      return data;

    } catch (error) {
      console.error('=== Get Chat Error ===');
      console.error('Error:', error.message);
      throw error;
    }
  }
};

// Convert API message format to UI format
const convertAPIMessageToUI = (apiMessage, index) => ({
  id: `q_${apiMessage._id || index}`,
  text: apiMessage.question,
  sender: 'user',
  timestamp: new Date().toISOString(),
});

const convertAPIAnswerToUI = (apiMessage, index) => ({
  id: `a_${apiMessage._id || index}`,
  text: apiMessage.answer,
  sender: 'ai',
  timestamp: new Date().toISOString(),
});

// Mock initial messages
const INITIAL_MESSAGES = [
  {
    id: '1',
    text: 'Hello! I\'m your AI career assistant. How can I help with your job search today?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
];

const ChatbotScreen = ({ route, navigation }) => {
  const theme = useTheme();
  
  const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },
    safeArea: {
      flex: 1,
      backgroundColor: theme.theme.background,
    },
    header: {
      paddingBottom: 20,
      paddingHorizontal: 20,
      elevation: 4,
      shadowColor: theme.theme.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      zIndex: 10,
      backgroundColor: theme.theme.primaryDark,
    },
    keyboardAvoidingView: {
      flex: 1,
      width: '100%',
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: theme.theme.primary,
    },
    headerTitleContainer: {
      flex: 1,
      marginLeft: 12,
    },
    headerTitle: {
      color: theme.theme.textLight,
      fontSize: 18,
      fontWeight: 'bold',
    },
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 13,
    },
    menuButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: theme.theme.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.theme.background,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.theme.textMedium,
    },
    container: {
      flex: 1,
      width: '100%',
    },
    chatContainer: {
      flex: 1,
      backgroundColor: theme.theme.background,
    },
    messageList: {
      padding: 16,
      paddingTop: 24,
      paddingBottom: 16,
    },
    messageRow: {
      flexDirection: 'row',
      marginBottom: 16,
      alignItems: 'flex-end',
    },
    userRow: {
      justifyContent: 'flex-end',
    },
    aiRow: {
      justifyContent: 'flex-start',
    },
    avatarContainer: {
      width: 36,
      height: 36,
      marginHorizontal: 8,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userAvatar: {
      backgroundColor: theme.theme.accent,
    },
    userAvatarText: {
      color: theme.theme.textLight,
      fontWeight: 'bold',
      fontSize: 14,
    },
    messageBubble: {
      borderRadius: 20,
      padding: 12,
      maxWidth: '70%',
      elevation: 1,
      shadowColor: theme.theme.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
    },
    lastMessage: {
      elevation: 2,
      shadowOpacity: 0.15,
    },
    userBubble: {
      backgroundColor: theme.theme.primary,
      borderBottomRightRadius: 4,
      marginLeft: 40,
    },
    aiBubble: {
      backgroundColor: theme.theme.surface,
      borderBottomLeftRadius: 4,
      marginRight: 40,
    },
    messageText: {
      fontSize: 16,
      lineHeight: 22,
    },
    userText: {
      color: theme.theme.textLight,
    },
    aiText: {
      color: theme.theme.textDark,
    },
    timestamp: {
      fontSize: 10,
      marginTop: 4,
      textAlign: 'right',
    },
    userTimestamp: {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    aiTimestamp: {
      color: theme.theme.textMuted,
    },
    typingContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginLeft: 16,
      marginBottom: 16,
    },
    typingBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.theme.surface,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      elevation: 1,
      shadowColor: theme.theme.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
    },
    typingDot: {
      height: 8,
      width: 8,
      borderRadius: 4,
      backgroundColor: theme.theme.textMedium,
      marginHorizontal: 3,
      opacity: 0.6,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 12,
      backgroundColor: theme.theme.surface,
      borderTopWidth: 1,
      borderTopColor: theme.theme.border,
      alignItems: 'flex-end',
      width: '100%',
    },
    attachButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 22,
    },
    textInputContainer: {
      flex: 1,
      backgroundColor: theme.theme.background,
      borderRadius: 24,
      paddingHorizontal: 16,
      marginHorizontal: 8,
      borderWidth: 1,
      borderColor: theme.theme.border,
    },
    input: {
      paddingVertical: 12,
      fontSize: 16,
      color: theme.theme.textDark,
      maxHeight: 120,
    },
    sendButton: {
      backgroundColor: theme.theme.accent,
      borderRadius: 22,
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: theme.theme.primaryDark,
      opacity: 0.6,
    },
  });
  // Extract both chatId and profileId from route params
  const {
    conversation,
    chatId,
    profileId = "685930d384b4ad17b6cd5e35"
  } = route.params || {};

  console.log('=== ChatbotScreen Initialized ===');
  console.log('Route params:', route.params);
  console.log('Profile ID:', profileId);
  console.log('Chat ID:', chatId);
  console.log('Conversation:', conversation);

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [currentChatId, setCurrentChatId] = useState(chatId || conversation?.id || null);
  const [chatName, setChatName] = useState('AI Assistant');
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Listen for keyboard events to adjust UI
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // Load existing chat messages if chatId is provided
  useEffect(() => {
    const loadChatMessages = async () => {
      const targetChatId = chatId || conversation?.id;

      if (targetChatId) {
        try {
          setIsLoading(true);
          setError(null);

          console.log('Loading chat with ID:', targetChatId);
          const chatData = await chatAPI.getChatById(targetChatId);

          console.log('Loaded chat data:', chatData);

          // Convert API messages to UI format
          const uiMessages = [];
          if (chatData.messages && chatData.messages.length > 0) {
            chatData.messages.forEach((msg, index) => {
              uiMessages.push(convertAPIMessageToUI(msg, index));
              uiMessages.push(convertAPIAnswerToUI(msg, index));
            });
          }

          // Set messages (include initial greeting if no messages exist)
          if (uiMessages.length > 0) {
            setMessages([...INITIAL_MESSAGES, ...uiMessages]);
          } else {
            setMessages(INITIAL_MESSAGES);
          }

          // Update chat metadata
          setCurrentChatId(chatData._id);
          setChatName(chatData.chatName || 'AI Assistant');
          navigation.setOptions({
            title: chatData.chatName || 'AI Assistant'
          });

        } catch (err) {
          console.error('Error loading chat:', err);
          setError('Failed to load chat history');
          Alert.alert(
            'Error',
            'Failed to load chat history. You can still start a new conversation.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setCurrentChatId(null);
                  setMessages(INITIAL_MESSAGES);
                }
              }
            ]
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('No chat ID provided, starting fresh chat');
        setMessages(INITIAL_MESSAGES);
        setCurrentChatId(null);
        setChatName('AI Assistant');
      }
    };

    loadChatMessages();
  }, [chatId, conversation]);

  // Memoized ChatMessage component to prevent unnecessary re-renders
  const ChatMessage = React.memo(({ message, isLast }) => {
    const isUser = message.sender === 'user';
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.messageRow,
          isUser ? styles.userRow : styles.aiRow,
          { opacity: fadeAnim }
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialIcons name="android" size={20} color={theme.textLight} />
            </View>
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
            isLast && styles.lastMessage
          ]}
        >
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : styles.aiText
          ]}>
            {message.text}
          </Text>
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.aiTimestamp
          ]}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {isUser && (
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, styles.userAvatar]}>
              <Text style={styles.userAvatarText}>JD</Text>
            </View>
          </View>
        )}
      </Animated.View>
    );
  });

  // Memoized TypingIndicator component
  const TypingIndicator = React.memo(() => (
    <View style={styles.typingContainer}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <MaterialIcons name="android" size={20} color={theme.primary} />
        </View>
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.typingDot} />
        <View style={styles.typingDot} />
        <View style={styles.typingDot} />
      </View>
    </View>
  ));

  const sendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    console.log('=== Sending Message ===');
    console.log('Current chat ID:', currentChatId);
    console.log('Profile ID:', profileId);
    console.log('Input text:', inputText);

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    const questionText = inputText;
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      let response;

      if (currentChatId) {
        // Send message to existing chat
        console.log('Sending message to existing chat:', currentChatId);
        response = await chatAPI.sendMessageToChat(currentChatId, questionText);
      } else {
        // Create new chat
        console.log('Creating new chat for profile:', profileId);

        // Validate profileId before making request
        if (!profileId) {
          throw new Error('Profile ID is required to create a new chat. Please make sure you are logged in properly.');
        }

        console.log('Profile ID type:', typeof profileId);
        console.log('Profile ID value:', profileId);

        response = await chatAPI.createSmartChat(profileId, questionText);

        console.log('New chat created:', response);

        // Update chat metadata for new chat
        if (response && (response._id || response.id)) {
          const newChatId = response._id || response.id;
          setCurrentChatId(newChatId);
          setChatName(response.chatName || 'AI Assistant');
          navigation.setOptions({
            title: response.chatName || 'AI Assistant'
          });
          console.log('Chat metadata updated, new ID:', newChatId);
        } else {
          console.warn('Response missing ID field:', response);
        }
      }

      console.log('API response received:', response);

      // Validate response structure
      if (!response) {
        throw new Error('No response received from server');
      }

      if (!response.messages || !Array.isArray(response.messages)) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response format: missing messages array');
      }

      if (response.messages.length === 0) {
        throw new Error('No messages in response');
      }

      // Get the latest message (last in the array)
      const latestMessage = response.messages[response.messages.length - 1];

      if (!latestMessage) {
        throw new Error('Latest message is null or undefined');
      }

      if (!latestMessage.answer) {
        console.error('Latest message structure:', latestMessage);
        throw new Error('Missing answer in latest message');
      }

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: latestMessage.answer,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      console.log('Adding AI response to messages:', aiResponse);
      setMessages(prev => [...prev, aiResponse]);

    } catch (err) {
      console.error('=== Send Message Error ===');
      console.error('Error details:', err);
      setError('Failed to send message');

      // Provide more specific error messages
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      let technicalDetails = err.message;

      if (err.message.includes('Profile ID is required')) {
        errorMessage = 'Authentication error. Please log out and log back in.';
      } else if (err.message.includes('Network connection failed')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (err.message.includes('Unable to connect to server')) {
        errorMessage = 'Cannot reach server. Please try again later.';
      } else if (err.message.includes('API Error')) {
        errorMessage = 'Server error occurred. Please try again.';
      } else if (err.message.includes('Invalid JSON')) {
        errorMessage = 'Server response error. Please try again.';
      } else if (err.message.includes('Invalid response format')) {
        errorMessage = 'Server returned invalid data. Please try again.';
      }

      // Add error message to chat
      const errorMessageObj = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessageObj]);

      // Show detailed error to user
      Alert.alert(
        'Error',
        `${errorMessage}\n\nTechnical details: ${technicalDetails}`,
        [
          { text: 'OK' },
          {
            text: 'Retry',
            onPress: () => {
              setInputText(questionText);
            }
          }
        ]
      );
    } finally {
      setIsTyping(false);
    }
  };

  const saveConversation = () => {
    navigation.navigate('History');
  };

  const speakLastAIResponse = () => {
    const lastAI = [...messages].reverse().find(m => m.sender === 'ai');
    if (!lastAI) return;

    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.stop();
      setIsSpeaking(true);
      Speech.speak(lastAI.text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 1.0,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    }
  };

  // Auto-scroll to bottom when messages change (instead of on every layout)
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Pre-calculate dynamic styles to avoid inline calculations
  const dynamicChatContainerStyle = keyboardHeight > 0 && Platform.OS === 'android' 
    ? { paddingBottom: 8 } 
    : {};

  const dynamicInputContainerStyle = Platform.OS === 'android' && keyboardHeight > 0
    ? { paddingBottom: 8 }
    : {};

  const dynamicHeaderStyle = { paddingTop: insets.top || 16 };

  // Show loading indicator while loading chat
  if (isLoading) {
    return (
      <View style={styles.outerContainer}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent={true}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.header, dynamicHeaderStyle]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color={theme.textLight} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Loading...</Text>
              <Text style={styles.headerSubtitle}>Please wait</Text>
            </View>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={styles.loadingText}>Loading chat history...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, dynamicHeaderStyle]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.textLight} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {chatName}
            </Text>
            <Text style={styles.headerSubtitle}>
              {error ? 'Connection Error' : currentChatId ? 'Chat Loaded' : 'New Chat'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.menuButton, { marginRight: 8 }]}
              onPress={speakLastAIResponse}
            >
              <MaterialCommunityIcons
                name={isSpeaking ? "volume-off" : "volume-high"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={saveConversation}>
              <MaterialIcons name="history" size={24} color={theme.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 30}
        >
          <View style={[styles.chatContainer, dynamicChatContainerStyle]}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <ChatMessage
                  message={item}
                  isLast={index === messages.length - 1}
                />
              )}
              contentContainerStyle={[
                styles.messageList,
                messages.length > 5 && { paddingBottom: 8 }
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
            />

            {isTyping && <TypingIndicator />}
          </View>

          <View style={[styles.inputContainer, dynamicInputContainerStyle]}>
            <TouchableOpacity style={styles.attachButton}>
              <MaterialIcons name="attach-file" size={24} color={theme.textMedium} />
            </TouchableOpacity>

            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                multiline
                maxLength={500}
                placeholderTextColor="#AAA"
                editable={!isTyping}
                onFocus={() => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }, 200);
                }}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isTyping) && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isTyping}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color={theme.textLight} />
              ) : (
                <MaterialIcons
                  name={inputText.trim() ? "send" : "mic"}
                  size={22}
                  color={theme.textLight}
                />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ChatbotScreen;