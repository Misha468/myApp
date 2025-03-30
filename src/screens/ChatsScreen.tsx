import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, get, onValue } from "firebase/database";
import { db } from "../config/firebase";
import { useUser } from "../../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatListScreen = () => {
  const nav = useNavigation();
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userId = await AsyncStorage.getItem("uniqueid");
        const userChatsRef = ref(db, `users/${userId}/chats`);

        const unsubscribe = onValue(userChatsRef, (snapshot) => {
          if (snapshot.exists()) {
            const chatIds = Object.keys(snapshot.val());
            const chatsRefs = chatIds.map((chatId) =>
              ref(db, `chats/${chatId}`)
            );

            Promise.all(chatsRefs.map((ref) => get(ref))).then((snapshots) => {
              const chatsData = snapshots
                .filter((snap) => snap.exists())
                .map((snap) => ({ id: snap.key, ...snap.val() }));
              setChats(chatsData);
              setLoading(false);
            });
          } else {
            setChats([]);
            setLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => nav.navigate("ChatScreen", { chatId: item.id })}
    >
      <ImageBackground
        source={require("../../assets/photos/bcg1.png")}
        style={styles.chatContainer}
        imageStyle={styles.chatBackground}
      >
        <View style={styles.chatContent}>
          <Image
            source={require("../../assets/photos/icons/chats.png")}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.chatName}>{item.groupName}</Text>
            <Text style={styles.lastMessage}>
              {item.lastMessage?.text || "Нет сообщений"}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/photos/bcg3.png")}
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
          <Text style={{ fontFamily: "Roboto", fontSize: 25 }}>Чаты</Text>
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Нет активных чатов</Text>
            }
          />
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
  },
  bpTxt: {
    fontFamily: "Roboto",
    fontSize: 13,
  },
  chatContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 8,
  },
  chatBackground: {
    borderRadius: 20,
    opacity: 0.9,
  },
  chatContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#e3e3e0",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "90%",
    height: "85%",
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
  avatar: {
    width: 60,
    height: 60,
    marginRight: 16,
    objectFit: "contain",
  },
  textContainer: {
    flex: 1,
  },
  chatName: {
    fontSize: 15,
    fontFamily: "Roboto",
    marginBottom: 4,
  },
  list: {
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    fontFamily: "Roboto",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  lastMessage: {
    color: "#545454",
    fontSize: 14,
    fontFamily: "Roboto",
  },
});

export default ChatListScreen;
