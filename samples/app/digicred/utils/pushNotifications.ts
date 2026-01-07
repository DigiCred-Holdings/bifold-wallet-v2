import { Platform, PermissionsAndroid } from 'react-native'
import type { Agent } from '@credo-ts/core'

type NotificationPermissionState = 'denied' | 'granted' | 'unknown'

/**
 * Get the current notification permission status
 */
export const getNotificationPermissionStatus = async (): Promise<NotificationPermissionState> => {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      )
      console.log('[PushNotifications] Check permission result:', result)
      return result ? 'granted' : 'denied'
    }
    // For older Android or iOS, return granted (handled by system)
    return 'granted'
  } catch (error) {
    console.error('[PushNotifications] Error checking permission status:', error)
    return 'unknown'
  }
}

/**
 * Request notification permission from the user
 */
export const requestNotificationPermission = async (): Promise<NotificationPermissionState> => {
  console.log('[PushNotifications] Requesting permission, Platform:', Platform.OS, 'Version:', Platform.Version)

  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      console.log('[PushNotifications] Requesting Android POST_NOTIFICATIONS permission')

      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'This app needs notification permission to alert you about new messages and credentials.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        }
      )

      console.log('[PushNotifications] Android permission result:', result)

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        return 'granted'
      } else if (result === PermissionsAndroid.RESULTS.DENIED) {
        return 'denied'
      } else {
        // NEVER_ASK_AGAIN
        return 'denied'
      }
    }

    // For older Android versions or iOS, permission is granted by default
    console.log('[PushNotifications] Permission granted by default (older Android or iOS)')
    return 'granted'
  } catch (error) {
    console.error('[PushNotifications] Error requesting permission:', error)
    return 'denied'
  }
}

/**
 * Toggle push notifications on/off
 * This should register/unregister the device token with the mediator
 */
export const togglePushNotifications = async (enabled: boolean, agent: Agent<any>): Promise<void> => {
  try {
    if (enabled) {
      // Push notifications enabled
      // The @credo-ts/push-notifications module should handle FCM token registration
      // with the mediator automatically when push notifications are enabled
      console.log('[PushNotifications] Push notifications enabled')

      // Find the push notifications module if available
      // This would typically use the PushNotificationsModule from @credo-ts/push-notifications
      // to register the device token with the mediator
    } else {
      // Unregister from push notifications
      console.log('[PushNotifications] Push notifications disabled')
      // TODO: Unregister token from mediator
    }
  } catch (error) {
    console.error('[PushNotifications] Error toggling push notifications:', error)
  }
}

/**
 * Push notification configuration for the app
 */
export const pushNotificationConfig = {
  status: getNotificationPermissionStatus,
  setup: requestNotificationPermission,
  toggle: togglePushNotifications,
}
