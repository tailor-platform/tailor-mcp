#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { execSync } = require('child_process');
const axios = require('axios');
const tar = require('tar');
const { createWriteStream } = require('fs');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

// Setup paths
const binPath = path.join(__dirname, 'bin');
const tailorctlPath = path.join(binPath, 'tailorctl');
const tempDir = path.join(__dirname, '.tmp');

// Create bin directory if it doesn't exist
if (!fs.existsSync(binPath)) {
  fs.mkdirSync(binPath, { recursive: true });
}

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Map OS and architecture to GitHub release asset names
function getPlatformInfo() {
  const platform = os.platform();
  const arch = os.arch();
  
  // Map Node.js architecture names to tailorctl architecture names
  let tailorArch;
  switch (arch) {
    case 'x64':
      tailorArch = 'x86_64';
      break;
    case 'arm64':
      tailorArch = 'arm64';
      break;
    default:
      throw new Error(`Unsupported architecture: ${arch}`);
  }
  
  // Map Node.js platform names to tailorctl platform names
  let tailorPlatform;
  switch (platform) {
    case 'darwin':
      tailorPlatform = 'darwin';
      break;
    case 'linux':
      tailorPlatform = 'linux';
      break;
    case 'win32':
      tailorPlatform = 'windows';
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
  
  return { platform: tailorPlatform, arch: tailorArch };
}

async function getLatestReleaseInfo() {
  try {
    const response = await axios.get('https://api.github.com/repos/tailor-platform/tailorctl/releases/latest');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch latest release information:', error.message);
    throw error;
  }
}

async function downloadFile(url, outputPath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });
    
    const writer = createWriteStream(outputPath);
    await pipeline(response.data, writer);
    return outputPath;
  } catch (error) {
    console.error(`Error downloading file from ${url}:`, error.message);
    throw error;
  }
}

async function extractTarGz(filePath, outputPath) {
  return new Promise((resolve, reject) => {
    tar.x({
      file: filePath,
      cwd: outputPath
    }).then(() => {
      resolve();
    }).catch(err => {
      reject(err);
    });
  });
}

async function extractZip(filePath, outputPath) {
  // For Windows .zip files
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);
  
  if (os.platform() === 'win32') {
    // Use PowerShell on Windows
    await execPromise(`powershell -command "Expand-Archive -Path '${filePath}' -DestinationPath '${outputPath}' -Force"`);
  } else {
    // Use unzip on Unix-like systems if available
    await execPromise(`unzip -o "${filePath}" -d "${outputPath}"`);
  }
}

async function cleanupTempFiles() {
  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (err) {
      console.warn('Failed to clean up temporary files:', err);
    }
  }
}

async function install() {
  try {
    const { platform, arch } = getPlatformInfo();
    console.log(`Detected platform: ${platform}, architecture: ${arch}`);
    
    // Get latest release info
    const releaseInfo = await getLatestReleaseInfo();
    console.log(`Found latest tailorctl release: ${releaseInfo.tag_name}`);
    
    // Version without 'v' prefix
    const version = releaseInfo.tag_name;
    
    // Find the appropriate asset based on platform and architecture
    let fileExt;
    if (platform === 'windows') {
      fileExt = '.zip';
    } else {
      fileExt = '.tar.gz';
    }
    
    const assetPattern = `tailorctl_${platform}_${version}_${arch}${fileExt}`;
    const asset = releaseInfo.assets.find(asset => asset.name === assetPattern);
    
    if (!asset) {
      console.error(`Could not find asset matching: ${assetPattern}`);
      console.log('Available assets:');
      releaseInfo.assets.forEach(a => console.log(` - ${a.name}`));
      throw new Error(`Could not find appropriate tailorctl binary for ${platform} ${arch}`);
    }
    
    console.log(`Downloading ${asset.name} from ${asset.browser_download_url}`);
    
    // Download to temp directory
    const downloadPath = path.join(tempDir, asset.name);
    await downloadFile(asset.browser_download_url, downloadPath);
    
    console.log(`Downloaded to ${downloadPath}, extracting...`);
    
    // Extract based on file type
    if (fileExt === '.tar.gz') {
      await extractTarGz(downloadPath, tempDir);
    } else if (fileExt === '.zip') {
      await extractZip(downloadPath, tempDir);
    }
    
    // Find the extracted binary
    const binaryName = platform === 'windows' ? 'tailorctl.exe' : 'tailorctl';
    const extractedBinaryPath = path.join(tempDir, binaryName);
    
    // Copy to bin directory
    fs.copyFileSync(extractedBinaryPath, tailorctlPath);
    
    // Make it executable (not needed for Windows)
    if (platform !== 'windows') {
      fs.chmodSync(tailorctlPath, 0o755);
    }
    
    console.log('tailorctl has been installed successfully!');
    
    // Clean up
    await cleanupTempFiles();
    
    // Test the installation
    try {
      const version = execSync(`"${tailorctlPath}" version`, { encoding: 'utf8' });
      console.log(`Installed tailorctl version: ${version.trim()}`);
    } catch (err) {
      console.warn('Could not verify tailorctl version, but installation completed');
    }
  } catch (error) {
    console.error('Error during installation:', error);
    process.exit(1);
  }
}

// Run the installation
install();