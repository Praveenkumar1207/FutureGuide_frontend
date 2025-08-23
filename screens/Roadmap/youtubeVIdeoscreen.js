import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '../../ThemeContext';

const { width } = Dimensions.get('window');

const YouTubeVideoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { topic = 'programming tutorials' } = route.params || {};
  console.log('YouTubeVideoScreen topic:', topic);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    header: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      paddingHorizontal: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 16,
      padding: 4,
    },
    headerTitle: {
      color: theme.textLight,
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
    },
    listContainer: {
      padding: 16,
      paddingBottom: 32,
    },
    videoCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      marginBottom: 16,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      overflow: 'hidden',
    },
    thumbnail: {
      width: '100%',
      height: 200,
    },
    videoInfo: {
      padding: 16,
    },
    videoTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
      lineHeight: 22,
    },
    channelName: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
      fontWeight: '500',
    },
    description: {
      fontSize: 14,
      color: '#888',
      lineHeight: 20,
      marginBottom: 8,
    },
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    publishDate: {
      fontSize: 12,
      color: '#999',
      fontStyle: 'italic',
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.primary,
      textAlign: 'center',
    },
    errorText: {
      fontSize: 16,
      color: theme.error,
      textAlign: 'center',
      marginVertical: 20,
      paddingHorizontal: 20,
    },
    noVideosText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginVertical: 20,
      paddingHorizontal: 20,
    },
    retryButton: {
      backgroundColor: '#FF0000',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    retryButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  // YouTube Data API v3 configuration
  const YOUTUBE_API_KEY = 'YOUR_ACTUAL_API_KEY'; // Replace with environment variable

  // Memoize search query generation
  const searchQuery = useMemo(() => {
    if (!topic) return 'programming tutorials';

    // Clean and optimize the search query
    const cleanedTopic = topic
      .replace(/Day \d+ - Day \d+/g, '') // Remove day ranges
      .replace(/YouNailedIt|Congrats!/g, '') // Remove congratulatory text
      .replace(/[^\w\s]/g, '') // Remove special characters
      .trim()
      .toLowerCase();

    // Add relevant programming keywords for better results
    const programmingKeywords = [
      'tutorial', 'learn', 'course', 'programming', 'development',
      'coding', 'beginner', 'guide', 'explained'
    ];

    // Enhance search query for better YouTube results
    return `${cleanedTopic} ${programmingKeywords.slice(0, 2).join(' ')}`;
  }, [topic]);

  const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&videoCategoryId=27&maxResults=10&order=relevance&key=AIzaSyBBs8HsjvpKgWPSLPJdURGXY2KtkePJ3CA`;
  console.log('YouTube API URL:', API_URL);
  useEffect(() => {
    fetchVideos();
  }, [searchQuery]);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if API key is available


      // Make actual API call
      const response = await fetch(API_URL);
      console.log('YouTube API response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'YouTube API error');
      }

      // Filter and validate video data
      const validVideos = data.items.filter(item =>
        item.snippet &&
        item.snippet.thumbnails &&
        item.snippet.thumbnails.medium &&
        item.id &&
        item.id.videoId
      );

      setVideos(validVideos);
    } catch (err) {
      console.error('Error fetching YouTube videos:', err);
      setError('Failed to fetch videos. Please try again.');

      // Fallback to topic-specific content
      const fallbackResponse = generateTopicBasedResponse(topic);
      setVideos(fallbackResponse.items);
    } finally {
      setLoading(false);
    }
  };

  // Generate topic-specific dummy data as fallback
  const generateTopicBasedResponse = (topic) => {
    const topicMappings = {
      'HTML, CSS & Responsive Design': [
        {
          id: { videoId: 'UB1O2G4xK1M' },
          snippet: {
            title: 'HTML & CSS Full Course - Beginner to Pro',
            description: 'Learn HTML and CSS from scratch with this comprehensive tutorial.',
            channelTitle: 'SuperSimpleDev',
            publishedAt: '2022-12-01T10:00:00Z',
            thumbnails: {
              medium: { url: 'https://i.ytimg.com/vi/UB1O2G4xK1M/mqdefault.jpg' }
            }
          }
        },
        {
          id: { videoId: 'srvUrASNj0s' },
          snippet: {
            title: 'Introduction To Responsive Web Design - HTML & CSS Tutorial',
            description: 'Learn responsive web design from scratch with HTML and CSS.',
            channelTitle: 'freeCodeCamp.org',
            publishedAt: '2019-09-18T16:19:03Z',
            thumbnails: {
              medium: { url: 'https://i.ytimg.com/vi/srvUrASNj0s/mqdefault.jpg' }
            }
          }
        }
      ],
      'JavaScript Fundamentals (ES6+)': [
        {
          id: { videoId: 'PkZNo7MFNFg' },
          snippet: {
            title: 'Learn JavaScript - Full Course for Beginners',
            description: 'This complete 134-part JavaScript tutorial for beginners will teach you everything you need to know.',
            channelTitle: 'freeCodeCamp.org',
            publishedAt: '2018-01-11T18:33:39Z',
            thumbnails: {
              medium: { url: 'https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg' }
            }
          }
        }
      ],
      'React.js Basics: Components, Props, Hooks': [
        {
          id: { videoId: 'bMknfKXIFA8' },
          snippet: {
            title: 'React Course - Beginner\'s Tutorial for React JavaScript Library',
            description: 'Learn React JS in this full course for beginners.',
            channelTitle: 'freeCodeCamp.org',
            publishedAt: '2021-12-10T17:02:27Z',
            thumbnails: {
              medium: { url: 'https://i.ytimg.com/vi/bMknfKXIFA8/mqdefault.jpg' }
            }
          }
        }
      ],
      'React Native: Setup & Core Components': [
        {
          id: { videoId: 'ur6I5m2nTvk' },
          snippet: {
            title: 'React Native Tutorial for Beginners - Build a React Native App',
            description: 'Learn React Native by building a real app step by step.',
            channelTitle: 'Programming with Mosh',
            publishedAt: '2020-01-18T15:41:12Z',
            thumbnails: {
              medium: { url: 'https://i.ytimg.com/vi/ur6I5m2nTvk/mqdefault.jpg' }
            }
          }
        }
      ],
      'Node.js & Express.js Fundamentals': [
        {
          id: { videoId: 'RLtyhwFtXQA' },
          snippet: {
            title: 'Node.js and Express.js - Full Course',
            description: 'Learn Node.js and Express.js in this comprehensive course.',
            channelTitle: 'freeCodeCamp.org',
            publishedAt: '2021-03-15T14:00:00Z',
            thumbnails: {
              medium: { url: 'https://i.ytimg.com/vi/RLtyhwFtXQA/mqdefault.jpg' }
            }
          }
        }
      ]
    };

    // Get topic-specific videos or default
    const topicVideos = topicMappings[topic] || [
      {
        id: { videoId: 'dQw4w9WgXcQ' },
        snippet: {
          title: `${topic} - Programming Tutorial`,
          description: `Learn ${topic} with this comprehensive tutorial.`,
          channelTitle: 'Programming Hub',
          publishedAt: '2023-01-01T12:00:00Z',
          thumbnails: {
            medium: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
          }
        }
      }
    ];

    return {
      kind: "youtube#searchListResponse",
      items: topicVideos
    };
  };

  const openYouTubeVideo = async (videoId) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const youtubeAppUrl = `vnd.youtube://www.youtube.com/watch?v=${videoId}`;

    try {
      // Try to open in YouTube app first
      const canOpen = await Linking.canOpenURL(youtubeAppUrl);
      if (canOpen) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        // Fallback to web browser
        await Linking.openURL(youtubeUrl);
      }
    } catch (error) {
      console.error('Error opening YouTube video:', error);
      Alert.alert('Error', 'Unable to open YouTube video');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderVideoCard = ({ item }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => openYouTubeVideo(item.id.videoId)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.snippet.thumbnails.medium.url }}
        style={styles.thumbnail}
        resizeMode="cover"
        onError={() => console.log('Image load error for:', item.snippet.title)}
      />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.snippet.title}
        </Text>
        <Text style={styles.channelName} numberOfLines={1}>
          {item.snippet.channelTitle}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {truncateText(item.snippet.description, 100)}
        </Text>
        <View style={styles.dateContainer}>
          <Text style={styles.publishDate}>
            {formatDate(item.snippet.publishedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Fetching {topic} tutorials...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && videos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={64} color="#FF0000" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchVideos}>
            <MaterialIcons name="refresh" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {topic.length > 25 ? `${topic.substring(0, 25)}...` : topic}
        </Text>
      </View>

      {videos.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialIcons name="video-library" size={64} color="#ccc" />
          <Text style={styles.noVideosText}>No tutorials found for "{topic}"</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchVideos}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideoCard}
          keyExtractor={(item, index) => item.id.videoId || index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchVideos}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
      )}
    </SafeAreaView>
  );
};



export default YouTubeVideoScreen;