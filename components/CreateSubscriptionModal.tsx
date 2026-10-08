import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import clsx from "clsx";
import dayjs from "dayjs";

import { icons } from "@/constants/icons";

const FREQUENCIES = ["Monthly", "Yearly"] as const;
const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const CATEGORY_COLORS: Record<(typeof CATEGORIES)[number], string> = {
  Entertainment: "#b8d4e3",
  "AI Tools": "#d9c5f0",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#b8e8d0",
  Cloud: "#c9d7f0",
  Music: "#f0c6d8",
  Other: "#e8def8",
};

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
};

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] =
    useState<(typeof FREQUENCIES)[number]>("Monthly");
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]>("Entertainment");
  const [didAttemptSubmit, setDidAttemptSubmit] = useState(false);

  const trimmedName = name.trim();
  const parsedPrice = Number(price);
  const isNameValid = trimmedName.length > 0;
  const isPriceValid = price.trim().length > 0 &&
    Number.isFinite(parsedPrice) &&
    parsedPrice > 0;
  const canSubmit = isNameValid && isPriceValid;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
    setDidAttemptSubmit(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    setDidAttemptSubmit(true);
    if (!canSubmit) return;

    const startDate = dayjs();
    const renewalDate = startDate
      .add(1, frequency === "Monthly" ? "month" : "year")
      .toISOString();

    onCreate({
      id: `subscription-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: trimmedName,
      price: parsedPrice,
      currency: "USD",
      frequency,
      category,
      status: "active",
      startDate: startDate.toISOString(),
      renewalDate,
      icon: icons.wallet,
      billing: frequency,
      color: CATEGORY_COLORS[category],
    });
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View className="modal-overlay justify-end">
        <Pressable
          className="absolute inset-0"
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close new subscription dialog"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-end"
        >
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable
                className="modal-close"
                onPress={handleClose}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerClassName="modal-body"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className="auth-input"
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Netflix"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  autoCapitalize="words"
                  returnKeyType="next"
                  accessibilityLabel="Subscription name"
                />
                {didAttemptSubmit && !isNameValid && (
                  <Text className="auth-error">Enter a subscription name.</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className="auth-input"
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  accessibilityLabel="Subscription price"
                />
                {didAttemptSubmit && !isPriceValid && (
                  <Text className="auth-error">
                    Enter a price greater than zero.
                  </Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {FREQUENCIES.map((option) => {
                    const isActive = frequency === option;
                    return (
                      <Pressable
                        key={option}
                        className={clsx(
                          "picker-option",
                          isActive && "picker-option-active"
                        )}
                        onPress={() => setFrequency(option)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isActive }}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            isActive && "picker-option-text-active"
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((option) => {
                    const isActive = category === option;
                    return (
                      <Pressable
                        key={option}
                        className={clsx(
                          "category-chip",
                          isActive && "category-chip-active"
                        )}
                        onPress={() => setCategory(option)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isActive }}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            isActive && "category-chip-text-active"
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Pressable
                className={clsx(
                  "auth-button",
                  !canSubmit && "auth-button-disabled"
                )}
                onPress={handleSubmit}
                accessibilityRole="button"
                accessibilityLabel="Create subscription"
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
