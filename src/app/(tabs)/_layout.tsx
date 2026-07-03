import { Tabs } from "expo-router";
import { Bell, Clock3, Home, Menu } from "lucide-react-native";

import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#aaa3b6",
        tabBarLabelStyle: {
          fontFamily: fontFamily.semibold,
          fontSize: 11
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: "#f0edf5",
          display: "none",
          height: 70,
          paddingBottom: 10,
          paddingTop: 8
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Histórico",
          tabBarIcon: ({ color, size }) => <Clock3 color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificações",
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Mais",
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
