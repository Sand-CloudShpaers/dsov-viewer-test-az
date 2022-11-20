
import groovy.json.JsonOutput


node (label: 'original_agent') {
  def scmVars = "empty"

  properties([
          disableConcurrentBuilds()
  ])

  try {
    def mvnHome = tool 'Maven 3.3.9'
    def nodeHome = tool 'NodeJS 16'
    def versie
    def softwareState = 'snapshot'
    env.PATH = "${env.PATH}:${nodeHome}/bin:${mvnHome}/bin"


    scmVars = checkout(scm)
    echo "scmVars: ${scmVars}"
    echo "scmVars.GIT_COMMIT: ${scmVars.GIT_COMMIT}"
    echo "scmVars.GIT_BRANCH: ${scmVars.GIT_BRANCH}"
    versie = sh (script: "mvn -f pom-k8s.xml org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.version -q -DforceStdout", returnStdout: true).toString().trim()

    stage('Fetch dependencies') {
      sh 'rm -rf dist/'
      sh 'ls -latr'
      sh '[ -d node_modules/puppeteer/ ] && rm -rf node_modules/puppeteer/ || echo no puppeteer present'      
      sh 'ls -latr'
      sh 'node --version'
      sh 'npm --version'
      sh 'HTTP_PROXY=http://ssl-proxy.cs.kadaster.nl:8080 HTTPS_PROXY=http://ssl-proxy.cs.kadaster.nl:8080'
      retry(2) {
        sh 'npm ci'
      }
    }

      stage('Node build') {
        echo '== building app for production (soo) =='
        sh 'ls -latr'
        sh '[ -d node_modules/puppeteer/ ] && rm -rf node_modules/puppeteer/ || echo no puppeteer present'      
        sh 'ls -latr'
        sh 'npm i puppeteer' 
        sh 'npm run build'
      }

      stage('Test') {
      try {
        stage('Unit tests') {
          echo '====== running tests ======='
          sh 'npm run test:ci'
        }
      } finally {
        junit 'reports/**/*.xml'
      }
    }

    stage('Linting stuff') {
      try {
        stage('Linting') {
          echo '====== running linting ======='
          sh 'npm run lint:ci'
        }
      } finally {
        recordIssues enabledForFailure: true, tool: tsLint(pattern: 'checkstyle-result.xml')
      }
    }

  } catch (any) {
    currentBuild.result = 'FAILURE'
    throw any //rethrow exception to prevent the build from proceeding
  } finally {
    deleteDir()
  }
}
