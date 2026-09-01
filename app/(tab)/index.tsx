
import "@/global.css";

import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";
import { HOME_BALANCE, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/constants/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { FlatList } from "react-native";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      {/* Header */}
      <View className="home-header">
        <View className="home-user">
          <Image source={images.avatar} className="home-avatar" />

          <Text className="home-user-name">
            {HOME_USER.name}
          </Text>
        </View>

        <Image source={icons.add} className="home-add-icon" />
      </View>

     

      <View className="home-balance-card">
        <Text className="home-balance-label">
          Balance
        </Text>

        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>

          <Text className="home-balance-date">
            {new Date(HOME_BALANCE.nextRenewalDate).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            })}
          </Text>
        </View>
      </View>

      <View>
        
        <ListHeading title="Upcoming" />
        <FlatList data ={ UPCOMING_SUBSCRIPTIONS} renderItem={({item}) => (
          <UpcomingSubscriptionCard {...item} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator ={false}
        ListEmptyComponent={<Text className="home-empty-state"> No Upcoming renewal yet.</Text>}
     />

      </View>

      <View>

        <ListHeading title="All Subscription" />
      </View>
    </SafeAreaView>
  );
}
