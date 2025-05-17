# SupraBase - Vue.js Database
# ! Local Hosting only ! 
A modern database management system built with Vue.js.

## Features

- Local database with .db file support
- Import and export data in .db format
- Simple interface for data management
- MySQL database support

## Technologies

- Vue.js 3
- Vue Router
- Local storage (localStorage)
- .db file system

## Installation and Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

- `src/services/dbFile.js` - Service for working with .db files
- `src/services/dbConverter.js` - Utilities for data conversion
- `src/services/userModel.js` - Model for user management
- `src/views/` - View components

## Working with .db Files

The project supports exporting and importing data in .db file format:

1. To export data, click the "Create .db file" button
2. To import data, use the "Import .db file" button

## Local Hosting

To host this application on your local machine:

1. After building the project with `npm run build`
2. You can serve the contents of the `dist` folder using a local server
3. For a simple local server, you can use:
   ```bash
   npm install -g serve
   serve -s dist
   ```
4. The application will be available at http://localhost:5000

## License

MIT
