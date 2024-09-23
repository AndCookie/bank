pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'parenhark/backend'
    }

    stages {
        stage('Clone Backend Repo') {
            steps {
                git branch: 'back', credentialsId: 'e92707da-8291-494e-bfdd-b2a93870460a', url: 'https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21A204.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    sh 'docker-compose build backend'
                    sh 'docker tag backend_image:latest $BACKEND_IMAGE:$BUILD_NUMBER'  // 빌드된 이미지에 태그 추가
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'c23281eb-4db4-4090-973c-80cacc65904d', url: 'https://index.docker.io/v1/']) {
                        sh 'docker push $BACKEND_IMAGE:$BUILD_NUMBER'
                    }
                }
            }
        }

        stage('Deploy Backend on EC2') {
            steps {
                script {
                    sh '''
                    docker-compose down backend &&
                    docker-compose up -d backend
                    '''
                }
            }
        }
    }
}
