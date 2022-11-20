#!/usr/bin/env groovy
pipeline {
  agent any

  options {
	disableConcurrentBuilds()
  }

  tools {
    maven 'Maven 3.3.9'
    nodejs 'NodeJS 16'
    jdk 'OpenJDK 11'
  }

  stages {
	stage ('Run Sonarqube') {
		steps {
			script {
				    try {
					def mvnHome = tool 'Maven 3.3.9'
					def nodeHome = tool 'NodeJS 16'
					def versie = "dummy"
					def softwareState = 'snapshot'
					env.PATH = "${env.PATH}:${nodeHome}/bin:${mvnHome}/bin"
					def now = new Date()

					sh "git config --global --add http.proxy http://ssl-proxy.cs.kadaster.nl:8080"
					sh "git config --global --add https.proxy http://ssl-proxy.cs.kadaster.nl:8080"

					scmVars = git credentialsId: 'dsov-jenkins-up', url: 'https://git.dev.cloud.kadaster.nl/dsov/dsov-viewer.git'

					sh "git config --global user.email \"dsov-jenkins@kadaster.nl\" "
					sh "git config --global user.name \"Dsov-jenkins\" "
					def commitUser=sh( script: "git show |grep -i Author | awk {'print \$2'}", returnStdout: true).toUpperCase().trim()
					echo 'commituser is: ' + commitUser

					stage('Get snapshotversion and raise') {
					versie = sh (script: "mvn -f pom-k8s.xml -q -Dexec.executable=echo -Dexec.args='\${project.version}' --non-recursive exec:exec", returnStdout: true).toString().trim()
					}

					stage('Fetch dependencies') {
					sh 'rm -rf dist/'
					sh 'node --version'
					sh 'npm --version'
					sh 'HTTP_PROXY=http://ssl-proxy.cs.kadaster.nl:8080 HTTPS_PROXY=http://ssl-proxy.cs.kadaster.nl:8080'
					retry(2) {
						sh 'npm ci'
					}
					}

					stage('Node build') {
					sh "echo == building app for snapshot environment =="
					sh "echo ${versie} \$(date +\"%Y-%m-%dT%TZ\") > src/config/build_version"
					sh 'cat src/config/build_version'
					sh 'npm run build'
					}

					stage('SonarQube analysis') {
					// requires SonarQube Scanner Latest
					def scannerHome = tool 'SonarQube Runner Latest'
					withSonarQubeEnv('SonarQube') {
						sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectVersion=${versie} -Dsonar.branch.name=master"
					}
					}




				} catch (any) {
					currentBuild.result = 'FAILURE'
					throw any //rethrow exception to prevent the build from proceeding
				} finally {

				}
			}
		}
	}
  }
}
