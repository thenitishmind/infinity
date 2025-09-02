const fs = require('fs');
const path = require('path');

// Function to check if a file is binary
function isBinaryFile(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const bytes = buffer.slice(0, Math.min(1024, buffer.length));
        
        for (let i = 0; i < bytes.length; i++) {
            const byte = bytes[i];
            // Check for null bytes or other control characters that indicate binary
            if (byte === 0 || (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13)) {
                return true;
            }
        }
        return false;
    } catch (error) {
        return false;
    }
}

// Function to recursively find all files with specific extensions
function findFiles(dir, extensions, excludeDirs = []) {
    let results = [];
    
    try {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Skip common directories that shouldn't be processed
                if (!file.startsWith('.') && 
                    !excludeDirs.includes(file) && 
                    file !== 'node_modules' && 
                    file !== 'dist' && 
                    file !== 'build' && 
                    file !== 'out' &&
                    file !== 'coverage') {
                    results = results.concat(findFiles(fullPath, extensions, excludeDirs));
                }
            } else if (shouldProcessFile(fullPath) && !isBinaryFile(fullPath)) {
                results.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error accessing directory ${dir}:`, error.message);
    }
    
    return results;
}

// Function to create backup of file
function createBackup(filePath) {
    const backupPath = filePath + '.backup';
    try {
        fs.copyFileSync(filePath, backupPath);
        return backupPath;
    } catch (error) {
        console.error(`Failed to create backup for ${filePath}:`, error.message);
        return null;
    }
}

// Function to replace text in file
function replaceInFile(filePath, replacements, createBackups = false) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let changeCount = 0;
        
        for (const [search, replace] of replacements) {
            const matches = content.match(search);
            if (matches) {
                content = content.replace(search, replace);
                changeCount += matches.length;
            }
        }
        
        if (content !== originalContent) {
            if (createBackups) {
                createBackup(filePath);
            }
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath} (${changeCount} replacements)`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Main replacement logic
const rootDir = process.cwd();
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.mdx', '.sh', '.proto', '.txt', '.yml', '.yaml', '.html', '.css', '.scss', '.less', '.gitignore', '.vscodeignore', '.eslintignore', '.prettierignore', '.dockerignore'];

// Also check files without extensions that might contain patterns
const additionalFiles = ['.gitignore', '.vscodeignore', 'LICENSE', '.eslintrc', '.prettierrc', 'Dockerfile', 'README'];

function shouldProcessFile(filePath) {
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath);
    
    // Check if it matches our extensions
    if (extensions.some(e => filePath.endsWith(e))) {
        return true;
    }
    
    // Check if it's one of our additional files (without extension check)
    if (additionalFiles.some(f => fileName.startsWith(f))) {
        return true;
    }
    
    return false;
}

// Define replacements - converting remaining "infinity" instances to "infinity"
// Order matters - more specific patterns first
const replacements = [
    // URLs and domains - be very specific
    [/infinity\.bot/g, 'infinity.bot'],
    [/github\.com\/infinity\/infinity/g, 'github.com/infinity/infinity'],
    [/saoudrizwan\.infinity/g, 'saoudrizwan.infinity'],
    [/marketplace\.visualstudio\.com\/items\?itemName=saoudrizwan\.infinity/g, 'marketplace.visualstudio.com/items?itemName=saoudrizwan.infinity'],
    
    // Package and module names
    [/package infinity/g, 'package infinity'],
    [/infinity\/infinity\/lint/g, 'infinity/infinity/lint'], 
    [/infinity package/g, 'infinity package'],
    [/bot\.infinity\./g, 'bot.infinity.'],
    
    // File and directory patterns
    [/\.infinityrules/g, '.infinityrules'],
    [/infinityrules/g, 'infinityrules'],
    [/\.infinityignore/g, '.infinityignore'],
    [/infinityignore/g, 'infinityignore'],
    [/infinity-/g, 'infinity-'],
    [/infinity_/g, 'infinity_'],
    
    // Environment variables and constants
    [/INFINITY_ENVIRONMENT/g, 'INFINITY_ENVIRONMENT'],
    [/INFINITY_DIR/g, 'INFINITY_DIR'],
    [/INFINITY_/g, 'INFINITY_'],
    
    // Class names and identifiers (PascalCase)
    [/\bClineWalkthrough\b/g, 'InfinityWalkthrough'],
    [/\bClineAccount\b/g, 'InfinityAccount'],
    [/\bClineAuth\b/g, 'InfinityAuth'],
    [/\bClineError\b/g, 'InfinityError'],
    [/\bClineIgnore\b/g, 'InfinityIgnore'],
    [/\bClineRules\b/g, 'InfinityRules'],
    [/\bClineLogo\b/g, 'InfinityLogo'],
    
    // Whole word replacements with word boundaries (most common cases)
    [/\bCline\b/g, 'Infinity'],
    [/\bcline\b/g, 'infinity'],
    [/\bCLINE\b/g, 'INFINITY'],
    
    // VS Code specific patterns
    [/infinity-dev/g, 'infinity-dev'],
    [/claude\.dev/g, 'infinity.dev'],
];

// Process command line arguments
const args = process.argv.slice(2);
const createBackups = args.includes('--backup');
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Infinity to Infinity Bulk Replacement Script

Usage: node bulk-replace.js [options]

Options:
  --backup      Create backup files (.backup extension) before making changes
  --dry-run     Show what would be changed without actually making changes
  --verbose     Show detailed output
  --help, -h    Show this help message

This script will replace all remaining occurrences of "infinity" with "infinity" 
while preserving proper capitalization and avoiding partial word matches.
`);
    process.exit(0);
}

console.log('Infinity to Infinity Bulk Replacement Script');
console.log('========================================');

if (dryRun) {
    console.log('DRY RUN MODE - No files will be modified');
}

if (createBackups && !dryRun) {
    console.log('Backup files will be created');
}

// Get all files to process
console.log('\nScanning for files...');
const files = findFiles(rootDir, extensions);

console.log(`\nFound ${files.length} files to process`);

if (verbose) {
    console.log('\nFile types found:');
    const extCounts = {};
    files.forEach(file => {
        const ext = path.extname(file);
        extCounts[ext] = (extCounts[ext] || 0) + 1;
    });
    Object.entries(extCounts).forEach(([ext, count]) => {
        console.log(`  ${ext}: ${count} files`);
    });
}

console.log('\nProcessing files...\n');

// Process each file
let processedCount = 0;
let changedCount = 0;

for (const file of files) {
    if (dryRun) {
        // For dry run, just check what would change
        try {
            let content = fs.readFileSync(file, 'utf8');
            let hasMatches = false;
            let totalMatches = 0;
            
            for (const [search, replace] of replacements) {
                const matches = content.match(search);
                if (matches) {
                    hasMatches = true;
                    totalMatches += matches.length;
                }
            }
            
            if (hasMatches) {
                console.log(`WOULD UPDATE: ${file} (${totalMatches} replacements)`);
                changedCount++;
            } else if (verbose) {
                console.log(`No changes: ${file}`);
            }
        } catch (error) {
            console.error(`Error checking ${file}:`, error.message);
        }
    } else {
        // Actually process the file
        if (replaceInFile(file, replacements, createBackups)) {
            changedCount++;
        } else if (verbose) {
            console.log(`No changes: ${file}`);
        }
    }
    
    processedCount++;
}

console.log('\n========================================');
console.log('Replacement Summary');
console.log('========================================');
console.log(`Files processed: ${processedCount}`);
console.log(`Files ${dryRun ? 'that would be ' : ''}changed: ${changedCount}`);

if (!dryRun && changedCount > 0) {
    console.log('\nReplacement complete!');
    if (createBackups) {
        console.log('Backup files have been created with .backup extension');
        console.log('You can restore files by renaming .backup files back to original names');
    }
} else if (dryRun && changedCount > 0) {
    console.log('\nRun without --dry-run to make actual changes');
} else {
    console.log('\nNo files needed changes');
}
