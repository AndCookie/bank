pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21A204.git', branch: 'develop-front'
            }
        }

        stage('List Files for Debugging') {
            steps {
                // 디렉토리 구조 확인을 위해 파일 리스트 출력
                sh 'ls -la'
                sh 'ls -la Frontend/'
                sh 'ls -la Frontend/front/'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // 정확한 경로로 Dockerfile 빌드
                    sh 'docker build -t my-react-app:latest -f Frontend/front/Dockerfile Frontend/front/'
                }
            }
        }

        stage('Deploy Docker Container') {
            steps {
                script {
                    sh 'docker stop my-react-app || true'
                    sh 'docker rm my-react-app || true'
                    sh 'docker run -d -p 8081:80 --name my-react-app my-react-app:latest'
                }
            }
        }
    }

    post {
        always {
            echo 'Build finished'
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
