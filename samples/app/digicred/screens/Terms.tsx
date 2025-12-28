import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { useStore, DispatchAction, testIdWithKey, ThemedText } from '@bifold/core'

import { GradientBackground, CardModal, DigiCredButton } from '../components'

export const TermsVersion = '1.0'

const Terms: React.FC = () => {
  const [store, dispatch] = useStore()
  useNavigation<StackNavigationProp<Record<string, object | undefined>>>()
  const [checked, setChecked] = useState(false)

  const agreedToPreviousTerms = store.onboarding.didAgreeToTerms

  const scrollY = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef<ScrollView>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const [scrollViewHeight, setScrollViewHeight] = useState(0)
  const [showScrollbar, setShowScrollbar] = useState(false)

  const onSubmitPressed = useCallback(() => {
    dispatch({
      type: DispatchAction.DID_AGREE_TO_TERMS,
      payload: [{ DidAgreeToTerms: TermsVersion }],
    })
  }, [dispatch])

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height)
  }

  const handleScrollViewLayout = useCallback((event: LayoutChangeEvent) => {
    setScrollViewHeight(event.nativeEvent.layout.height)
  }, [])

  useEffect(() => {
    if (contentHeight > 0 && scrollViewHeight > 0) {
      setShowScrollbar(contentHeight > scrollViewHeight)
    }
  }, [contentHeight, scrollViewHeight])

  const scrollIndicatorSize = showScrollbar ? Math.max(scrollViewHeight * (scrollViewHeight / contentHeight), 40) : 0

  const scrollIndicatorPosition = scrollY.interpolate({
    inputRange: [0, Math.max(1, contentHeight - scrollViewHeight)],
    outputRange: [0, Math.max(0, scrollViewHeight - scrollIndicatorSize)],
    extrapolate: 'clamp',
  })

  return (
    <GradientBackground>
      <View style={styles.container}>
        <CardModal style={styles.card} fullHeight customStyle={styles.cardModalCustomStyle}>
          <Text style={styles.title}>Terms And Conditions</Text>
          <View style={styles.scrollContainer}>
            <Animated.ScrollView
              ref={scrollViewRef}
              style={{ flex: 1, width: '100%' }}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
              scrollEventThrottle={16}
              onContentSizeChange={handleContentSizeChange}
              onLayout={handleScrollViewLayout}
            >
              <ThemedText style={styles.subtitle}>
                {`Please agree to the terms and conditions below before using this application.`}
              </ThemedText>
              <ThemedText style={styles.bodyText}>
                {`These terms and conditions (Terms) govern your use of the DigiCred Mobile Wallet ("App"), developed by DigiCred Holdings Inc. ("Developer"). By downloading, installing, or using the App, you agree to be bound by these Terms. If you do not agree to these Terms, do not use this App.`}
              </ThemedText>
              <ThemedText style={styles.bodyText}>
                <ThemedText style={{ fontWeight: '700', color: '#FFFFFF' }}>Definitions</ThemedText>{' '}
                {`"User" refers to any person who downloads, installs, or uses the App. "Content" refers to any text, images, or other media through the App.`}
              </ThemedText>
              <ThemedText style={styles.bodyText}>
                <ThemedText style={styles.bodyTextHeader}>License</ThemedText>{' '}
                {`Subject to your compliance with these Terms, the Developer Grants you a limited non-exclusive, non-transferrable license to use the App for personal, non-commercial purposes. You may not copy, modify, distribute, sell, or lease any part of the App.`}
              </ThemedText>
              <ThemedText style={styles.bodyText}>
                <ThemedText style={styles.bodyTextHeader}>User Responsibilities</ThemedText>{' '}
                {`You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to use the App in compliance with all applicable laws and regulations.`}
              </ThemedText>
              <ThemedText style={styles.bodyText}>
                <ThemedText style={styles.bodyTextHeader}>Intellectual Property</ThemedText>{' '}
                {`All intellectual property rights in the App, including but not limited to copyrights, trademarks, and trade secrets, are owned by the Developer or its licensors. You are granted only the rights expressly stated in these Terms.`}
              </ThemedText>
              <ThemedText style={styles.bodyText}>
                <ThemedText style={styles.bodyTextHeader}>Disclaimer of Warranties</ThemedText>{' '}
                {`The App is provided "as is" without warranties of any kind, either express or implied. The Developer does not guarantee that the App will be error-free, uninterrupted, or secure.`}
              </ThemedText>
              <ThemedText style={styles.bodyText}>
                <ThemedText style={styles.bodyTextHeader}>Limitation of Liability</ThemedText>{' '}
                {`To the maximum extent permitted by law, the Developer shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the App.`}
              </ThemedText>
              <ThemedText style={styles.bodyText}>
                <ThemedText style={styles.bodyTextHeader}>Termination</ThemedText>{' '}
                {`The Developer may terminate or suspend your access to the App at any time, without prior notice, for conduct that violates these Terms or is harmful to other users, the Developer, or third parties.`}
              </ThemedText>
              <ThemedText style={styles.bodyText}>
                <ThemedText style={styles.bodyTextHeader}>Changes to Terms</ThemedText>{' '}
                {`The Developer reserves the right to modify these Terms at any time. Continued use of the App after changes constitutes acceptance of the modified Terms.`}
              </ThemedText>
              <ThemedText style={styles.bodyText}>
                <ThemedText style={styles.bodyTextHeader}>Governing Law</ThemedText>{' '}
                {`These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where the Developer is established, without regard to its conflict of law provisions.`}
              </ThemedText>
            </Animated.ScrollView>
            {showScrollbar && (
              <View style={styles.scrollbarContainer}>
                <Animated.View
                  style={[
                    styles.scrollbarThumb,
                    {
                      height: scrollIndicatorSize,
                      transform: [{ translateY: scrollIndicatorPosition }],
                    },
                  ]}
                />
              </View>
            )}
          </View>

          {!agreedToPreviousTerms && (
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                testID={testIdWithKey('IAgree')}
                onPress={() => setChecked(!checked)}
                style={checked ? [styles.checkbox, styles.checkboxChecked] : styles.checkbox}
              >
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <ThemedText style={[styles.checkboxLabel, checked ? styles.checkboxLabelChecked : {}]}>
                I have read, understand and accept the terms and conditions.
              </ThemedText>
            </View>
          )}

          <DigiCredButton
            title={'Continue'}
            onPress={onSubmitPressed}
            disabled={!checked && !agreedToPreviousTerms}
            testID={testIdWithKey('Continue')}
            accessibilityLabel={'Continue'}
            variant="primary"
            customStyle={styles.buttonCustomStyle}
            customTextStyle={styles.buttonTextCustomStyle}
          />
        </CardModal>
      </View>
    </GradientBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginTop: 40,
    flex: 1,
  },
  cardModalCustomStyle: {
    backgroundColor: '#25272A',
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.48)',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    maxHeight: Dimensions.get('window').height * 0.85,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 24,
    alignSelf: 'stretch',
    marginTop: 20,
  },
  title: {
    fontFamily: 'Open Sans',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 24,
    color: '#FFFFFF',
    width: '100%',
  },
  bodyTextHeader: { fontWeight: '700', color: '#FFFFFF' },
  scrollContainer: {
    position: 'relative',
    height: '70%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    paddingRight: 24,
  },
  subtitle: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#FFFFFF',
    width: '100%',
    marginBottom: 20,
  },
  bodyText: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: '#B5B3BC',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
    marginTop: 8,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: '#B5B3BC',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 5,
  },
  checkboxChecked: {
    backgroundColor: '#6C5CE7',
    borderColor: 'white',
    borderWidth: 1,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: '#B5B3BC',
    flex: 1,
  },
  checkboxLabelChecked: {
    color: '#ffffff',
  },
  buttonCustomStyle: {
    display: 'flex',
    paddingVertical: 12,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#004D4D',
    minWidth: 154,
    height: 48,
    opacity: 1,
  },
  buttonTextCustomStyle: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 24,
    color: '#FFFFFF',
    textTransform: 'none' as const,
    letterSpacing: 0,
  },
  scrollbarContainer: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  scrollbarThumb: {
    position: 'absolute',
    right: 0,
    width: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#005F5F',
  },
})

export default Terms