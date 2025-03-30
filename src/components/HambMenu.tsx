import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useUser } from "../../UserContext";
import { db } from "../config/firebase";
import { ref, push, set, get } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
const avatars = [
  {
    id: "default",
    source: require("../../assets/photos/avatars/default.png"),
  },
  {
    id: "avatar1",
    source: require("../../assets/photos/avatars/avatar1.png"),
  },
  {
    id: "avatar2",
    source: require("../../assets/photos/avatars/avatar2.png"),
  },
];
const HambMenu = () => {
  const { user, logout } = useUser();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quitVis, setQuitVis] = useState(false);
  const nav = useNavigation();
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const path = `navMenu/${user.role}NM`;
        const menuRef = ref(db, path);
        const snapshot = await get(menuRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setMenuItems(Object.values(data));
        } else {
          console.log("Меню не найдено");
        }
      } catch (error) {
        console.error("Ошибка загрузки меню:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user.role) {
      fetchMenu();
    }
  }, []);
  if (loading) {
    return <ActivityIndicator size="large" />;
  }
  const handleLogout = async () => {
    try {
      await logout();
      nav.navigate("Auth");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };
  return (
    <View style={styles.background}>
      {quitVis == true ? (
        <ImageBackground
          source={require("../../assets/photos/quitBcg.png")}
          style={styles.quitBack}
        >
          <View style={styles.form}>
            <Text style={{ fontFamily: "Roboto", fontSize: 22 }}>
              Выйти из системы?
            </Text>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setQuitVis(!quitVis)}
              >
                <Text style={{ fontFamily: "Roboto", fontSize: 20 }}>
                  отмена
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontSize: 20,
                    color: "#fa0e0e",
                  }}
                >
                  да
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      ) : null}
      <View style={styles.people}>
        <Image
          source={
            user?.avatar
              ? avatars.find((a) => a.id === user.avatar)?.source
              : require("../../assets/photos/avatars/default.png")
          }
          style={styles.avatar}
        />
        <View>
          <Text style={{ fontFamily: "Roboto", fontSize: 17 }}>
            {user?.groupId}
          </Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 22 }}>
            {user?.role}
          </Text>
        </View>
      </View>
      <View style={styles.wrapper}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => nav.navigate(item.link)}
          >
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={() => setQuitVis(!quitVis)}>
        <Text style={{ fontFamily: "Roboto", fontSize: 17, color: "#db1e1e" }}>
          Выйти
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "70%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9998,
  },
  people: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    objectFit: "contain",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 25,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 17,
  },
  quitBack: {
    width: 350,
    height: 200,
    position: "absolute",
    top: 200,
    zIndex: 9999,
  },
  button: {
    width: 100,
    height: 40,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fffcfc",
    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderRadius: 22,
  },
  form: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: 25,
  },
});

export default HambMenu;
