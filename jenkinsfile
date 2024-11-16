pipeline {
    agent any

    environment {
        NODEJS_VERSION = 'nodejs-latest'
    }

    tools {
        nodejs "${NODEJS_VERSION}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/AbdullahSholi/DevOps-Tutorial.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm run build || echo "No build script defined"'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }

        stage('code analysis with sonarqube') {
          
		  environment {
             scannerHome = tool 'SonarQube Scanner'
          }
          steps {
            withSonarQubeEnv('SonarCloud') {
               sh '''${scannerHome}/bin/SonarQube Scanner \
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


