import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, get } from "firebase/database";
import { db } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PerformanceTracker from "../components/PerformanceTracker";
const roleText = {
  Студент: "за симестр",
  Преподаватель: "курируемой группы",
};
const MainScreen = (userData: any) => {
  const nav = useNavigation();
  const [role, setRole] = useState("");
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/photos/icons/hamb.png")}
              style={{ width: 45, height: 45, objectFit: "contain" }}
            />
          </TouchableOpacity>
          <Image
            source={require("../../assets/photos/logo.png")}
            style={{ width: 100, height: 75, objectFit: "contain" }}
          />
        </View>
        <View style={styles.body}>
          <View style={styles.topPart}>
            <View style={styles.topPartText}>
              <Text style={{ fontSize: 20, fontFamily: "Roboto" }}>
                Успеваемость
              </Text>
              {/* <Text>{roleText[role]}</Text> */}
              <Text style={{ fontSize: 20, fontFamily: "Roboto" }}>текст</Text>
            </View>
            <PerformanceTracker />
          </View>
          <View>
            <View></View>
            <View></View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "white",
    resizeMode: "cover",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  container: {
    display: "flex",
    gap: 50,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "20%",
    padding: 40,
  },
  topPartPercent: {
    width: 93,
    height: 93,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topPart: {
    backgroundColor: "#F7E15C",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 351,
    height: 110,
    borderRadius: 15,
  },
});

export default MainScreen;
