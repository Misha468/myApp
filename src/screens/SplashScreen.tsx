import React, { useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
const SplashScreen = () => {
  const navigation = useNavigation();
  useFonts({
    Roboto: require("../../assets/fonts/RobotoSlab-Regular.ttf"),
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Auth");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <ImageBackground
      source={require("../../assets/photos/bcg.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Добро пожаловать!</Text>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "black",
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
});

export default SplashScreen;
