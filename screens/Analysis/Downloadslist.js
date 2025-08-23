// Final updated Downloadslist.js with useTheme

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const profileId = '6851040cd76f99883f82f90c';

export default function Downloadslist() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        `https://futureguide-backend.onrender.com/api/analyses/profile/${profileId}`
      );
      setFiles(response.data.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      Alert.alert('Error', 'Failed to fetch files.');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDownloadPDF = async (item, index) => {
    try {
      const htmlContent = `
  <html>
    <head>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          color: #333;
          background-color: #f9f9f9;
        }
        .container {
          margin: 40px;
          padding: 20px;
          border: 2px solid #ccc;
          border-radius: 10px;
          background-color: #fff;
          height:87%;
        }
        h1 { margin-bottom: 16px; color: #2c3e50; }
        h3 { margin-top: 24px; color: #34495e; }
        ul { padding-left: 20px; }
        li { margin-bottom: 6px; }
        p { margin: 4px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Resume Analysis - Demo ${index + 1}</h1>
        <p><strong>Profile ID:</strong> ${item.profileId}</p>
        <p><strong>Score:</strong> ${item.score}/100</p>
        <h3>Analysis Breakdown:</h3>
        <ul>${item.analysis.map(line => `<li>${line}</li>`).join('')}</ul>
        <h3>Suggestions:</h3>
        <ul>${item.suggestions.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>
    </body>
  </html>
`;
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('❌ Error creating PDF:', error);
      Alert.alert('Error', 'Could not generate or share the PDF.');
    }
  };

  const handleDelete = async (id) => {
    try {
      Alert.alert('Delete Confirmation', 'Are you sure you want to delete this file?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await axios.delete(`https://futureguide-backend.onrender.com/api/analyses/${id}`);
            fetchFiles();
          },
        },
      ]);
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      Alert.alert('Error', 'Failed to delete the file.');
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.cardContainer, { backgroundColor: theme.surface }]}> 
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={[styles.cardTitle, { color: theme.textDark }]}>Demo {index + 1}</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textMedium }]}>{item.timestamp}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleDownloadPDF(item, index)}>
            <Icon name="cloud-download-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Icon name="delete-outline" size={24} color="#FF5252" style={{ marginLeft: 16 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { paddingTop: insets.top || 26, backgroundColor: theme.primary }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.textLight} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textLight, backgroundColor: theme.primary }]}>Saved Records</Text>
        </View>
        <View style={styles.searchContainer1}>
          <FlatList
            data={files}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={{ color: theme.textDark }}>No files found.</Text>}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingBottom: 10,
    paddingHorizontal: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    // backgroundColor:theme.primary,
  },
  searchContainer1: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
