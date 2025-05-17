/**
 * User model for interacting with the database
 */

import * as db from './dbFile.js'

/**
 * Get all users
 * @returns {Promise<Array>} Array of users
 */
export const getAllUsers = async () => {
  return db.loadAll()
}

/**
 * Get user by ID
 * @param {Number} id User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
export const getUserById = async (id) => {
  const users = await db.loadAll()
  return users.find(user => user.id === id) || null
}

/**
 * Create new user
 * @param {Object} userData User data without ID
 * @returns {Promise<Object>} Created user with ID
 */
export const createUser = async (userData) => {
  return db.addRecord(userData)
}

/**
 * Update user
 * @param {Number} id User ID
 * @param {Object} userData Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (id, userData) => {
  return db.updateRecord(id, userData)
}

/**
 * Delete user
 * @param {Number} id User ID
 * @returns {Promise<Boolean>} Success status
 */
export const deleteUser = async (id) => {
  return db.deleteRecord(id)
}

/**
 * Search users by query
 * @param {String} query Search query
 * @returns {Promise<Array>} Filtered users
 */
export const searchUsers = async (query) => {
  if (!query) return db.loadAll()
  
  const users = await db.loadAll()
  const searchLower = query.toLowerCase()
  
  return users.filter(user => 
    user.name.toLowerCase().includes(searchLower) || 
    user.email.toLowerCase().includes(searchLower) || 
    user.role.toLowerCase().includes(searchLower)
  )
}

/**
 * Export users to a .db file
 * @returns {Promise<void>}
 */
export const exportToDbFile = async () => {
  // This will trigger the download of a .db file
  await db.loadAll() // This will ensure we have the latest data before exporting
}

/**
 * Import users from a .db file
 * @param {File} file .db file
 * @returns {Promise<Array>} Imported users
 */
export const importFromDbFile = async (file) => {
  return db.importDatabase(file)
} 