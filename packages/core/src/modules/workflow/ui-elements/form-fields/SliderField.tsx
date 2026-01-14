import React from 'react'
import { View, Text } from 'react-native'
import Slider from '@react-native-community/slider'
import { FormFieldProps, FormFieldRegistry } from '../FormFieldRegistry'

const SliderField: React.FC<FormFieldProps> = ({ field, value, onChange, styles, colors }) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value || field.min || 0

  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{field.label}</Text>
      <Slider
        style={styles.slider}
        value={numValue}
        onSlidingComplete={(val) => onChange(Math.round(val).toString())}
        minimumValue={field.min}
        maximumValue={field.max}
        step={1}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
      />
      <Text style={[styles.label, { color: colors.text, textAlign: 'center' }]}>{Math.round(numValue)}</Text>
    </View>
  )
}

FormFieldRegistry.register('slider', SliderField)

export default SliderField
