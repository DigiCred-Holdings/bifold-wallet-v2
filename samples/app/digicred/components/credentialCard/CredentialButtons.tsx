import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { DigiCredButton } from '../index'
import { DigiCredColors } from '../../theme'

interface CredentialButtonsProps {
  isProcessing: boolean
  onAccept: () => void
  onDecline: () => void
}

const CredentialButtons: React.FC<CredentialButtonsProps> = ({ isProcessing, onAccept, onDecline }) => {
  return (
    <View style={styles.groupButton}>
      <DigiCredButton
        title="Decline"
        onPress={onDecline}
        variant="secondary"
        disabled={isProcessing}
        customStyle={styles.declineButton}
        customTextStyle={styles.declineButtonText}
      />

      <View style={styles.acceptGradientWrapper}>
        <LinearGradient
          colors={DigiCredColors.homeNoChannels.buttonGradient}
          locations={DigiCredColors.homeNoChannels.buttonGradientLocations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.acceptGradient}
        >
          <DigiCredButton
            title="Accept"
            onPress={onAccept}
            variant="primary"
            disabled={isProcessing}
            customStyle={styles.acceptButton}
            customTextStyle={styles.acceptButtonText}
          />
        </LinearGradient>
      </View>
    </View>
  )
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const buttonWidth = Math.min(SCREEN_WIDTH * 0.4, 120)

const styles = StyleSheet.create({
  groupButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 190,
    alignItems: 'center',
    marginTop: 10,
  },
  declineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: DigiCredColors.text.homePrimary,
    borderRadius: 25,
    width: buttonWidth,
    height: 45,
    padding: 0,
    justifyContent: 'center',
  },
  declineButtonText: {
    color: DigiCredColors.text.homePrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },

  acceptGradientWrapper: {
    width: buttonWidth,
    height: 45,
  },
  acceptGradient: {
    borderRadius: 25,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    width: '100%',
    height: '100%',
    padding: 0,
  },
  acceptButtonText: {
    color: DigiCredColors.text.homePrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    textTransform: 'uppercase',
  },
})

export default CredentialButtons
