# Vibe Kitchen Drive

Vibe Kitchen Drive is a cloud storage solution similar to Google Drive, providing file storage and management capabilities.

## Features Implemented

- **File Upload & Storage**: Upload and store files securely in the cloud
- **Folder Management**: Create, navigate, and organize folders
- **File Hierarchy**: Maintain parent-child relationships between files and folders
- **User-based File Organization**: Files are associated with specific user email accounts
- **File Metadata**: Store and retrieve file metadata (size, type, creation date, etc.)
- **File Download**: Download stored files with proper content types
- **File Renaming & Moving**: Rename files and move them between folders
- **Recursive Folder Operations**: Delete folders with all their contents

## Technologies Used

### Frontend
- **Angular**: Modern frontend framework for building the user interface
- **TypeScript**: Strongly typed programming language
- **Angular Material**: UI component library for Angular applications
- **RxJS**: Reactive programming library for handling asynchronous operations

### Backend
- **Java Spring Boot**: Core application framework
- **JPA/Hibernate**: ORM for database operations
- **Google Cloud Storage**: Cloud storage for file content
- **RESTful API**: API design pattern for client-server communication

### Database
- **SQL Database**: Storing file metadata and relationships

### Development Tools
- **Maven**: Dependency management and build tool
- **Git**: Version control

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven
- Google Cloud account with Storage enabled

### Configuration
1. Clone the repository
   ```
   git clone https://github.com/yourusername/vibe-kitchen-drive.git
   cd vibe-kitchen-drive
   ```

2. Configure Google Cloud Storage
   - Create a GCS bucket
   - Set up authentication (service account key)
   - Update `application.properties` with your bucket name

3. Build the application
   ```
   cd backend
   mvn clean install
   ```

4. Run the application
   ```
   mvn spring:boot run
   ```

### API Endpoints

- `GET /files`: List all files or files in a specific folder
- `POST /files`: Upload a file or create a folder
- `GET /files/{id}`: Get file metadata
- `GET /files/{id}/download`: Download a file
- `PUT /files/{id}`: Rename or move a file
- `DELETE /files/{id}`: Delete a file or folder

## Development Assistance
This project was developed with assistance from:
- **Windsurf**: AI-powered development platform
- **Cursor**: AI-enhanced code editor
- **ChatGPT**: AI language model for code and documentation assistance
