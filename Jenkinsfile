pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21A204.git', branch: 'develop-front-test', credentialsId: 'e92707da-8291-494e-bfdd-b2a93870460a'
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
                    // 기존 컨테이너 정지 및 삭제
                    sh 'docker stop my-react-app || true'
                    sh 'docker rm my-react-app || true'
                    // React 애플리케이션 컨테이너 실행 (내부 포트 3000 가정)
                    sh 'docker run -d -p 8081:3000 --name my-react-app my-react-app:latest'
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
