declare module 'react-native-html-to-pdf' {
  export interface Options {
    html: string
    fileName?: string
    directory?: string
    base64?: boolean
    width?: number
    height?: number
  }

  export interface Result {
    filePath: string
    base64?: string
  }

  const RNHTMLtoPDF: {
    convert(options: Options): Promise<Result>
  }

  export default RNHTMLtoPDF
}
