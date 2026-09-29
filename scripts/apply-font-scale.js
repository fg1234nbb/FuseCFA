const fs = require('fs');

const files = [
  'src/screens/HubScreen.js',
  'src/screens/ReadyScreen.js',
  'src/screens/DrillScreen.js',
  'src/screens/ResultsScreen.js',
  'src/components/NodeOrbit.js',
  'src/components/FuseRing.js',
  'src/components/LegalModal.js',
  'src/components/ConfirmModal.js',
];

let totalReplacements = 0;

files.forEach((file) => {
  let src = fs.readFileSync(file, 'utf8');
  let fileCount = 0;

  // Wrap bare numeric fontSize values: fontSize: 14  ->  fontSize: rem(14)
  // Skips ones already wrapped (won't double-wrap on re-run).
  src = src.replace(/fontSize:\s*(\d+(?:\.\d+)?)(?!\s*\))/g, (match, num) => {
    fileCount++;
    return `fontSize: rem(${num})`;
  });

  if (fileCount > 0) {
    // Make sure `rem` is imported from the theme module.
    const importRegex = /import \{([^}]*)\} from ['"](\.\.\/theme|\.\/theme)['"];/;
    const m = src.match(importRegex);
    if (m) {
      const names = m[1].split(',').map((s) => s.trim()).filter(Boolean);
      if (!names.includes('rem')) {
        names.push('rem');
        const newImport = `import { ${names.join(', ')} } from '${m[2]}';`;
        src = src.replace(importRegex, newImport);
      }
    } else {
      console.log(`  !! ${file}: no existing theme import found, add 'rem' manually`);
    }
  }

  fs.writeFileSync(file, src);
  console.log(`${file}: ${fileCount} fontSize occurrences wrapped`);
  totalReplacements += fileCount;
});

console.log(`\nTotal: ${totalReplacements} fontSize values now routed through rem()`);
