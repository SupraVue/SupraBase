/**
 * Database service for managing data in a .db file
 */

import { jsonToBinary, binaryToJson, downloadAsDb } from './dbConverter.js'

// Default sample data
const DEFAULT_DATA = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Editor' }
]

const DB_FILE_NAME = 'app-data.db'
const STORAGE_KEY = 'dbFileCache'

/**
 * Helper function to read from the DB file
 * @returns {Promise<Array>} Database records
 */
const readDbFile = async () => {
  return new Promise((resolve) => {
    try {
      // Check if app is running in browser environment
      if (typeof window !== 'undefined') {
        // In browser, check if we have data in localStorage first
        const cachedData = localStorage.getItem(STORAGE_KEY)
        if (cachedData) {
          resolve(JSON.parse(cachedData))
          return
        }
        
        // Initialize with default data if no cached data exists
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA))
        resolve(DEFAULT_DATA)
      } else {
        // This would be for Node.js environment, not used in browser
        resolve(DEFAULT_DATA)
      }
    } catch (error) {
      console.error('Error reading database file:', error)
      resolve([])
    }
  })
}

/**
 * Helper function to write to the DB file
 * @param {Array} data Data to write
 * @returns {Promise<Boolean>} Success status
 */
const writeDbFile = async (data) => {
  return new Promise((resolve) => {
    try {
      // In browser environment, store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        resolve(true)
      } else {
        // This would be for Node.js environment, not used in browser
        resolve(true)
      }
    } catch (error) {
      console.error('Error writing database file:', error)
      resolve(false)
    }
  })
}

/**
 * Load all data from database file
 * @returns {Promise<Array>} Array of database records
 */
export const loadAll = async () => {
  return new Promise((resolve) => {
    // Simulate network delay for realistic behavior
    setTimeout(async () => {
      const data = await readDbFile()
      resolve(data)
    }, 600)
  })
}

/**
 * Add a new record to the database
 * @param {Object} record Record to add (without ID)
 * @returns {Promise<Object>} Added record with ID
 */
export const addRecord = async (record) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const data = await readDbFile()
        const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1
        
        const newRecord = {
          id: newId,
          ...record
        }
        
        data.push(newRecord)
        await writeDbFile(data)
        resolve(newRecord)
      } catch (error) {
        console.error('Error adding record:', error)
        reject(new Error('Failed to add record'))
      }
    }, 400)
  })
}

/**
 * Update an existing record
 * @param {Number} id ID of the record to update
 * @param {Object} updatedRecord Updated record data
 * @returns {Promise<Object>} Updated record
 */
export const updateRecord = async (id, updatedRecord) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const data = await readDbFile()
        const index = data.findIndex(item => item.id === id)
        
        if (index === -1) {
          reject(new Error(`Record with ID ${id} not found`))
          return
        }
        
        const updated = {
          id,
          ...updatedRecord
        }
        
        data[index] = updated
        await writeDbFile(data)
        resolve(updated)
      } catch (error) {
        console.error('Error updating record:', error)
        reject(new Error('Failed to update record'))
      }
    }, 400)
  })
}

/**
 * Delete a record from the database
 * @param {Number} id ID of the record to delete
 * @returns {Promise<Boolean>} Success status
 */
export const deleteRecord = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const data = await readDbFile()
        const filteredData = data.filter(item => item.id !== id)
        
        if (data.length === filteredData.length) {
          reject(new Error(`Record with ID ${id} not found`))
          return
        }
        
        await writeDbFile(filteredData)
        resolve(true)
      } catch (error) {
        console.error('Error deleting record:', error)
        reject(new Error('Failed to delete record'))
      }
    }, 400)
  })
}

/**
 * Export database to a .db file
 * @returns {Promise<void>}
 */
export const exportDatabase = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const data = await readDbFile()
        if (!data || data.length === 0) {
          reject(new Error('No data to export'))
          return
        }
        
        // Download as .db file
        downloadAsDb(data, DB_FILE_NAME)
        resolve()
      } catch (error) {
        console.error('Error exporting database:', error)
        reject(new Error('Failed to export database'))
      }
    }, 400)
  })
}

/**
 * Import database from a .db file
 * @param {File} file .db file to import
 * @returns {Promise<Array>} Imported data
 */
export const importDatabase = async (file) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        // Convert binary db file to JSON
        const data = await binaryToJson(file)
        
        if (!Array.isArray(data)) {
          reject(new Error('Invalid database format, expected array'))
          return
        }
        
        // Save to local storage
        await writeDbFile(data)
        resolve(data)
      } catch (error) {
        console.error('Error importing database:', error)
        reject(new Error('Failed to import database: ' + error.message))
      }
    }, 400)
  })
}

/**
 * Reset database to default state
 * @returns {Promise<Array>} Default database data
 */
export const resetDatabase = async () => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      await writeDbFile(DEFAULT_DATA)
      resolve(DEFAULT_DATA)
    }, 400)
  })
} 