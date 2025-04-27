export function useMimeType() {

  const convertMimeType = (mimeType: string) => {
    switch (mimeType) {
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'Excel'
      case 'application/pdf':
        return 'PDF'
      case "image/png":
        return "PNG";
      case "image/jpeg":
        return "JPG";
      default:
        return mimeType
    }
  }

  const isImage = (mimeType: string) => {
    const mimeTypes = [
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
    ]

    return mimeTypes.indexOf(mimeType) > -1
  }

  return {
    convertMimeType,
    isImage
  }
}
