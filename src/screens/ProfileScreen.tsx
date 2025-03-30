import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { ref, get, update } from "firebase/database";
import { db } from "../config/firebase";
import { useUser } from "../../UserContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const avatars = [
  {
    id: "default",
    name: "По умолчанию",
    source: require("../../assets/photos/avatars/default.png"),
  },
  {
    id: "avatar1",
    name: "Аватар 1",
    source: require("../../assets/photos/avatars/avatar1.png"),
  },
  {
    id: "avatar2",
    name: "Аватар 2",
    source: require("../../assets/photos/avatars/avatar2.png"),
  },
];
const roleText = {
  Студент: "студента",
  Преподаватель: "преподавателя",
};
const coachList = {
  xupyQlDJCCW9QbrtfyPuTJ1zNoZ2:
    "Преподавальный Преподаватель Преподавательевич",
};
const ProfileScreen = () => {
  const nav = useNavigation();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadProfile = async () => {
      const uniqueid = await AsyncStorage.getItem("uniqueid");
      if (uniqueid) {
        const userRef = ref(db, `users/${uniqueid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setProfile(snapshot.val());
        }
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);
  const handleAvatarSelect = async (avatarId) => {
    const uniqueid = await AsyncStorage.getItem("uniqueid");
    try {
      await update(ref(db, `users/${uniqueid}`), {
        avatar: avatarId,
      });
      setProfile((prev) => ({ ...prev, avatar: avatarId }));
    } catch (error) {
      console.error("Ошибка обновления аватарки:", error);
    }
  };
  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }
  return (
    <ImageBackground
      source={require("../../assets/photos/bcg2.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/photos/icons/hamb.png")}
              style={{ width: 45, height: 45, objectFit: "contain" }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate("Home")}>
            <Image
              source={require("../../assets/photos/logo.png")}
              style={{ width: 100, height: 75, objectFit: "contain" }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={styles.infoContainer}>
            <Text style={{ fontFamily: "Roboto", fontSize: 25 }}>
              Профиль {roleText[user?.role] || ""}
            </Text>
            <View style={styles.profile}>
              <Image
                source={
                  profile?.avatar
                    ? avatars.find((a) => a.id === profile.avatar)?.source
                    : require("../../assets/photos/avatars/default.png")
                }
                style={styles.currentAvatar}
              />
              <Text style={styles.label}>
                {profile?.username || "Не указано"}
              </Text>
            </View>
            <View style={styles.moreInfo}>
              <Text style={{ fontFamily: "Roboto", fontSize: 23 }}>
                Группа:
              </Text>
              <Text
                style={{ fontFamily: "Roboto", fontSize: 18, color: "#585858" }}
              >
                {profile?.groupId || "Не указано"}
              </Text>
            </View>
            <View style={styles.moreInfo}>
              <Text style={{ fontFamily: "Roboto", fontSize: 23 }}>
                Куратор:
              </Text>
              <Text
                style={{ fontFamily: "Roboto", fontSize: 18, color: "#585858" }}
              >
                {coachList[profile?.coachId] || "Не указано"}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.sectionTitle}>Изменить аватар</Text>
            <FlatList
              data={avatars}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.avatarGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[profile?.avatar === item.id && styles.selectedAvatar]}
                  onPress={() => handleAvatarSelect(item.id)}
                >
                  <Image source={item.source} style={styles.avatarImage} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        <View style={styles.bottomPart}>
          <TouchableOpacity
            style={styles.bpTO}
            onPress={() => nav.navigate("Schedule")}
          >
            <Image
              source={require("../../assets/photos/icons/schedule.png")}
              style={styles.bpImage}
            />
            <Text style={styles.bpTxt}>Расписание</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bpTO}
            onPress={() => nav.navigate("Chats")}
          >
            <Image
              source={require("../../assets/photos/icons/chats.png")}
              style={styles.bpImage}
            />
            <Text style={styles.bpTxt}>Чаты</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bpTO}
            onPress={() => nav.navigate("Profile")}
          >
            <Image
              source={require("../../assets/photos/icons/profile.png")}
              style={styles.bpImage}
            />
            <Text style={styles.bpTxt}>Профиль</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
    resizeMode: "cover",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "95%",
    justifyContent: "space-between",
  },
  bpTxt: {
    fontFamily: "Roboto",
    fontSize: 13,
  },
  moreInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "90%",
  },
  profile: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  bottomPart: {
    width: "100%",
    marginTop: 25,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bpTO: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  bpImage: {
    width: 40,
    height: 40,
    objectFit: "contain",
  },
  loader: {
    marginTop: 50,
  },
  header: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 40,
    paddingBottom: 30,
  },
  currentAvatar: {
    width: 80,
    height: 80,
    borderRadius: 60,
    alignSelf: "center",
  },
  infoContainer: {
    marginBottom: 25,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  label: {
    fontSize: 20,
    maxWidth: 200,
  },
  sectionTitle: {
    marginTop: 50,
    fontSize: 23,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Roboto",
  },
  avatarGrid: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 26,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F5F3F3",
    padding: 10,
    paddingTop: 25,
    paddingBottom: 25,
  },
  selectedAvatar: {
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: "100%",
  },
  avatarImage: {
    height: 100,
    width: 100,
  },
});

export default ProfileScreen;
