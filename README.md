# Supabase Downloader

A Node.js utility to download all files from your Supabase storage buckets.

## Description

Supabase Downloader is a simple tool that connects to your Supabase project and downloads all files from all storage buckets. It preserves the original folder structure and organizes downloads by bucket name.

## Features

- Downloads all files from all buckets in your Supabase project
- Preserves folder structure
- Handles errors gracefully
- Provides detailed logging

## Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn
- A Supabase project with storage buckets

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/supabase-downloader.git
   cd supabase-downloader
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root with your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   ```

## Usage

Run the script with:

```
node download.js
```

The script will:
1. Connect to your Supabase project
2. List all available storage buckets
3. Download all files from each bucket
4. Save files to a `./downloads` directory, organized by bucket name

## File Structure

Downloaded files will be saved in the following structure:

```
downloads/
  ├── bucket1/
  │   ├── file1.jpg
  │   ├── folder/
  │   │   └── file2.pdf
  │   └── ...
  ├── bucket2/
  │   └── ...
  └── ...
```

## Environment Variables

Create a `.env` file with the following variables:

- `SUPABASE_URL`: Your Supabase project URL (e.g., https://your-project-id.supabase.co)
- `SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key (for admin access)

You can find these values in your Supabase dashboard under Project Settings > API.

## Customization

You can modify the download location by changing the `downloadPath` variable in `download.js`.

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify your Supabase URL and keys in the `.env` file.
2. **Permission Errors**: Ensure your service role key has the necessary permissions to access storage.
3. **File System Errors**: Check that the script has write permissions to create the downloads directory.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
