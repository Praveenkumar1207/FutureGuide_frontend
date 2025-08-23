import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated, {
  FadeInUp,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../../ThemeContext";
import LottieView from 'lottie-react-native';
const { width } = Dimensions.get("window");

const AnalysisHome = ({ navigation }) => {
  const { theme } = useTheme();

  const features = [
    {
      title: "Resume Analyzer",
      tagline: "Analyze and optimize resumes",
      icon: "file-document-edit-outline",
      color: "#87CEEB",
      screen: "Resume",
    },
    {
      title: "Job Fit Analyzer",
      tagline: "Check job compatibility",
      icon: "briefcase-search-outline",
      color: "#00B894",
      screen: "Jd",
    },
    {
      title: "Downloads",
      tagline: "View downloaded files",
      icon: "download-box-outline",
      color: "#F39C12",
      screen: "Downloads",
    },
  ];

  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);

  useEffect(() => {
    scale1.value = withRepeat(
      withTiming(1.6, { duration: 1800, easing: Easing.out(Easing.ease) }),
      -1,
      true
    );
    scale2.value = withRepeat(
      withTiming(2.0, { duration: 2500, easing: Easing.out(Easing.ease) }),
      -1,
      true
    );
  }, []);

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: "flex-start",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#E6E6E6",
    marginTop: 4,
  },
  featureList: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 16,
  },
  card: {
    width: width - 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  lottieContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 10,
  },
  image: {
    width: 120,
    height: 120,
  },
});

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analysis</Text>
        <Text style={styles.subtitle}>Make your Resume Smart than Ever</Text>
      </View>

      {/* Feature Cards */}
      <View style={styles.featureList}>
        {features.map((feature, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(index * 100).springify()}
            style={styles.card}
          >
            <TouchableOpacity
              style={styles.leftContent}
              onPress={() => navigation.navigate(feature.screen)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: feature.color },
                ]}
              >
                <MaterialCommunityIcons
                  name={feature.icon}
                  size={22}
                  color="#fff"
                />
              </View>
              <View style={styles.textBlock}>
                <Text style={styles.cardTitle}>{feature.title}</Text>
                <Text style={styles.cardSubtitle}>{feature.tagline}</Text>
              </View>
            </TouchableOpacity>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </Animated.View>
        ))}
      </View>
       <TouchableOpacity style={styles.lottieContainer} onPress={()=>{navigation.navigate("AI Assistant")}}>
      <LottieView
        source={require("../../assets/Animation - 1751012128701.json")}
        autoPlay
        loop
        style={styles.image}
      />
    </TouchableOpacity>
    </View>
  );
};

export default AnalysisHome;
