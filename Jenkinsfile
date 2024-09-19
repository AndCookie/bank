pipeline {
    agent any

    environment {
        ENV_FILE_PATH = '/home/ubuntu/.env'
        DOCKER_BUILDKIT = '1'  // BuildKit 활성화
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Junyoung-Park-jyp/SH5', branch: 'backend'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // BuildKit 활성화 및 이미지 빌드
                    sh """
                    export DOCKER_BUILDKIT=${env.DOCKER_BUILDKIT}
                    docker build -t my-django-app:${env.BUILD_ID} .
                    """
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh "docker run --env-file ${env.ENV_FILE_PATH} -w /app/SOLoTrip my-django-app:${env.BUILD_ID} python manage.py test"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // 기존 컨테이너 정지 및 삭제 후 배포
                    sh """
                    docker stop my-django-app || true
                    docker rm my-django-app || true
                    docker run -d -p 8000:8000 --name my-django-app --env-file ${env.ENV_FILE_PATH} my-django-app:${env.BUILD_ID}
                    """
                }
            }
        }

        stage('Clean Up') {
            steps {
                script {
                    // 사용하지 않는 이미지 및 볼륨 정리
                    sh "docker system prune -a -f --volumes"
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
