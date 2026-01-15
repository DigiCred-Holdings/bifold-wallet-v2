/* eslint-disable no-console */
/**
 * ActionMenuBubble Component
 *
 * Renders action menu messages using ContentRegistry and FormFieldRegistry.
 * Enhanced with registry pattern for extensibility and ported from bifold-wallet-1 with enhanced styling for dark themes.
 */

import React, { useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { useTheme } from '../../../../contexts/theme'
import { ActionMenuContentItem, ActionMenuFormField } from '../../types'
import { ContentRegistry, FormFieldRegistry } from '../../ui-elements'
import { TOKENS, useServices } from '../../../../container-api'

interface ActionMenuBubbleProps {
  content: ActionMenuContentItem[]
  workflowID: string
  onActionPress: (actionId: string, workflowID: string, invitationLinkOrData?: string | any) => void
}

interface FormData {
  [key: string]: any
}

export const ActionMenuBubble: React.FC<ActionMenuBubbleProps> = ({ content, workflowID, onActionPress }) => {
  const { ColorPalette } = useTheme()
  const [formData, setFormData] = useState<FormData>({})
  const { width } = Dimensions.get('window')
  const [GradientBackground] = useServices([TOKENS.COMPONENT_GRADIENT_BACKGROUND])

  // Dynamic styles based on theme
  const themedStyles = StyleSheet.create({
    bubble: {
      backgroundColor: ColorPalette.grayscale.digicredBackgroundModal,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: ColorPalette.grayscale.digicredBorderAction,
      width: width * 0.85,
      gap: 10,
      alignSelf: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
      color: ColorPalette.brand.text,
    },
    image: {
      width: '100%',
      height: 150,
      marginBottom: 12,
      borderRadius: 8,
    },
    description: {
      fontSize: 15,
      marginBottom: 12,
      color: ColorPalette.brand.text,
      lineHeight: 22,
    },
    buttonContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    button: {
      flexDirection: 'row',
      paddingTop: 12,
      paddingRight: 27,
      paddingBottom: 12,
      paddingLeft: 32,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1,
      height: 50,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '700',
      lineHeight: 24,
      textAlign: 'center',
      color: ColorPalette.grayscale.white,
      textTransform: 'uppercase',
    },
    textInput: {
      height: 48,
      borderColor: ColorPalette.brand.primary,
      borderWidth: 1.5,
      marginBottom: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: ColorPalette.brand.tertiaryBackground,
      color: ColorPalette.brand.text,
      fontSize: 15,
    },
    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingVertical: 4,
    },
    radioButtonIcon: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: ColorPalette.brand.primary,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonIconSelected: {
      backgroundColor: ColorPalette.brand.primary,
    },
    radioButtonText: {
      fontSize: 15,
      color: ColorPalette.brand.text,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: ColorPalette.brand.text,
      marginBottom: 8,
    },
    fieldContainer: {
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: ColorPalette.brand.text,
      marginBottom: 8,
    },
    radioRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingVertical: 4,
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    radioLabel: {
      fontSize: 15,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderRadius: 4,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxLabel: {
      fontSize: 15,
    },
    mcqRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
    },
    mcqBox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderRadius: 4,
      marginRight: 10,
    },
    mcqLabel: {
      fontSize: 15,
    },
    dropdown: {
      height: 48,
      borderWidth: 1,
      borderRadius: 8,
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    dropdownList: {
      borderRadius: 8,
      maxHeight: 200,
    },
    dropdownItem: {
      padding: 12,
      borderBottomWidth: 1,
    },
    dateButton: {
      height: 48,
      borderWidth: 1,
      borderRadius: 8,
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    slider: {
      width: '100%',
      height: 40,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

  const colors = {
    primary: ColorPalette.brand.primary,
    text: ColorPalette.brand.text,
    background: ColorPalette.brand.secondaryBackground,
    border: ColorPalette.brand.primary,
  }

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAction = (actionId: string, data?: any) => {
    if (typeof data === 'string' && data.length > 0) {
      // It's an invitationLink - pass it
      onActionPress(actionId, workflowID, data)
    } else {
      // No invitationLink - call with only 2 params
      onActionPress(actionId, workflowID)
    }
  }

  // Legacy rendering for backward compatibility
  const renderFormField = (field: ActionMenuFormField, index: number) => {
    if (!field) {
      return null
    }

    switch (field.type) {
      case 'text': {
        return (
          <TextInput
            key={index}
            style={themedStyles.textInput}
            placeholder={field.label}
            placeholderTextColor={ColorPalette.grayscale.lightGrey}
            value={formData[field.name] ? formData[field.name]?.toString() : ''}
            onChangeText={(text) => setFormData({ ...formData, [field.name]: text })}
          />
        )
      }
      case 'radio': {
        return (
          <View key={index}>
            <Text style={themedStyles.formLabel}>{field.label}</Text>
            {field.options?.map((option: string, optionIndex: number) => (
              <TouchableOpacity
                key={optionIndex}
                style={themedStyles.radioButton}
                onPress={() => setFormData({ ...formData, [field.name]: option })}
              >
                <View
                  style={[
                    themedStyles.radioButtonIcon,
                    formData[field.name] === option && themedStyles.radioButtonIconSelected,
                  ]}
                />
                <Text style={themedStyles.radioButtonText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )
      }
      default:
        return null
    }
  }

  // Legacy content rendering for backward compatibility
  const renderLegacyContent = (item: ActionMenuContentItem, index: number) => {
    const key = `${item.type}_${index}${item.actionID ? `_${item.actionID}` : ''}${
      item.text ? `_${item.text.substring(0, 10)}` : ''
    }`
    switch (item.type) {
      case 'image':
        return item.url ? (
          <Image key={key} source={{ uri: item.url }} style={themedStyles.image} resizeMode="contain" />
        ) : null
      case 'title':
        return (
          <Text key={key} style={themedStyles.title}>
            {item.text}
          </Text>
        )
      case 'text':
        return (
          <Text key={key} style={themedStyles.description}>
            {item.text}
          </Text>
        )
      case 'button':
        return (
          <GradientBackground key={key} buttonPurple style={themedStyles.button}>
            <TouchableOpacity
              onPress={() => onActionPress(item.actionID ?? '', workflowID, item.invitationLink)}
              activeOpacity={0.8}
            >
              <Text style={themedStyles.buttonText}>{item.label}</Text>
            </TouchableOpacity>
          </GradientBackground>
        )
      case 'form':
        return (
          <View key={key}>
            {item.fields?.map((field: ActionMenuFormField, fieldIndex: number) => renderFormField(field, fieldIndex))}
          </View>
        )
      default:
        return null
    }
  }

  // Check if we should use registry pattern or legacy rendering
  const useRegistry = ContentRegistry && ContentRegistry.render

  return (
    <View style={themedStyles.bubble}>
      {useRegistry
        ? content.map((item, index) => (
            <View key={index}>
              {ContentRegistry.render(item.type, {
                item,
                onAction: handleAction,
                styles: themedStyles,
                colors,
                formData,
                onFieldChange: handleFieldChange,
                FormFieldRegistry,
                content,
              })}
            </View>
          ))
        : content.map((item, index) => renderLegacyContent(item, index))}
    </View>
  )
}
