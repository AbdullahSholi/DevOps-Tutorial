pipeline {
    agent any

    environment {
        NODEJS_VERSION = 'nodejs-latest'  // Ensure this matches the configured tool in Jenkins
    }

    tools {
        nodejs "${NODEJS_VERSION}"  // Reference the Node.js tool configuration
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/AbdullahSholi/DevOps-Tutorial.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'  // Install project dependencies
            }
        }

        stage('Build') {
            steps {
                script {
                    // Check if 'build' script is defined in package.json before running it
                    def buildScriptExists = sh(script: 'npm run build --dry-run', returnStatus: true) == 0
                    if (buildScriptExists) {
                        echo 'Building the application...'
                        sh 'npm run build'
                    } else {
                        echo 'No build script defined in package.json'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    // Check if 'test' script is defined in package.json before running it
                    def testScriptExists = sh(script: 'npm run test --dry-run', returnStatus: true) == 0
                    if (testScriptExists) {
                        echo 'Running tests...'
                        sh 'npm test'
                    } else {
                        echo 'No test script defined in package.json'
                    }
                }
            }
        }

        stage('code analysis with sonarqube') {
          
		  environment {
             scannerHome = tool 'SonarQube-Scanner'
          }
          steps {
            withSonarQubeEnv('SonarCloud') {
               sh '''${scannerHome}/bin/sonar-scanner \
                   -Dsonar.projectKey=expressjs-app \
                   -Dsonar.projectName=express-repo \
                   -Dsonar.projectVersion=1.0 \
                   -Dsonar.sources=src/ \
                   -Dsonar.javascript.lcov.reportPaths=coverage/lcov-report/index.html \
                   -Dsonar.organization=DevOps-Sonar-s'''
            }
          }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                // Add actual deployment commands here if needed
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}


