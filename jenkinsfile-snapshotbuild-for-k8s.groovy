node (label: 'original_agent') {
  properties([
          disableConcurrentBuilds()
  ])  

  def scmVars = 'empty'

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
    // De jenkins github project lijkt de ZZ-JENKINS-DSOV user niet te ignoren. Hierdoor moeten wij zelf gaan controleren
    // of de commit user geignored moet worden. Het liefst willen we `scmVars` gebruiken, maar we zien hier dat elke trigger
    // terug komt met `ZZ_JENKINS-DSOV` user. Dus moeten we handmatig de user uit git show halen.

    def commitUser=sh( script: "git show |grep -i Author | awk {'print \$2'}", returnStdout: true).toUpperCase().trim()
    echo 'commituser is: ' + commitUser
    if ( commitUser == "dsov-jenkins" ) {
      echo "Aangezien ik de buildserver user ben, wordt deze build netjes gestopt"
      currentBuild.result = 'SUCCESS'
      sh "exit 0"
    } else {

      sh 'git checkout development'

      stage('Get snapshotversion and raise') {
        versie = sh (script: "mvn -f pom-k8s.xml -q -Dexec.executable=echo -Dexec.args='\${project.version}' --non-recursive exec:exec", returnStdout: true).toString().trim()
        sh "echo ${versie} gevonden"
      }

      stage('Fetch dependencies') {
        sh 'rm -rf dist/'
        sh 'node --version'
        sh 'npm --version'
        //sh 'google-chrome --version'
        sh 'HTTP_PROXY=http://ssl-proxy.cs.kadaster.nl:8080 HTTPS_PROXY=http://ssl-proxy.cs.kadaster.nl:8080'
        sh 'npm cache clean --force'
        retry(2) {
          sh 'npm ci'
        }
      }

      stage('Node build') {
        sh "echo == building app for snapshot envoirment =="
        sh "echo ${versie} \$(date +\"%Y-%m-%dT%TZ\") > src/config/build_version"
        sh 'cat src/config/build_version'
        sh 'ls -latr'
        sh '[ -d node_modules/puppeteer/ ] && rm -rf node_modules/puppeteer/ || echo no puppeteer present'      
        sh 'ls -latr'
        sh 'npm i puppeteer'        
        sh 'npm run build'
      }

      stage('Maven deploy') {
        withCredentials([usernamePassword(credentialsId: 'jenkins-up', passwordVariable: 'password', usernameVariable: 'username')]) {
          sh 'mvn -f pom-k8s.xml clean deploy  -Dusername=${username} -Dpassword=${password} -DuniqueVersion=false'
          sh 'cat src/config/build_version'
        }
      }

      stage('Build image and deploy') {
        build job: 'dsov-k8s-imagebuild-generic', parameters: [[$class: 'StringParameterValue', name: 'modus', value: 'Snapshot'], [$class: 'StringParameterValue', name: 'application', value: 'dsov/viewer'], [$class: 'StringParameterValue', name: 'artifactVersie', value: versie ], [$class: 'StringParameterValue', name: 'imageVersie', value: versie ]]
        build job: 'dsov-k8s-jedi2-apps-deploy/master', parameters: [[$class: 'StringParameterValue', name: 'targetEnv', value: 'test'], [$class: 'StringParameterValue', name: 'imageVersie', value: versie], [$class: 'StringParameterValue', name: 'appl', value: 'snapshot-viewer']]
      }

      stage('Test latest snapshot deployment'){
        //build job: 'rbfm-test'
      }
    }

  } catch (any) {
    currentBuild.result = 'FAILURE'
    throw any //rethrow exception to prevent the build from proceeding
  } finally {
    deleteDir()
  }
}
