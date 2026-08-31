import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const settings = () => {
  return (
   <SafeAreaView className="flex-1 bg-background p-5">
      <Text>settings</Text>
    </SafeAreaView>
  )
}

export default settings