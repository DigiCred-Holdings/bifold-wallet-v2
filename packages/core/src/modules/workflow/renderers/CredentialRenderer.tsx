
/**
 * CredentialRenderer
 *
 * Custom renderer for displaying credentials in chat.
 * Can render as visual cards (VDCard, TranscriptCard) or default text.
 */

import { CredentialExchangeRecord, CredentialPreviewAttribute, CredentialState } from '@credo-ts/core'
import { useAgent } from '@credo-ts/react-hooks'
import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native'

import { ThemedText } from '../../../components/texts/ThemedText'
import { useTheme } from '../../../contexts/theme'
import { ICredentialRenderer, RenderContext } from '../types'
import { VDCard } from './components/VDCard'
import { TranscriptCard } from './components/TranscriptCard'
import { TOKENS, useServices } from '../../../container-api'
import { BifoldError } from '../../../types/error'
import { EventTypes } from '../../../constants'
import { t } from 'i18next'
import { Dimensions } from 'react-native'
import { debug } from 'expo/build/devtools/logger'

export enum CredentialDisplayType {
  STUDENT_ID = 'student_id',
  TRANSCRIPT = 'transcript',
  DEFAULT = 'default',
}

const { width} = Dimensions.get('window')

export function detectCredentialType(credential: CredentialExchangeRecord): CredentialDisplayType {
  const credDefId = (credential as any).metadata?.data?.['_anoncreds/credential']?.credentialDefinitionId || ''
  const credentialAttributes = credential.credentialAttributes || []

  const hasGPA = credentialAttributes.some(
    (attr) =>
      attr.name.toLowerCase().includes('gpa') ||
      attr.name.toLowerCase().includes('termgpa') ||
      attr.name.toLowerCase().includes('cumulativegpa')
  )
  const hasYearStart = credentialAttributes.some(
    (attr) => attr.name.toLowerCase() === 'yearstart' || attr.name.toLowerCase() === 'year_start'
  )

  if (hasGPA || hasYearStart || credDefId.toLowerCase().includes('transcript')) {
    return CredentialDisplayType.TRANSCRIPT
  }

  const hasStudentId = credentialAttributes.some(
    (attr) =>
      attr.name.toLowerCase() === 'studentid' ||
      attr.name.toLowerCase() === 'studentnumber' ||
      attr.name.toLowerCase() === 'student_id'
  )
  const hasStudentName = credentialAttributes.some(
    (attr) =>
      attr.name.toLowerCase() === 'fullname' ||
      attr.name.toLowerCase() === 'studentfullname' ||
      attr.name.toLowerCase() === 'first' ||
      attr.name.toLowerCase() === 'last'
  )

  if (hasStudentId && hasStudentName) {
    return CredentialDisplayType.STUDENT_ID
  }

  if (
    credDefId.includes('NHCS') ||
    credDefId.includes('PCS') ||
    credDefId.includes('M-DCPS') ||
    credDefId.includes('CFCC') ||
    credDefId.includes('Pender') ||
    credDefId.includes('Miami') ||
    credDefId.includes('Hanover')
  ) {
    return CredentialDisplayType.STUDENT_ID
  }

  return CredentialDisplayType.DEFAULT
}

interface CredentialCardProps {
  credential: CredentialExchangeRecord
  context: RenderContext
  onPress?: () => void
}

function useCredentialAttributes(credential: CredentialExchangeRecord) {
  const { agent } = useAgent()
  const [attributes, setAttributes] = useState<CredentialPreviewAttribute[]>(credential.credentialAttributes || [])
  const [loading, setLoading] = useState(false)
  const [credDefId, setCredDefId] = useState<string>(
    (credential as any).metadata?.data?.['_anoncreds/credential']?.credentialDefinitionId || ''
  )

  useEffect(() => {
    if (credential.credentialAttributes && credential.credentialAttributes.length > 0) {
      setAttributes(credential.credentialAttributes)
      return
    }

    if (agent && credential.state === CredentialState.OfferReceived) {
      setLoading(true)
      agent.credentials
        .getFormatData(credential.id)
        .then((formatData) => {
          const { offer, offerAttributes } = formatData
          const offerData = (offer?.anoncreds ?? offer?.indy) as { cred_def_id?: string } | undefined

          if (offerData?.cred_def_id) {
            setCredDefId(offerData.cred_def_id)
          }

          if (offerAttributes && offerAttributes.length > 0) {
            const attrs = offerAttributes.map((item) => new CredentialPreviewAttribute(item))
            setAttributes(attrs)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [agent, credential.id, credential.state, credential.credentialAttributes])

  return { attributes, loading, credDefId }
}

// export const DefaultCredentialCard: React.FC<CredentialCardProps> = ({ credential, context, onPress }) => {
//   const { SettingsTheme } = useTheme()
//   const { attributes: credentialAttributes, loading } = useCredentialAttributes(credential)
//   const fullName = credentialAttributes.find(
//     (attr) => attr.name.toLowerCase() === 'fullname' || attr.name.toLowerCase() === 'studentfullname'
//   )?.value
//   const firstName = credentialAttributes.find((attr) => attr.name.toLowerCase() === 'first')?.value
//   const lastName = credentialAttributes.find((attr) => attr.name.toLowerCase() === 'last')?.value
//   const studentId = credentialAttributes.find(
//     (attr) => attr.name.toLowerCase() === 'studentid' || attr.name.toLowerCase() === 'studentnumber'
//   )?.value
//   const school = credentialAttributes.find((attr) => attr.name.toLowerCase() === 'schoolname')?.value
//
//   const displayName = fullName || (firstName && lastName ? `${firstName} ${lastName}` : '')
//
//   const getStateLabel = () => {
//     switch (credential.state) {
//       case CredentialState.OfferReceived:
//         return context.t('CredentialOffer.CredentialOffer')
//       case CredentialState.Done:
//         return context.t('Credentials.Credential')
//       case CredentialState.Declined:
//         return context.t('Credentials.Credential')
//       default:
//         return credential.state
//     }
//   }
//
//   // const getCredentialName = () => {
//   //   if (!credDefId) return context.t('Credentials.Credential')
//   //   const parts = credDefId.split(':')
//   //   return parts[parts.length - 1] || context.t('Credentials.Credential')
//   // }
//
//   const allAttributes = credentialAttributes.filter(
//     (attr) => !['studentphoto', 'photo', 'student_photo'].includes(attr.name.toLowerCase())
//   )
//
//   const content = (
//     <View style={[styles.card, { backgroundColor: 'transparent'}]}>
//       <View style={[styles.header, { backgroundColor: SettingsTheme.newSettingColors.buttonColor }]}>
//         <ThemedText style={styles.headerText}>{getStateLabel()}</ThemedText>
//       </View>
//
//       <View style={styles.body}>
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="small" color={SettingsTheme.newSettingColors.buttonColor} />
//             <ThemedText style={[styles.loadingText, { color: SettingsTheme.newSettingColors.textColor }]}>
//               {context.t('Global.Loading' as any)}
//             </ThemedText>
//           </View>
//         ) : (
//           <>
//             {school && (
//               <ThemedText style={[styles.school, { color: SettingsTheme.newSettingColors.headerTitle }]}>
//                 {school}
//               </ThemedText>
//             )}
//
//             {displayName && (
//               <ThemedText style={[styles.name, { color: SettingsTheme.newSettingColors.textBody }]}>
//                 {displayName}
//               </ThemedText>
//             )}
//
//             {studentId && (
//               <ThemedText style={[styles.detail, { color: SettingsTheme.newSettingColors.textColor }]}>
//                 {context.t('Chat.StudentID' as any) as string}: {studentId}
//               </ThemedText>
//             )}
//
//             {!school &&
//               !studentId &&
//               !displayName &&
//               allAttributes.slice(0, 4).map((attr, index) => (
//                 <ThemedText key={index} style={[styles.detail, { color: SettingsTheme.newSettingColors.textColor }]}>
//                   {attr.name && attr.value ? `${attr.name}: ${attr.value}` : ''}
//                 </ThemedText>
//               ))}
//
//             {allAttributes.length > 0 && (
//               <ThemedText style={[styles.tapToView, { color: SettingsTheme.newSettingColors.textColor }]}>
//                 {context.t('Chat.TapToView' as any) || 'Tap to view details'}
//               </ThemedText>
//             )}
//           </>
//         )}
//       </View>
//
//       <View style={[styles.bottomLine, { backgroundColor: SettingsTheme.newSettingColors.buttonColor }]} />
//     </View>
//   )
//
//   if (onPress) {
//     return (
//       <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
//         {content}
//       </TouchableOpacity>
//     )
//   }
//
//   return content
// }

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    height: 'auto',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    padding: 12,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 12,
    marginTop: 8,
  },
  credentialName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  school: {
    fontSize: 10,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detail: {
    fontSize: 12,
    marginBottom: 2,
  },
  tapToView: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 8,
    opacity: 0.7,
  },
  bottomLine: {
    height: 4,
  },
  vdCard: {
    width: '100%',
    marginTop: 10,
  },
  statusContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    color: '#212529',
  },
  statusTime: {
    fontSize: 11,
    color: '#6c757d',
    marginTop: 4,
    fontStyle: 'italic',
  },
})

export interface CredentialRendererOptions {
  CardComponent?: React.FC<CredentialCardProps>
  showActions?: boolean
  onPress?: (credential: CredentialExchangeRecord, context: RenderContext) => void
}

export class DefaultCredentialRenderer implements ICredentialRenderer {
  private options: CredentialRendererOptions

  constructor(options: CredentialRendererOptions = {}) {
    this.options = options
  }

  render(credential: CredentialExchangeRecord, context: RenderContext): React.ReactElement {
    const handlePress = this.options.onPress ? () => this.options.onPress!(credential, context) : undefined

    return (
      <View>
        <VDCredentialCard credential={credential} context={context} onPress={handlePress} />
      </View>
    )
  }
}

export function createDefaultCredentialRenderer(options: CredentialRendererOptions = {}): DefaultCredentialRenderer {
  return new DefaultCredentialRenderer(options)
}

export const VDCredentialCard: React.FC<CredentialCardProps> = ({ credential, context, onPress }) => {
  const { SettingsTheme } = useTheme()
  const { attributes, loading, credDefId } = useCredentialAttributes(credential)
  const [CredentialButtons] = useServices([TOKENS.COMPONENT_CREDENTIAL_BUTTONS])
  const [SnackBarMessage] = useServices([TOKENS.COMPONENT_SNACK_BAR_MESSAGE])
  const { agent } = useAgent()
  const [isProcessing, setIsProcessing] = useState(false)
  const [userAction, setUserAction] = useState<'accepted' | 'declined' | null>(null)
  const [isAccepted, setIsAccepted] = useState(false)
  const [isDeclined, setIsDeclined] = useState(false)
  const [declinedData, setDeclinedData] = useState<any>(null)

  useEffect(() => {
    const checkCredentialStatus = async () => {
      if (!agent) return

      try {
        const allCredentials = await agent.credentials.getAll()
        const acceptedCredential = allCredentials.find(
          (cred) => cred.threadId === credential.threadId && cred.state === CredentialState.Done
        )

        const declinedCredential = allCredentials.find(
          (cred) => cred.threadId === credential.threadId && cred.state === CredentialState.Declined
        )

        if (acceptedCredential) {
          setIsAccepted(true)
          setIsDeclined(false)
        } else if (declinedCredential) {
          setIsDeclined(true)
          setIsAccepted(false)

          const savedAttributes = declinedCredential.metadata.get('offerPreview')
          const savedCredDefId = declinedCredential.metadata.get('credDefId')
          const savedSchemaId = declinedCredential.metadata.get('schemaId')

          if (savedAttributes && Array.isArray(savedAttributes)) {
            setDeclinedData({
              attributes: savedAttributes,
              credDefId: savedCredDefId || declinedCredential.metadata.data?._anoncreds?.credential?.credentialDefinitionId || credDefId,
              schemaId: savedSchemaId || declinedCredential.metadata.data?._anoncreds?.credential?.schemaId || ""
            })
          }
        }
      } catch (error) {
        debug('Error checking credential status:', error)
      }
    }

    checkCredentialStatus()
  }, [agent, credential.threadId, credDefId])

  const getAttrValue = (...names: string[]): string | undefined => {
    if (isDeclined && declinedData && declinedData.attributes) {
      const attrs = declinedData.attributes
      for (const name of names) {
        const attr = attrs.find((a: any) => a.name.toLowerCase() === name.toLowerCase())
        if (attr?.value) return attr.value
      }
      return undefined
    }

    for (const name of names) {
      const attr = attributes.find((a) => a.name.toLowerCase() === name.toLowerCase())
      if (attr?.value) return attr.value
    }
    return undefined
  }

  const firstName = getAttrValue('first', 'firstname', 'first_name') || ''
  const lastName = getAttrValue('last', 'lastname', 'last_name') || ''
  const fullName = getAttrValue('fullname', 'studentfullname', 'full_name')
  const studentId = getAttrValue('studentid', 'studentnumber', 'student_id') || ''
  const school = getAttrValue('schoolname', 'school', 'institution')
  const issueDate = getAttrValue('issuedate', 'issue_date', 'expirationdate', 'expiration_date') || ''
  const studentPhoto = getAttrValue('studentphoto', 'photo', 'student_photo')
  const yearStart = getAttrValue('yearstart', 'year_start')
  const yearEnd = getAttrValue('yearend', 'year_end')
  const termGPA = getAttrValue('termgpa', 'term_gpa')
  const cumulativeGPA = getAttrValue('cumulativegpa', 'cumulative_gpa')

  const getCredentialType = () => {
    let sourceAttributes = attributes
    let sourceCredDefId = credDefId
    let sourceSchemaId = ""

    if (isDeclined && declinedData) {
      sourceAttributes = declinedData.attributes || []
      sourceCredDefId = declinedData.credDefId || credDefId
      sourceSchemaId = declinedData.schemaId || ""
    } else {
      sourceSchemaId = (credential as any).metadata?.data?.['_anoncreds/credential']?.schemaId || ""
    }

    const checkSchemaId = sourceSchemaId || (credential as any).metadata?.data?.['_anoncreds/credential']?.schemaId || ""

    if (checkSchemaId.toLowerCase().includes('transcript')) {
      return CredentialDisplayType.TRANSCRIPT
    }

    const hasStudentId = sourceAttributes.some(
      (attr: any) =>
        attr.name.toLowerCase() === 'studentid' ||
        attr.name.toLowerCase() === 'studentnumber' ||
        attr.name.toLowerCase() === 'student_id'
    )
    const hasStudentName = sourceAttributes.some(
      (attr: any) =>
        attr.name.toLowerCase() === 'fullname' ||
        attr.name.toLowerCase() === 'studentfullname' ||
        attr.name.toLowerCase() === 'first' ||
        attr.name.toLowerCase() === 'last'
    )

    if (hasStudentId && hasStudentName) {
      return CredentialDisplayType.STUDENT_ID
    }

    if (
      sourceCredDefId.includes('NHCS') ||
      sourceCredDefId.includes('PCS') ||
      sourceCredDefId.includes('M-DCPS') ||
      sourceCredDefId.includes('CFCC') ||
      sourceCredDefId.includes('Pender') ||
      sourceCredDefId.includes('Miami') ||
      sourceCredDefId.includes('Hanover')
    ) {
      return CredentialDisplayType.STUDENT_ID
    }

    return CredentialDisplayType.DEFAULT
  }

  const credentialType = getCredentialType()

  const handlePress = () => {
    if (onPress && !isDeclined) {
      onPress()
    }
  }

  const handleAccept = useCallback(async () => {
    try {
      if (!agent || isProcessing || userAction) return
      setIsProcessing(true)

      await agent.credentials.acceptOffer({ credentialRecordId: credential.id })
      setUserAction('accepted')
      setIsAccepted(true)
      setIsDeclined(false)
    } catch (err: unknown) {
      const error = new BifoldError(t('Error.Title1024'), t('Error.Message1024'), (err as Error)?.message ?? err, 1024)
      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
    }
  }, [agent, isProcessing, userAction, credential.id])

  const handleDecline = useCallback(async () => {
    if (!agent || !credential) return

    try {
      const formatData = await agent.credentials.getFormatData(credential.id)
      const offerAttributes = formatData.offerAttributes || []


      const credDefId: any =
        formatData.offer?.anoncreds?.cred_def_id ||
        (formatData.offer?.indy as { cred_def_id?: string })?.cred_def_id ||
        credential.metadata.data?.['_anoncreds/credential']?.credentialDefinitionId ||
        ''


      const schemaId =
        formatData.offer?.anoncreds?.schema_id ||
        formatData.offer?.indy?.schema_id ||
        credential.metadata.data?.['_anoncreds/credential']?.schemaId ||
        ''

      await agent.credentials.declineOffer(credential.id)

      const declinedCred = await agent.credentials.findById(credential.id)
      if (declinedCred && offerAttributes.length > 0) {
        await declinedCred.metadata.set('offerPreview', offerAttributes)
        await declinedCred.metadata.set('credDefId', credDefId)
        await declinedCred.metadata.set('schemaId', schemaId)
        await agent.credentials.update(declinedCred)
      }

      const connection = credential.connectionId ? await agent.connections.findById(credential.connectionId) : null

      if (connection) {
        await agent.credentials.sendProblemReport({
          credentialRecordId: credential.id,
          description: t('CredentialOffer.Declined'),
        })
      }

      setUserAction('declined')
    } catch (err: unknown) {
      const error = new BifoldError(t('Error.Title1025'), t('Error.Message1025'), (err as Error)?.message ?? err, 1025)
      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
    }
  }, [agent, credential])

  if (loading) {
    return (
      <View style={[styles.card, { backgroundColor: SettingsTheme.newSettingColors.bgColorUp || '#1a2634' }]}>
        <View style={[styles.header, { backgroundColor: SettingsTheme.newSettingColors.buttonColor }]}>
          <ThemedText style={styles.headerText}>{context.t('CredentialOffer.CredentialOffer')}</ThemedText>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={SettingsTheme.newSettingColors.buttonColor} />
        </View>
      </View>
    )
  }

  const renderCard = () => {
    const currentCredDefId = isDeclined && declinedData ? declinedData.credDefId : credDefId

    if (isDeclined) {
      if (credentialType === CredentialDisplayType.TRANSCRIPT) {
        return (
          <TranscriptCard
            school={school}
            yearStart={yearStart}
            yearEnd={yearEnd}
            termGPA={termGPA}
            cumulativeGPA={cumulativeGPA}
            fullname={fullName || `${firstName} ${lastName}`}
            isInChat={context.isInChat}
          />
        )
      } else {
        return (
          <VDCard
            firstName={firstName}
            lastName={lastName}
            fullName={fullName}
            studentId={studentId}
            school={school}
            issueDate={issueDate}
            credDefId={currentCredDefId}
            issuerName={context.theirLabel}
            isInChat={context.isInChat}
            studentPhoto={studentPhoto}
          />
        )
      }
    }

    if (studentId && (firstName || lastName || fullName)) {
      return (
        <VDCard
          firstName={firstName}
          lastName={lastName}
          fullName={fullName}
          studentId={studentId}
          school={school}
          issueDate={issueDate}
          credDefId={currentCredDefId}
          issuerName={context.theirLabel}
          isInChat={context.isInChat}
          studentPhoto={studentPhoto}
        />
      )
    }

    switch (credentialType) {
      case CredentialDisplayType.STUDENT_ID:
        return (
          <VDCard
            firstName={firstName}
            lastName={lastName}
            fullName={fullName}
            studentId={studentId}
            school={school}
            issueDate={issueDate}
            credDefId={currentCredDefId}
            issuerName={context.theirLabel}
            isInChat={context.isInChat}
            studentPhoto={studentPhoto}
          />
        )

      case CredentialDisplayType.TRANSCRIPT:
        return (
          <TranscriptCard
            school={school}
            yearStart={yearStart}
            yearEnd={yearEnd}
            termGPA={termGPA}
            cumulativeGPA={cumulativeGPA}
            fullname={fullName || `${firstName} ${lastName}`}
            isInChat={context.isInChat}
          />
        )
      default:
        // return <DefaultCredentialCard credential={credential} context={context} onPress={onPress} />
    }
  }

  const cardContent = renderCard()
  const showButtons = credential.state === CredentialState.OfferReceived && !userAction && !isDeclined && !isAccepted

  if (isDeclined) {
    return (
      <View>
        <View style={{ opacity: 0.5 }}>
          <View>{cardContent}</View>
          <CredentialButtons isProcessing={false} onAccept={() => {}} onDecline={() => {}} isDisabled={true} />
        </View>
        <SnackBarMessage message={t('Credentials.Declined')} type={'warning'} />
      </View>
    )
  }

  if (isAccepted) {
    return (
      <View>
        <View style={{ opacity: 0.5, marginBottom: 10 }}>
          <View>{cardContent}</View>
        </View>

        <View>
          {onPress ? (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
              {cardContent}
            </TouchableOpacity>
          ) : (
            <View>{cardContent}</View>
          )}
        </View>

        <SnackBarMessage message={t('Credentials.AcceptedNote')} type={'success'} />
      </View>
    )
  }

  return (
    <View>
      <View>
        {onPress && userAction !== 'declined' ? (
          <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            {cardContent}
          </TouchableOpacity>
        ) : (
          <View>{cardContent}</View>
        )}
      </View>

      {showButtons && CredentialButtons && (
        <View style={{ marginTop: 10 }}>
          <CredentialButtons isProcessing={isProcessing} onAccept={handleAccept} onDecline={handleDecline} isDisabled={false} />
        </View>
      )}
    </View>
  )
}


export interface VDCredentialRendererOptions {
  onPress?: (credential: CredentialExchangeRecord, context: RenderContext) => void
  forceDisplayType?: CredentialDisplayType
}

export class VDCredentialRenderer implements ICredentialRenderer {
  private options: VDCredentialRendererOptions

  constructor(options: VDCredentialRendererOptions = {}) {
    this.options = options
  }

  render(credential: CredentialExchangeRecord, context: RenderContext): React.ReactElement {
    const handlePress = this.options.onPress ? () => this.options.onPress!(credential, context) : () => {}

    return (
      <View style={styles.vdCard}>
        <VDCredentialCard credential={credential} context={context} onPress={handlePress} />
      </View>
    )
  }
}

export function createVDCredentialRenderer(options: VDCredentialRendererOptions = {}): VDCredentialRenderer {
  return new VDCredentialRenderer(options)
}