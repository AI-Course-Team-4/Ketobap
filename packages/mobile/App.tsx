import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from '@expo/vector-icons';
import Like from "./app/like";
import Keto from "./app/keto";
import Main from "./app/main";
import Restaurant from "./app/restaurant";
import Mypage from "./app/mypage";

// 각 화면을 TopContainer 스타일로 감싸기
function TopWrapper({ children }) {
    return <View style={styles.topContainer}>{children}</View>;
}

function LikeScreen() {
    return <TopWrapper><Like /></TopWrapper>;
}
function KetoScreen() {
    return <TopWrapper><Keto /></TopWrapper>;
}
function HomeScreen() {
    return <TopWrapper><Main /></TopWrapper>;
}
function RestaurantScreen() {
    return <TopWrapper><Restaurant /></TopWrapper>;
}
function MypageScreen() {
    return <TopWrapper><Mypage /></TopWrapper>;
}

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Favorites') iconName = 'heart';
            else if (route.name === 'Food') iconName = 'drumstick-bite';
            else if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Restaurant') iconName = 'utensils';
            else if (route.name === 'Mypage') iconName = 'user';

            return <FontAwesome5 name={iconName} size={focused ? 25 : 20} color={color} solid />;
          },
          tabBarActiveTintColor: '#8E9E6A',
          tabBarInactiveTintColor: '#C2CCAA',
          tabBarStyle: { 
            height: 104, 
            backgroundColor: '#E4EBD6',
          },
          tabBarLabelStyle: { display: 'none' },
          tabBarPressColor: 'transparent',
          tabBarPressOpacity: 1,
        })}
      >

        <Tab.Screen name="Favorites" component={LikeScreen} />
        <Tab.Screen name="Food" component={KetoScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Restaurant" component={RestaurantScreen} />
        <Tab.Screen name="Mypage" component={MypageScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    topContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F9FEE8',
    },
  });