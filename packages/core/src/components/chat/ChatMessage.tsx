import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Bubble, IMessage, MessageProps } from 'react-native-gifted-chat'
import { useTheme } from '../../contexts/theme'
import { Role } from '../../types/chat'
import { formatTime } from '../../utils/helpers'
import { ThemedText } from '../texts/ThemedText'
import { testIdWithKey } from '../../utils/testable'

export enum CallbackType {
  CredentialOffer = 'CredentialOffer',
  ProofRequest = 'ProofRequest',
  PresentationSent = 'PresentationSent',
  Workflow = 'Workflow',
}

interface ExtendedMessage extends IMessage {
  messageOpensCallbackType?: CallbackType
  renderEvent?: () => JSX.Element
  createdAt: Date | number
  user: { _id: string | number }
  onDetails?: () => void
}

interface ChatMessageProps {
  messageProps: MessageProps<ExtendedMessage>
}

interface MessageTimeProps {
  message: ExtendedMessage
  alignRight?: boolean
}

const textForCallbackType = (callbackType: CallbackType): string => {
  switch (callbackType) {
    case CallbackType.CredentialOffer:
      return 'ViewOffer'
    case CallbackType.ProofRequest:
      return 'ViewRequest'
    case CallbackType.PresentationSent:
      return 'OpenPresentation'
    case CallbackType.Workflow:
      return 'ViewWorkflow'
    default:
      return 'OpenItem'
  }
}

const testIdForCallbackType = (callbackType: CallbackType): string => {
  const text = textForCallbackType(callbackType)
  const textWithoutSpaces = text.replace(/\s+/g, '')
  return testIdWithKey(textWithoutSpaces)
}

const MessageTime: React.FC<MessageTimeProps> = ({ message, alignRight = false }) => {
  const { ChatTheme: theme } = useTheme()
  const timeStyle = alignRight ? theme.timeStyleRight : theme.timeStyleLeft

  return (
    <ThemedText style={[timeStyle, styles.timeText]}>
      {formatTime(new Date(message.createdAt), { includeHour: true, chatFormat: true, trim: true })}
    </ThemedText>
  )
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ messageProps }) => {

  if (!messageProps.currentMessage) {
    return null
  }

  const message = useMemo(() => messageProps.currentMessage as ExtendedMessage, [messageProps.currentMessage])

  if (message.messageOpensCallbackType) {
    const isMe = message.user._id === Role.me

    return (
      <View testID={testIdForCallbackType(message.messageOpensCallbackType)} style={styles.messageContainer}>
        <View style={[styles.callbackContainer, isMe ? styles.callbackRight : styles.callbackLeft]}>
          {message.renderEvent?.() || null}
        </View>

        <View style={[styles.timeContainer, isMe ? styles.timeRight : styles.timeLeft]}>
          {/*<MessageTime message={message} alignRight={false} />*/}
        </View>
      </View>
    )
  }

  // Regular messages
  const isMe = message.user._id === Role.me

  return (
    <View style={styles.messageContainer}>
      <View style={[styles.bubbleContainer, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
        <Bubble
          {...(messageProps as any)}
          key={messageProps.key}
          renderUsernameOnMessage={false}
          renderMessageText={() => <View style={styles.messageTextContainer}>{message.renderEvent?.() || null}</View>}
          containerStyle={{
            left: styles.containerLeft,
            right: styles.containerRight,
          }}
          wrapperStyle={{
            left: styles.wrapperLeft,
            right: styles.wrapperRight,
          }}
          textStyle={{
            left: styles.leftText,
            right: styles.rightText,
          }}
          renderTime={() => <MessageTime message={message} alignRight={false} />}
          renderCustomView={() => null}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },

  // Callback type messages (credential offers, proof requests)
  callbackContainer: {
    width: '90%',
  },
  callbackLeft: {
    alignItems: 'flex-start',
  },
  callbackRight: {
    alignItems: 'flex-end',
  },

  // Time
  timeContainer: {
    width: '90%',
    marginTop: 4,
  },
  timeLeft: {
    alignItems: 'flex-start',
  },
  timeRight: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 11,
    opacity: 0.7,
  },

  // Regular messages bubble
  bubbleContainer: {
    width: '90%',
  },
  bubbleLeft: {
    alignItems: 'flex-start',
  },
  bubbleRight: {
    alignItems: 'flex-end',
  },

  // Bubble styles
  containerLeft: {
    margin: 0,
    maxWidth: '100%',
  },
  containerRight: {
    margin: 0,
    maxWidth: '100%',
  },
  wrapperLeft: {
    backgroundColor: 'transparent',
    marginRight: 0,
    padding: 0,
    maxWidth: '100%',
  },
  wrapperRight: {
    backgroundColor: 'transparent',
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
    maxWidth: '100%',
  },
  leftText: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'left',
  },
  rightText: {
    color: '#000000',
    fontSize: 14,
  },

  messageTextContainer: {
    backgroundColor: 'transparent',
  },
})
