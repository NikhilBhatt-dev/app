import Constants from 'expo-constants'
import PostHog from 'posthog-react-native'

type PostHogConfig = {
  posthogProjectToken?: string
  posthogHost?: string
}

const config = Constants.expoConfig?.extra as PostHogConfig | undefined
const projectToken = config?.posthogProjectToken
const host = config?.posthogHost

if (!projectToken && __DEV__) {
  throw new Error(
    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured',
  )
}

if (!host && __DEV__) {
  throw new Error(
    'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured',
  )
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
        logs: {
          serviceName: 'subtrack-mobile',
        },
      })
    : undefined
