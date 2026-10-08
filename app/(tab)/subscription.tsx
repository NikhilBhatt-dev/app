import "@/global.css";

import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { posthog } from "@/lib/posthog";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Subscriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSubscriptions = HOME_SUBSCRIPTIONS.filter((subscription) => {
    if (!normalizedQuery) return true;

    return [
      subscription.name,
      subscription.category,
      subscription.plan,
      subscription.billing,
      subscription.status,
      subscription.paymentMethod,
    ]
      .some((value) => value?.toLowerCase().includes(normalizedQuery) ?? false);
  });

  const handleSubscriptionPress = (
    subscription: (typeof HOME_SUBSCRIPTIONS)[number]
  ) => {
    const isOpening = expandedSubscriptionId !== subscription.id;
    setExpandedSubscriptionId(isOpening ? subscription.id : null);

    if (isOpening) {
      posthog?.capture("subscription_expanded", {
        subscription_id: subscription.id,
        billing_interval: subscription.billing,
        ...(subscription.status && {
          subscription_status: subscription.status,
        }),
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        extraData={expandedSubscriptionId}
        renderItem={({ item }) => (
          <View className="px-5">
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() => handleSubscriptionPress(item)}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        ListHeaderComponent={
          <View className="px-5">
            <View className="mb-2.5 mt-2 flex-row items-center justify-between">
              <Text className="text-3xl font-sans-bold text-primary">
                Subscriptions
              </Text>
              <Text className="text-sm font-sans-semibold text-muted-foreground">
                {filteredSubscriptions.length} total
              </Text>
            </View>

            <View className="mb-5 flex-row items-center rounded-2xl border border-border bg-card px-4">
              <Text className="mr-3 text-xl text-muted-foreground">/</Text>
              <TextInput
                className="flex-1 py-4 text-base font-sans-medium text-primary"
                value={searchQuery}
                onChangeText={(query) => {
                  setSearchQuery(query);
                  setExpandedSubscriptionId(null);
                }}
                placeholder="Search subscriptions"
                placeholderTextColor="rgba(0, 0, 0, 0.45)"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                accessibilityLabel="Search subscriptions"
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery("")}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Clear subscription search"
                >
                  <Text className="text-xl font-sans-semibold text-muted-foreground">
                    x
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center px-5 py-10">
            <Text className="text-base font-sans-semibold text-primary">
              No subscriptions found
            </Text>
            <Text className="mt-2 text-center text-sm font-sans-medium text-muted-foreground">
              Try a different name, category, plan, or status.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
