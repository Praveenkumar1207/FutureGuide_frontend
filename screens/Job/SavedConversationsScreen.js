import React, { useState, useEffect } from 'react';

import { 

  View, 

  Text, 

  StyleSheet, 

  FlatList, 

  TouchableOpacity, 

  SafeAreaView,

  StatusBar,

  Alert 

} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

import { useTheme } from '../../ThemeContext';


const ConversationCard = ({ conversation, onPress, styles, theme }) => {
  const formatTimestamp = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleDateString() : 'Recently';
  };

  const getLastMessage = (messages) => {
    if (messages && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      return lastMsg.question || lastMsg.answer || 'No messages';
    }
    return 'continue the conversation';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{conversation.chatName || 'Untitled Chat'}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {getLastMessage(conversation.messages)}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={theme.textDark} />
    </TouchableOpacity>
  );
};

const SavedConversationsScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const profileId = route?.params?.profileId || '685930d384b4ad17b6cd5e35';
  
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerContainer: {
      backgroundColor: theme.primary,
      paddingTop: 16,
      paddingBottom: 20,
      paddingHorizontal: 20,
      elevation: 4,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: theme.buttonOverlay,
    },
    placeholder: {
      width: 40,
    },
    headerTitle: {
      color: theme.textLight,
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContent: {
      padding: 16,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 16,
      marginVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
    },
    content: {
      flex: 1,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textDark,
    },
    timestamp: {
      fontSize: 12,
      color: theme.textMuted
    },
    message: {
      fontSize: 14,
      color: theme.textMedium,
    },
    emptyText: {
      fontSize: 18,
      color: theme.textMuted,
      marginTop: 16,
      fontWeight: '600',
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.textMuted,
      marginTop: 8,
      textAlign: 'center',
    },
  });
  
  const fetchSavedConversations = async () => {
    try {
      const response = await fetch(`https://futureguide-backend.onrender.com/api/chats/profiles/${profileId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await fetchSavedConversations();
        setConversations(data || []);
      } catch (error) {
        Alert.alert('Error', `Failed to load conversations: ${error.message}`);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [profileId]);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={theme.primary} translucent={false} barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Conversations</Text>
        <View style={styles.placeholder} />
      </View>
      
      {loading ? (
        <View style={styles.centerContent}>
          <Text>Loading conversations...</Text>
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.centerContent}>
          <MaterialIcons name="chat" size={64} color={theme.textMuted} />
          <Text style={styles.emptyText}>No saved conversations yet</Text>
          <Text style={styles.emptySubtext}>Start a conversation with the AI assistant</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ConversationCard 
              conversation={item} 
              styles={styles}
              theme={theme}
              onPress={() => navigation.navigate('AI Assistant', { 
                conversation: { id: item._id, name: item.chatName },
              })}
            />
          )
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

export default SavedConversationsScreen;