const fs = require('fs');
const path = require('path');

// Function to recursively find all backup files
function findBackupFiles(dir) {
    let results = [];
    
    try {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                results = results.concat(findBackupFiles(fullPath));
            } else if (file.endsWith('.backup')) {
                results.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error accessing directory ${dir}:`, error.message);
    }
    
    return results;
}

const rootDir = process.cwd();
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Backup Cleanup Script

Usage: node cleanup-backups.js [options]

Options:
  --list        List all backup files without deleting them
  --delete      Delete all backup files
  --help, -h    Show this help message

This script helps manage the backup files created during the bulk replacement process.
`);
    process.exit(0);
}

console.log('Backup File Cleanup Script');
console.log('=========================');

const backupFiles = findBackupFiles(rootDir);

console.log(`\nFound ${backupFiles.length} backup files:`);

if (args.includes('--list') || (!args.includes('--delete'))) {
    backupFiles.forEach(file => console.log(`  ${file}`));
    
    if (!args.includes('--delete')) {
        console.log('\nUse --delete to remove these files, or --help for more options.');
    }
}

if (args.includes('--delete')) {
    let deletedCount = 0;
    let errorCount = 0;
    
    console.log('\nDeleting backup files...\n');
    
    for (const file of backupFiles) {
        try {
            fs.unlinkSync(file);
            console.log(`Deleted: ${file}`);
            deletedCount++;
        } catch (error) {
            console.error(`Failed to delete ${file}: ${error.message}`);
            errorCount++;
        }
    }
    
    console.log('\n=========================');
    console.log(`Successfully deleted: ${deletedCount} files`);
    if (errorCount > 0) {
        console.log(`Failed to delete: ${errorCount} files`);
    }
    console.log('Cleanup complete!');
}