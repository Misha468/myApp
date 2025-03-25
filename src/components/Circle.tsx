import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const ProgressCircle = ({ percentage = 75, radius = 45, strokeWidth = 10 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const color = getColor(percentage);

  const circleCircumference = 2 * Math.PI * radius;
  const maxOffset =
    circleCircumference - (circleCircumference * percentage) / 100;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [percentage]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circleCircumference, maxOffset],
  });

  function getColor(percent: any) {
    if (percent < 40) return "#ED5300";
    if (percent < 86) return "#1FCB13";
    return "#CB1313";
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      >
        <G rotation="-90" origin={`${radius}, ${radius}`}>
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#e6e6e6"
            fill="transparent"
            strokeWidth={strokeWidth}
          />
          <AnimatedCircle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={{ position: "absolute" }}>
        <Text
          style={{
            fontSize: radius * 0.35,
            fontWeight: "bold",
            color: "black",
            fontFamily: "Roboto",
          }}
        >
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default ProgressCircle;
