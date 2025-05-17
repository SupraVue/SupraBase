/**
 * Utility service for converting between JSON and binary formats for .db files
 */

/**
 * Converts JSON data to a binary format suitable for .db files
 * @param {Object|Array} data The data to convert
 * @returns {Blob} Binary blob representation of the data
 */
export const jsonToBinary = (data) => {
  // Convert data to JSON string
  const jsonString = JSON.stringify(data)
  
  // Create text encoder
  const encoder = new TextEncoder()
  
  // Convert to binary
  const binaryData = encoder.encode(jsonString)
  
  // Return as Blob with database mimetype
  return new Blob([binaryData], { type: 'application/vnd.sqlite3' })
}

/**
 * Converts binary .db file data to JSON
 * @param {Blob|File} binaryData The binary data to convert
 * @returns {Promise<Object|Array>} Parsed JSON data
 */
export const binaryToJson = async (binaryData) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        // Get text content from file
        const text = event.target.result
        
        // Parse JSON
        const jsonData = JSON.parse(text)
        resolve(jsonData)
      } catch (error) {
        reject(new Error('Invalid database file format. Expected valid JSON.'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read database file'))
    
    // Read file as text (our db files are actually JSON in disguise)
    reader.readAsText(binaryData)
  })
}

/**
 * Generate a download URL for a .db file
 * @param {Object|Array} data Data to include in the file
 * @returns {String} URL for downloading the file
 */
export const createDbDownloadUrl = (data) => {
  const blob = jsonToBinary(data)
  return URL.createObjectURL(blob)
}

/**
 * Triggers download of data as a .db file
 * @param {Object|Array} data Data to include in the file
 * @param {String} filename Name of the file (should end with .db)
 */
export const downloadAsDb = (data, filename = 'database.db') => {
  const url = createDbDownloadUrl(data)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
} 