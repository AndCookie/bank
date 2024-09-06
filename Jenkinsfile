pipeline {
    agent any

    environment {
        ENV_FILE_PATH = '/home/ubuntu/.env'
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
                    sh "docker build -t my-django-app:${env.BUILD_ID} ."
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
                    sh "docker stop my-django-app || true"
                    sh "docker rm my-django-app || true"
                    sh "docker run -d -p 8000:8000 --name my-django-app --env-file ${env.ENV_FILE_PATH} my-django-app:${env.BUILD_ID}"
                }
            }
        }

        stage('Clean Up') {
            steps {
                script {
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
