export {}

declare global {
  interface Window {
    google: any
    __googleMapsCallback__?: () => void
  }
  type userDataType = {
    id: string
    email: string
    name: string
    password: string
    roles: string
    isVerified: boolean
    createdDate: string
    updatedDate: string
    photo: string
    iat?: number
    exp?: number
  }
  type auditDataType = {
    id: string
    entityName: string
    entityId: string
    fieldName: string
    fieldValue: string
    userId: string
    createdDate: string
    user?: userDataType
  }
  type reportDataType = {
    id: string
    title: string
    description: string
    userId: string
    status: string
    thumbnailUrl: string
    recordUrl: string
    expiryTimeInMinutes: number
    calculatedClass?: string
    user?: any
    createdDate: string
    updatedDate: string
  }
  type streamDataType = {
    id: string
    url: string
    userId: string
    inactive: boolean
    user?: any
    createdDate: string
    updatedDate: string
  }
  type liveDataType = {
    id: string
    url?: string
    path: string
    streamId: string
    stream?: streamDataType
    userId: string
    user?: userDataType
    report?: any
    expiryTimeInMinutes: number
    createdDate: string
    updatedDate: string
  }
  type extendedUserDataType = userDataType & { authenticationId: string }
  type cookieType = 'credentials' | (string & {})
  type latLngType = {
    latitude: string
    longitude: string
  }
  type DropdownType = {
    label: string
    value: string
  }
  type AxiosResponseResult<T> = {
    success: boolean
    result?: T
    message?: T
  }
}
