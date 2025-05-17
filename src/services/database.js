/**
 * Database service for managing data in local storage
 */

// Default sample data
const DEFAULT_DATA = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Editor' }
]

const DB_KEY = 'localDbData'

/**
 * Load all data from local database
 * @returns {Promise<Array>} Array of database records
 */
export const loadAll = async () => {
  return new Promise((resolve) => {
    // Simulate network delay for realistic behavior
    setTimeout(() => {
      try {
        const data = localStorage.getItem(DB_KEY)
        if (data) {
          resolve(JSON.parse(data))
        } else {
          // Initialize with default data
          localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA))
          resolve(DEFAULT_DATA)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        // Return empty array on error
        resolve([])
      }
    }, 600) // Simulate a 600ms loading time
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
        const data = await loadAll()
        const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1
        
        const newRecord = {
          id: newId,
          ...record
        }
        
        data.push(newRecord)
        localStorage.setItem(DB_KEY, JSON.stringify(data))
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
        const data = await loadAll()
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
        localStorage.setItem(DB_KEY, JSON.stringify(data))
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
        const data = await loadAll()
        const filteredData = data.filter(item => item.id !== id)
        
        if (data.length === filteredData.length) {
          reject(new Error(`Record with ID ${id} not found`))
          return
        }
        
        localStorage.setItem(DB_KEY, JSON.stringify(filteredData))
        resolve(true)
      } catch (error) {
        console.error('Error deleting record:', error)
        reject(new Error('Failed to delete record'))
      }
    }, 400)
  })
}

/**
 * Export database to JSON file
 * @returns {Promise<String>} Database URL for download
 */
export const exportDatabase = async () => {
  return new Promise((resolve, reject) => {
    try {
      const data = localStorage.getItem(DB_KEY)
      if (!data) {
        reject(new Error('No data to export'))
        return
      }
      
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      resolve(url)
    } catch (error) {
      console.error('Error exporting database:', error)
      reject(new Error('Failed to export database'))
    }
  })
}

/**
 * Import database from JSON file
 * @param {File} file JSON file to import
 * @returns {Promise<Array>} Imported data
 */
export const importDatabase = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          
          if (!Array.isArray(data)) {
            reject(new Error('Invalid database format, expected array'))
            return
          }
          
          localStorage.setItem(DB_KEY, JSON.stringify(data))
          resolve(data)
        } catch (error) {
          reject(new Error('Invalid JSON format'))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    } catch (error) {
      console.error('Error importing database:', error)
      reject(new Error('Failed to import database'))
    }
  })
}

/**
 * Reset database to default state
 * @returns {Promise<Array>} Default database data
 */
export const resetDatabase = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA))
      resolve(DEFAULT_DATA)
    }, 400)
  })
} 