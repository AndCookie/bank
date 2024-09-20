pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Junyoung-Park-jyp/SH5', branch: 'develop-front'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Dockerfile이 Frontend/front 폴더에 있는 경우 경로 수정
                    sh 'docker build -t my-react-app:latest -f Frontend/front/Dockerfile Frontend/front/'
                }
            }
        }

        stage('Deploy Docker Container') {
            steps {
                script {
                    // 컨테이너 이름 및 실행 포트 수정
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
