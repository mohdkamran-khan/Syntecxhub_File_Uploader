# 📦 File Uploader API

A simple Express API for managing file uploads using Multer and MongoDB GridFS — supporting upload, retrieval, streaming, and deletion.

## 🧠 Features

- Upload files (any type)
- Store files in MongoDB GridFS
- Stream files back to client (e.g. display images)
- Retrieve file metadata
- Delete files
- Proper error handling
- Production-ready folder structure

## 🚀 Getting Started

Make sure you have:

```Node.js (v16+ recommended)```

```MongoDB (local/server/Atlas)```

```Git```

# 📋 Installation

### 1️⃣ Clone the repo

```bash
git clone https://github.com/mohdkamran-khan/Syntecxhub_File_Uploader.git
cd Syntecxhub_File_Uploader
```
### 2️⃣ Install dependencies

```bash 
npm install
```

### 3️⃣ Set environment variables

Create ```.env``` manually.

Example:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/file_upload_db
```

# 🛠 Running the Server
## 🧪 Development
```bash
npm run dev
```
## 🏁 Production
```bash
npm start
```
Server will run at:

```code
http://localhost:5000
```

# 📡 API Endpoints
## 📤 Upload File
```code
POST /api/files/upload
```

Form-data Params:

| Field |	Type | Description
|------------|----------|----------|
| file	| File | File to upload

```Success201``` Response
```JSON
{
  "success": true,
  "message": "File uploaded successfully",
  "fileId": "63…",
  "filename": "example.png"
}
```
## 📄 Get File Metadata
 ```code
 GET /api/files/file/:id
```

Returns metadata like filename, upload date, size, contentType.

## 👁️‍🗨️ Stream / View File
```code
GET /api/files/file/stream/:id
```

Used to render images, PDFs, or download files.

## 🗑️ Delete File
```code
DELETE /api/files/file/:id
```

Removes file from GridFS.

## 🧪 Testing

Use ```Postman Desktop``` or any REST client.

### Example upload:
```code
POST http://localhost:5000/api/files/upload
```
Form-data → Key: ```file``` → Select file

## 🧩 Folder Structure
```pgsql
├── routes/
│   └── file.routes.js
├── .env.example
├── .gitignore
├── server.js
├── package.json
└── README.md
```
## 🧠 Why GridFS?

- GridFS is ideal when:

- Files are larger than 16MB

- You want to store file data inside the database

- You need efficient file streaming

## 🔒 Security Notes

This API currently does not include:

✔️ Authentication

✔️ Authorization

✔️ Rate limiting

✔️ File type whitelist

✔️ Virus scanning

## 📧 Contributing

Contributions are welcome. If you want to contribute:

1. Fork the repo
2. Create a feature branch `git checkout -b feature/your-feature`
3. Commit your changes `git commit -m "feat: add ..."`
4. Push and open a pull request

## 📄 License

```
This project is open-source and available under the [MIT License]
```

## 👨🏻‍💻 Author

Mohd Kamran Khan | You can reach me at: [mohdkamrankhan.dev@gmail.com]

🌐 **Portfolio:** [mohdkamran-khan.github.io/KAMRAN-portfolio](https://mohdkamran-khan.github.io/KAMRAN-portfolio/)
