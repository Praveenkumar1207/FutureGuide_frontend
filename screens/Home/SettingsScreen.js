import React, { useEffect, useState } from "react";

import {

  View,

  Text,

  StyleSheet,

  Image,

  TouchableOpacity,

  Switch,

  ScrollView,

  Modal,

  FlatList,

} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../../ThemeContext"; // Ensure this is the correct path

import AboutCompany from "../settings/aboutcompany";

import PrivacyPolicy from "../settings/privacypolicy";


import axios from "axios";
import { useLogin } from "../../Login_id_passing";

export default function SettingsScreen() {

  const [shopUpdates, setShopUpdates] = useState(true);

  const [notifications, setNotifications] = useState(false);

  const [showThemeModal, setShowThemeModal] = useState(false);

  const { loginId } = useLogin();

  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    axios.get(`https://futureguide-backend.onrender.com/api/profiles/${loginId.login_id}`)
      .then((response) => {
        console.log(response.data);
        setProfileData({ ...response.data })

      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  const navigation = useNavigation();

  const { theme, currentTheme, changeTheme, availableThemes } = useTheme();



  const handleThemeChange = (themeId) => {

    changeTheme(themeId);

    setShowThemeModal(false);

  };



  const renderThemeOption = ({ item }) => (

    <TouchableOpacity

      style={[

        styles.themeOption,

        currentTheme === item.id && [

          styles.selectedThemeOption,

          { borderColor: theme.primary },

        ],

      ]}

      onPress={() => handleThemeChange(item.id)}

    >

      <View style={styles.themePreview}>

        <View

          style={[styles.colorPreview, { backgroundColor: item.primary }]}

        />

        <View style={[styles.colorPreview, { backgroundColor: item.accent }]} />

        <View

          style={[styles.colorPreview, { backgroundColor: item.surface }]}

        />

      </View>

      <View style={styles.themeInfo}>

        <Text style={[styles.themeName, { color: theme.textDark }]}>

          {item.name}

        </Text>

        <Text style={[styles.themeDescription, { color: theme.textMedium }]}>

          {item.id === "darkMode"

            ? "Dark theme for low light"

            : item.id === "lightMode"

              ? "Clean and bright"

              : `${item.name} color scheme`}

        </Text>

      </View>

      {currentTheme === item.id && (

        <Icon name="check-circle" size={24} color={theme.primary} />

      )}

    </TouchableOpacity>

  );



  return (

    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <View style={[styles.headerSection, { backgroundColor: theme.primary }]}>

        <View style={styles.userInfoRow}>

          <View>

            <Text style={[styles.username, { color: theme.textLight }]}>

              {
                  profileData.firstName ? profileData.firstName +" "+ profileData.lastName : "User"
              } 

            </Text>

            <Text style={[styles.email, { color: theme.textLight }]}>

              {
                  profileData.mobile ? profileData.mobile : "9848835862"
              }

            </Text>

            <Text style={styles.updateLabel}>New Update</Text>

          </View>

          <Image

            source={{uri: profileData.Profile_image_path ? profileData.Profile_image_path : "https://www.w3schools.com/howto/img_avatar.png"}}

            style={styles.profilePic}

          />

        </View>



        <View style={styles.tabRow}>

          <TouchableOpacity style={styles.tabItem}>

            <Icon name="cog" size={20} color={theme.textLight} />

            <Text style={[styles.tabTextInactive, { color: theme.textLight }]}>

              Settings

            </Text>

          </TouchableOpacity>



          <TouchableOpacity style={styles.tabItem}>

            <Icon name="bell-outline" size={20} color={theme.textLight} />

            <Text style={[styles.tabTextInactive, { color: theme.textLight }]}>

              Notification

            </Text>

          </TouchableOpacity>

        </View>

      </View>



      <ScrollView contentContainerStyle={styles.body}>

        <Text style={[styles.sectionHeader, { color: theme.textMedium }]}>

          GENERAL

        </Text>



        <TouchableOpacity

          style={[

            styles.row,

            { backgroundColor: theme.surface, borderBottomColor: theme.border },

          ]}

          onPress={() => setShowThemeModal(true)}

        >

          <View style={styles.rowLeft}>

            <Icon

              name="palette"

              size={20}

              color={theme.textDark}

              style={{ width: 30 }}

            />

            <View>

              <Text style={[styles.rowLabel, { color: theme.textDark }]}>

                Themes

              </Text>

              <Text style={[styles.rowSubtitle, { color: theme.textMedium }]}>

                {theme.name}

              </Text>

            </View>

          </View>

          <Icon name="chevron-right" size={20} color={theme.textMedium} />

        </TouchableOpacity>



        {/* <SettingRow

          icon="account-edit"

          label="Edit Profile"

          onPress={() => navigation.navigate("EditProfile")}

          theme={theme}

        /> */}



        <SettingRow

          icon="lock-outline"

          label="Change Password"

          onPress={() => navigation.navigate("ForgotPassword")}

          theme={theme}

        />

        <SettingRow

          icon="lock-outline"

          label="Log Out"

          onPress={() => navigation.navigate("Login")}

          theme={theme}

        />



        <Text style={[styles.sectionHeader, { color: theme.textMedium }]}>

          ABOUT & TERMS

        </Text>



        <SettingRow

          icon="office-building"

          label="About Company"

          onPress={() => navigation.navigate("AboutCompany")}

          theme={theme}

        />

        <SettingRow

          icon="file-document-outline"

          label="Privacy Policy"

          onPress={() => navigation.navigate("PrivacyPolicy")}

          theme={theme}

        />



        <Text style={[styles.sectionHeader, { color: theme.textMedium }]}>

          NOTIFICATIONS

        </Text>



        <ToggleRow

          label="Notifications"

          value={notifications}

          onValueChange={() => setNotifications(!notifications)}

          theme={theme}

        />

      </ScrollView>



      {/* Theme Modal */}

      <Modal

        visible={showThemeModal}

        animationType="slide"

        presentationStyle="pageSheet"

        onRequestClose={() => setShowThemeModal(false)}

      >

        <View

          style={[styles.modalContainer, { backgroundColor: theme.background }]}

        >

          <View

            style={[styles.modalHeader, { borderBottomColor: theme.border }]}

          >

            <TouchableOpacity

              onPress={() => setShowThemeModal(false)}

              style={styles.closeButton}

            >

              <Icon name="close" size={24} color={theme.textMedium} />

            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: theme.textDark }]}>

              Choose Theme

            </Text>

            <View style={{ width: 24 }} />

          </View>



          <FlatList

            data={availableThemes}

            renderItem={renderThemeOption}

            keyExtractor={(item) => item.id}

            contentContainerStyle={styles.themesList}

          />

        </View>

      </Modal>

    </View>

  );

}



const SettingRow = ({ icon, label, onPress, theme }) => (

  <TouchableOpacity

    style={[

      styles.row,

      { backgroundColor: theme.surface, borderBottomColor: theme.border },

    ]}

    onPress={onPress}

    disabled={!onPress}

  >

    <View style={styles.rowLeft}>

      <Icon

        name={icon}

        size={20}

        color={theme.textDark}

        style={{ width: 30 }}

      />

      <Text style={[styles.rowLabel, { color: theme.textDark }]}>{label}</Text>

    </View>

    <Icon name="chevron-right" size={20} color={theme.textMedium} />

  </TouchableOpacity>

);



const ToggleRow = ({ label, value, onValueChange, theme }) => (

  <View

    style={[

      styles.row,

      { backgroundColor: theme.surface, borderBottomColor: theme.border },

    ]}

  >

    <Text style={[styles.rowLabel, { color: theme.textDark }]}>{label}</Text>

    <Switch

      value={value}

      onValueChange={onValueChange}

      trackColor={{ false: "#ccc", true: theme.primary }}

      thumbColor={"#fff"}

    />

  </View>

);



const styles = StyleSheet.create({

  container: {

    flex: 1,

  },

  headerSection: {

    borderBottomLeftRadius: 30,

    borderBottomRightRadius: 30,

    padding: 20,

  },

  userInfoRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

  },

  username: {

    fontSize: 20,

    fontWeight: "bold",

  },

  email: {

    fontSize: 14,

    marginVertical: 2,

  },

  updateLabel: {

    fontSize: 12,

    color: "#FFEB3B",

    fontWeight: "bold",

  },

  profilePic: {

    width: 50,

    height: 50,

    borderRadius: 25,

  },

  tabRow: {

    flexDirection: "row",

    justifyContent: "space-around",

    marginTop: 20,

  },

  tabItem: {

    alignItems: "center",

  },

  tabTextInactive: {

    marginTop: 4,

    fontSize: 12,

  },

  body: {

    padding: 16,

    paddingBottom: 100,

  },

  sectionHeader: {

    fontSize: 13,

    fontWeight: "bold",

    marginTop: 20,

    marginBottom: 10,

  },

  row: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingVertical: 12,

    paddingHorizontal: 16,

    borderBottomWidth: 1,

    marginBottom: 2,

    borderRadius: 8,

  },

  rowLeft: {

    flexDirection: "row",

    alignItems: "center",

  },

  rowLabel: {

    fontSize: 15,

    marginLeft: 12,

  },

  rowSubtitle: {

    fontSize: 12,

    marginLeft: 12,

    marginTop: 2,

  },

  modalContainer: {

    flex: 1,

  },

  modalHeader: {

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    padding: 20,

    borderBottomWidth: 1,

  },

  modalTitle: {

    fontSize: 18,

    fontWeight: "bold",

  },

  closeButton: {

    padding: 4,

  },

  themesList: {

    padding: 20,

  },

  themeOption: {

    flexDirection: "row",

    alignItems: "center",

    padding: 16,

    marginBottom: 12,

    backgroundColor: "#f8f9fa",

    borderRadius: 12,

    borderWidth: 2,

    borderColor: "transparent",

  },

  selectedThemeOption: {

    backgroundColor: "#f0f8ff",

  },

  themePreview: {

    flexDirection: "row",

    marginRight: 16,

  },

  colorPreview: {

    width: 16,

    height: 16,

    borderRadius: 8,

    marginRight: 4,

  },

  themeInfo: {

    flex: 1,

  },

  themeName: {

    fontSize: 16,

    fontWeight: "600",

    marginBottom: 2,

  },

  themeDescription: {

    fontSize: 12,

  },

});



