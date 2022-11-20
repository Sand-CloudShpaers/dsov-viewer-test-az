#!/usr/bin/env groovy
pipeline {
    agent any
  
    parameters {
      string(name: 'hotfixVersieBrancheNaam', defaultValue: '0.0.1', description: 'hotfix branche name' )
    } 


    tools {
        maven 'Maven 3.3.9'
        nodejs 'NodeJS 16'
        jdk 'OpenJDK 11'
    }
    stages {
        stage ('Build hotfix') {
            steps {
                script {
                    try {
                    String hotfixVersieBrancheNaam = hotfixVersieBrancheNaam.replaceAll("\\s","")
                    sh "git checkout ${hotfixVersieBrancheNaam}"
                    sh 'git status'
                    echo 'Start van het maken van een hotfix.'
                    int mergerc = 99

                    String currentVersion = sh(
                        returnStdout: true, script: 'mvn -f pom-k8s.xml help:evaluate -Dexpression=project.version -q -DforceStdout'
                        ).trim()
                    String newHotfixVersion = currentVersion.tokenize('-')[0]
                    Integer majorNr = newHotfixVersion.tokenize('.')[0] as int
                    Integer minorNr = newHotfixVersion.tokenize('.')[1] as int
                    Integer patchNr = newHotfixVersion.tokenize('.')[2] as int
                    patchNr = patchNr + 1
                    newHotfixVersion = "${majorNr}.${minorNr}.${patchNr}"
                    String deployableHotfixVersion = newHotfixVersion

                    sh "mvn -f pom-k8s.xml versions:set -DnewVersion=${newHotfixVersion}"
                   // sh 'rm -rf pom-k8s.xml.versionsBackup'
                    sh "echo ${newHotfixVersion} \$(date +\"%Y-%m-%dT%TZ\") > src/config/build_version"                      
                    sh "git commit -a -m 'Bumped version number to ${newHotfixVersion}'"

                    echo 'Fetch dependencies'
                    sh 'mvn -f pom-k8s.xml clean -X'
                    sh 'rm -rf dist/'
                    sh 'node --version'
                    sh 'npm --version'
                    sh 'export HTTP_PROXY=http://ssl-proxy.cs.kadaster.nl:8080'
                    sh 'export HTTPS_PROXY=http://ssl-proxy.cs.kadaster.nl:8080'

                    echo 'Node Build'
                    sh '[ -d node_modules/puppeteer/ ] && rm -rf node_modules/puppeteer/ || echo no puppeteer'
                    sh 'ls -latr'
                    sh 'npm i puppeteer'
                    sh 'npm run build'

                    //sh "echo ${newReleaseVersion} \$(date +\"%Y-%m-%dT%TZ\") > dist/dso-viewer/config/build_version"
                    sh 'cat dist/dso-viewer/config/build_version'

                    echo 'Build'
                     /* groovylint-disable-next-line LineLength */


                    withCredentials([usernamePassword(credentialsId: 'dsov-jenkins-up', passwordVariable: 'dsov_pass', usernameVariable: 'dsov_user')]) {
                        sh  "mvn -f pom-k8s.xml -B -Dhttps.proxyHost=ssl-proxy.cs.kadaster.nl -Dhttps.proxyPort=8080 -Dusername=${dsov_user} -Dpassword=${dsov_pass} -DnoDeploy=false -Dmaven.javadoc.skip=true -DautoVersionSubmodules=true -Dmaven.test.skip=true deploy"
                    }


                    int rc = sh(
                        script: 'git status --short --untracked-files | grep -i package-lock.json',
                        returnStatus: true)
                    if ( rc == 0) {
                        sh 'git checkout -- "package-lock.json"'
                        sh "git push"
                    }
                      /*
                      echo 'Merge Release in master en maak tag'
                      sh 'git checkout master'
                      sh 'git pull'

                      mergerc = sh(
                          script: "git merge --no-ff release-${newHotfixVersion}",
                          returnStatus: true
                      )
                      if (mergerc != 0) {
                          sh 'git checkout --theirs pom-k8s.xml'
                          sh 'git add pom-k8s.xml'
                      }

                      sh "git tag -a -m 'Nieuwe release versie' v${newHotfixVersion}"
                      sh "git push origin v${newHotfixVersion}"

                      echo 'Ophogen'
                      sh "mvn -f pom-k8s.xml versions:set -DnewVersion=${majorNr}.${minorNr}.${patchNr}-SNAPSHOT"
                      sh "git commit -a -m 'mergen van release terug in master en zetten van nieuwe versie'"
                      sh 'git push'
                      */

                      stage('Build image and deploy') {
                      BUILD_USER_ID           = "Scheduled job"
                      BUILD_USER              = "Jenkins"
                      BUILD_USER_EMAIL        = "none@no-domain.fqdn"
                      BUILD_USER_FIRST_NAME   = "Sherlock"
                      BUILD_USER_LAST_NAME    = "Holmes"

                      build job: 'dsov-k8s-imagebuild-generic', parameters: [
                          [$class: 'StringParameterValue', name: 'modus', value: 'Release'], 
                          [$class: 'StringParameterValue', name: 'application', value: 'dsov/viewer'], 
                          [$class: 'StringParameterValue', name: 'artifactVersie', value: deployableHotfixVersion ], 
                          [$class: 'StringParameterValue', name: 'imageVersie', value: deployableHotfixVersion ]
                          ]
                      build job: 'dsov-k8s-jedi2-apps-deploy/master', parameters: [
                          [$class: 'StringParameterValue', name: 'targetEnv', value: 'test'], 
                          [$class: 'StringParameterValue', name: 'imageVersie', value: deployableHotfixVersion], 
                          [$class: 'StringParameterValue', name: 'appl', value: 'release-viewer']
                          ]
                      }
                  }
                catch(any) {
                    currentBuild.result = 'FAILURE'
                    throw any //rethrow exception to prevent the build from proceeding
                } finally{
                    deleteDir()
                }

                }
            }
        }
    }
}
