// Clean Modern Home Page UI - Simple & Elegant
// ✅ Better layout, spacing, and visual design without overengineering

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import Bells from "react-native-vector-icons/MaterialCommunityIcons";
import Arrow from "react-native-vector-icons/Ionicons";
import Colors from '../../constants/Colors';
import Swiper from 'react-native-slick';
import { useLogin } from "../../Login_id_passing";
import { useTheme } from "../../ThemeContext";
import axios from "axios";

const { width } = Dimensions.get('window');

export default function Home_page({ navigation }) {
  const [greeting, setGreeting] = React.useState("Good Morning");
  const { loginId } = useLogin();
  const { theme } = useTheme();
  const trendingTags = [
    "React Native", "Flutter", "Next.js", "Node.js", "MongoDB",
    "Python", "AI/ML", "TypeScript", "AWS", "Firebase", "Tailwind CSS", "Docker"
  ];
  const [selectedTech, setSelectedTech] = React.useState('React Native');
  const [image, setimage] = useState(require('../../Images/logo.jpg'))
  const [nickname, setNickname] = useState("Job Seeker")


  useEffect(() => {
    axios.get(`https://futureguide-backend.onrender.com/api/profiles/${loginId.login_id}`)
      .then((response) => {
        // console.log(response.data.Profile_image_path);
        // setProfileData({ ...response.data })
        if (response.data.Profile_image_path) {
          setimage({ uri: response.data.Profile_image_path });
        } else {
          setimage(require('../../Images/logo.jpg'));
        }

        if (response.data.nickname) {
          setNickname(response.data.nickname);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  const techData = {
    "React Native": {
      icon: "phone-portrait-outline",
      title: "React Native",
      description: "Build native mobile apps using React. Create cross-platform applications with a single codebase for iOS and Android.",
      features: ["Cross-Platform", "Hot Reload", "Native Performance", "Large Community"],
      color: "#61DAFB"
    },
    "Flutter": {
      icon: "phone-portrait-outline",
      title: "Flutter",
      description: "Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
      features: ["Fast Development", "Beautiful UI", "Single Codebase", "Hot Reload"],
      color: "#02569B"
    },
    "Next.js": {
      icon: "globe-outline",
      title: "Next.js",
      description: "The React framework for production. Build full-stack web applications with server-side rendering and static generation.",
      features: ["SSR/SSG", "API Routes", "Image Optimization", "TypeScript Support"],
      color: "#000000"
    },
    "Node.js": {
      icon: "server-outline",
      title: "Node.js",
      description: "JavaScript runtime built on Chrome's V8 engine. Build scalable network applications and server-side solutions.",
      features: ["Event-Driven", "Non-Blocking I/O", "NPM Ecosystem", "Real-time Apps"],
      color: "#339933"
    },
    "MongoDB": {
      icon: "library-outline",
      title: "MongoDB",
      description: "NoSQL document database that provides high performance, high availability, and easy scalability for modern applications.",
      features: ["Document-Based", "Flexible Schema", "Horizontal Scaling", "Rich Queries"],
      color: "#47A248"
    },
    "Python": {
      icon: "code-slash-outline",
      title: "Python",
      description: "Powerful programming language for web development, data science, AI, automation, and more. Easy to learn and versatile.",
      features: ["Easy Syntax", "Versatile", "Large Libraries", "AI/ML Ready"],
      color: "#3776AB"
    },
    "AI/ML": {
      icon: "cog-outline",
      title: "AI/ML",
      description: "Artificial Intelligence and Machine Learning technologies. Build intelligent systems that can learn and make decisions.",
      features: ["Neural Networks", "Deep Learning", "Predictive Models", "Automation"],
      color: "#FF6B35"
    },
    "TypeScript": {
      icon: "code-outline",
      title: "TypeScript",
      description: "Typed superset of JavaScript that compiles to plain JavaScript. Add static type checking to catch errors early.",
      features: ["Type Safety", "Better IDE Support", "Refactoring", "JavaScript Compatible"],
      color: "#3178C6"
    },
    "AWS": {
      icon: "cloud-outline",
      title: "AWS",
      description: "Amazon Web Services provides reliable, scalable, and inexpensive cloud computing services and infrastructure.",
      features: ["Scalable", "Cost-Effective", "Global Infrastructure", "200+ Services"],
      color: "#FF9900"
    },
    "Firebase": {
      icon: "flame-outline",
      title: "Firebase",
      description: "Google's platform for building web and mobile applications. Provides backend services, hosting, and analytics.",
      features: ["Real-time Database", "Authentication", "Hosting", "Analytics"],
      color: "#FFCA28"
    },
    "Tailwind CSS": {
      icon: "color-palette-outline",
      title: "Tailwind CSS",
      description: "Utility-first CSS framework for rapidly building custom user interfaces without writing custom CSS.",
      features: ["Utility Classes", "Responsive Design", "Customizable", "Small Bundle Size"],
      color: "#06B6D4"
    },
    "Docker": {
      icon: "cube-outline",
      title: "Docker",
      description: "Platform for developing, shipping, and running applications using containerization technology.",
      features: ["Containerization", "Portability", "Microservices", "DevOps Integration"],
      color: "#2496ED"
    }
  };

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleCategoryPress = (screen, params) => {
    navigation.navigate('RoadmapLoader', {
      targetScreen: screen,
      targetParams: params
    });
  };

  useEffect(() => {
    try {
      console.log("data in home page", loginId);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const categories = [
    { label: 'Jobs', icon: 'briefcase-outline', screen: 'Jobs', params: { screen: 'JobFeedScreen' } },
    { label: 'Applied Jobs', icon: 'document-text-outline', screen: 'Applications' },
    { label: 'ChatBot', icon: 'chatbubbles-outline', screen: 'AI Assistant' },
    { label: 'Analysis', icon: 'document-text-outline', screen: 'analysis' },
    { label: 'Q/A-prep', icon: 'briefcase-outline', screen: 'interviewSetup' },
    { label: 'Settings', icon: 'settings-outline', screen: 'settings' },
  ];

  // Create dynamic styles using theme - ONLY ONE STYLES DEFINITION
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,

    },
    greetingContainer: {
      justifyContent: 'center',
    },
    greeting: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    userName: {
      fontSize: 18,
      color: theme.text,
      fontWeight: '700',
      marginTop: 2,
    },
    bellContainer: {
      position: 'relative',
      padding: 8,
    },
    bellBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.error,
    },
    content: {
      flex: 1,
    },
    heroCard: {
      margin: 20,
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 24,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    heroContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    heroText: {
      flex: 1,
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.text,
      lineHeight: 32,
      marginBottom: 8,
    },
    heroSubtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    heroIcon: {
      marginLeft: 16,
    },
    rocketEmoji: {
      fontSize: 48,
    },
    carouselSection: {
      height: 210,
      marginBottom: 5,
    },
    slide: {
      flex: 1,
      marginHorizontal: 20,
      borderRadius: 16,
      overflow: 'hidden',
    },
    slideImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text,
      marginHorizontal: 30,
      marginBottom: 16,
    },
    grid: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      paddingHorizontal: 21,
    },
    gridItem: {
      width: (width -20) / 4,
      alignItems: 'center',
      margin: 10
    },
    iconContainer: {
      width: 66,
      height: 66,
      borderRadius: 16,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    gridLabel: {
      fontSize: 12,
      fontWeight: '900',
      color: theme.text,
      textAlign: 'center',
    },
    tagsContainer: {
      paddingHorizontal: 20,
    },
    tag: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.surface,
      marginRight: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    selectedTag: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    tagText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    selectedTagText: {
      color: theme.onPrimary,
    },
    techDetailsCard: {
      margin: 20,
      marginTop: 16,
      marginBottom: 0,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    techHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    techIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    techTitleContainer: {
      flex: 1,
    },
    techTitle: {
      fontSize: 20,
      fontWeight: '700',
      color:theme.onPrimary,
      marginBottom: 4,
    },
    techBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    techBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.secondary,
    },
    techDescription: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.textSecondary,
      marginBottom: 20,
    },
    featuresContainer: {
      marginTop: 4,
    },
    featuresTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
    },
    featuresList: {
      gap: 8,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    featureDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 12,
    },
    featureText: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.surface} barStyle={theme.statusBarStyle || "dark-content"} />
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={image} style={styles.avatar} resizeMode="cover" />
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{greeting} </Text>
            <Text style={styles.userName}>{nickname}</Text>
          </View>
        </View>
        <Pressable
          style={styles.bellContainer}
          onPress={() => navigation.navigate("notification")}
        >
          <Bells name="bell-outline" size={24} color={theme.text} />
          <View style={styles.bellBadge} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* Hero Welcome Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Welcome to{'\n'}Future Guide</Text>
              <Text style={styles.heroSubtitle}>
                Your personalized career guidance platform
              </Text>
            </View>
            <View style={styles.heroIcon}>
              <Text style={styles.rocketEmoji}>🚀</Text>
            </View>
          </View>
        </View>

        {/* Image Carousel */}
        <View style={styles.carouselSection}>
          <Swiper
            height={180}
            autoplay
            autoplayTimeout={4}
            showsPagination={false}
            showsButtons={false}
          >
            {[
              require('../../Images/1_.png'),
              require('../../Images/2.png'),
              require('../../Images/3.png')
            ].map((image, index) => (
              <View key={index} style={styles.slide}>
                <Image source={image} style={styles.slideImage} />
              </View>
            ))}
          </Swiper>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            {categories.map((item, index) => (
              <Pressable
                key={item.label}
                style={styles.gridItem}
                onPress={() => handleCategoryPress(item.screen, item.params)}
              >
                <View style={styles.iconContainer}>
                  <Arrow name={item.icon} size={24} color={theme.primary} />
                </View>
                <Text style={styles.gridLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Trending Technologies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Technologies</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {trendingTags.map((tag, index) => {
              const isSelected = tag === selectedTech;
              return (
                <Pressable
                  key={index}
                  onPress={() => setSelectedTech(tag)}
                  style={[
                    styles.tag,
                    isSelected && styles.selectedTag
                  ]}
                >
                  <Text style={[
                    styles.tagText,
                    isSelected && styles.selectedTagText
                  ]}>
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Selected Technology Details */}
          <View style={styles.techDetailsCard}>
            <View style={styles.techHeader}>
              <View style={[styles.techIconContainer, { backgroundColor: techData[selectedTech]?.color + '20' }]}>
                <Arrow
                  name={techData[selectedTech]?.icon}
                  size={32}
                  color={techData[selectedTech]?.color}
                />
              </View>
              <View style={styles.techTitleContainer}>
                <Text style={styles.techTitle}>{techData[selectedTech]?.title}</Text>
                <View style={[styles.techBadge, { backgroundColor:theme.primary }]}>
                  <Text style={styles.techBadgeText}>Popular</Text>
                </View>
              </View>
            </View>

            <Text style={styles.techDescription}>
              {techData[selectedTech]?.description}
            </Text>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Key Features:</Text>
              <View style={styles.featuresList}>
                {techData[selectedTech]?.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={[styles.featureDot, { backgroundColor: theme.primary }]} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
