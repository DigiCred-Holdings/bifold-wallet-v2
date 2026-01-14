// Type declarations for react-native-add-calendar-event
declare module 'react-native-add-calendar-event' {
  export interface EventConfig {
    title?: string
    startDate?: string
    endDate?: string
    location?: string
    notes?: string
    url?: string
    allDay?: boolean
    navigationBarIOS?: {
      tintColor?: string
      backgroundColor?: string
      barTintColor?: string
      translucent?: boolean
      title?: string
      titleColor?: string
    }
  }

  export interface EventInfo {
    calendarItemIdentifier: string
    eventIdentifier: string
    action?: 'SAVED' | 'CANCELED' | 'DELETED' | 'RESPONDED' | 'DONE'
  }

  export interface EditEventConfig extends EventConfig {
    eventId: string
    useEditingModality?: boolean
  }

  export function presentEventCreatingDialog(config: EventConfig): Promise<EventInfo>

  export function presentEventEditingDialog(config: EditEventConfig): Promise<EventInfo>

  export function presentEventViewingDialog(config: {
    eventId: string
    allowsEditing?: boolean
    allowsCalendarPreview?: boolean
    navigationBarIOS?: EventConfig['navigationBarIOS']
  }): Promise<EventInfo>
}
