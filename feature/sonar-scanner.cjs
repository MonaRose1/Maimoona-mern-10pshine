const sonarqubeScanner = require('sonarqube-scanner');

// Get SonarQube server URL and token from environment variables or use defaults
const serverUrl = process.env.SONAR_URL || 'http://localhost:9000';
const token = process.env.SONAR_TOKEN || '';

console.log('Running SonarQube analysis...');
console.log('Server URL:', serverUrl);
console.log('Token provided:', token ? 'Yes' : 'No');

// Function to check if SonarQube server is accessible
async function checkServerAccessibility(url) {
  const https = require('https');
  const http = require('http');
  const { URL } = require('url');
  
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 300);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Main execution
(async () => {
  // Check if server is accessible
  const isServerAccessible = await checkServerAccessibility(serverUrl);
  
  if (!isServerAccessible) {
    console.warn('Warning: SonarQube server is not accessible at', serverUrl);
    console.warn('Please ensure SonarQube is running or provide a valid server URL.');
    console.warn('Skipping SonarQube analysis.');
    process.exit(0);
  }
  
  sonarqubeScanner({
    serverUrl: serverUrl,
    token: token,
    options: {
      'sonar.projectKey': 'note-taking-app',
      'sonar.projectName': 'Note Taking App',
      'sonar.projectDescription': 'A full-stack note-taking application with regular and secret notes',
      'sonar.projectVersion': '1.0.0',
      'sonar.sources': 'backend/server,frontend/notes-app/src',
      'sonar.tests': 'backend/server/test,frontend/notes-app/test',
      'sonar.inclusions': '**/*.js,**/*.jsx,**/*.ts,**/*.tsx',
      'sonar.exclusions': '**/node_modules/**,**/*.test.js,**/*.test.jsx,**/coverage/**,**/dist/**,**/build/**,**/vite.config.js,**/tailwind.config.ts,**/postcss.config.js,**/jest.config.js,**/.mocharc.json,**/babel.config.cjs,**/components/ui/**',
      'sonar.test.inclusions': '**/*.test.js,**/*.test.jsx',
      'sonar.javascript.lcov.reportPaths': 'frontend/notes-app/coverage/lcov.info',
      'sonar.typescript.tsconfigPath': 'frontend/notes-app/tsconfig.json',
      'sonar.coverage.exclusions': '**/*.test.js,**/*.test.jsx,**/test/**,**/tests/**,**/mocks/**,**/setupTests.js,**/jest.config.js,**/.mocharc.json,**/babel.config.cjs',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.log.level': 'INFO',
      'sonar.branch.name': 'main',
      'sonar.eslint.reportPaths': 'eslint-report.json'
    }
  }, (result) => {
    if (result === 0) {
      console.log('SonarQube analysis completed successfully');
    } else {
      console.log('SonarQube analysis failed with exit code:', result);
    }
    process.exit(result);
  });
})();