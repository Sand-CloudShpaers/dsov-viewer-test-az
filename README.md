#### Table of content

- [Dso Viewer](#dso-viewer)
  - [Quick start](#quick-start)
  - [Main tasks](#main-tasks)
    - [Development server](#development-server)
    - [Code scaffolding](#code-scaffolding)
    - [Additional tools](#additional-tools)
    - [Updating API Specs](#updating-api-specs)
  - [CI](#ci)
    - [Additional tools](#additional-tools-1)
  - [What's in the box](#whats-in-the-box)
    - [Tools](#tools)
    - [Libraries](#libraries)
    - [Coding guides](#coding-guides)
    - [See Also](#see-also)

# Dso Viewer

[![Quality Gate Status](https://dev-svc.cs.kadaster.nl/sonar/api/project_badges/measure?project=nl.kadaster.dsov%3Adso-viewer&metric=alert_status)](https://dev-svc.cs.kadaster.nl/sonar/dashboard?id=nl.kadaster.dsov%3Adso-viewer)

The DSO viewer, as the name implies, is a viewer for the DSO program. The DSO program is a program lead
by Rijkswaterstaat with the Kadaster as one of the development partners. There are quarterly sessions which
aim on aligning requirements and user stories with the API teams. You will find that a closer communication with
the API teams, mainly quartered in the Kadaster building, is of the utmost importance in order to achieve any progress.

What you will find in the viewer is those laws and restrictions that any random civilian will need to take into account
when executing their desired activity on their own lot. For example when building a shed or garage, it's important to know
the local water level, the restrictions in height and sizes, and if there are ay specific rules on your specific lot like
you're living in a monumental house with a protected view.

# Version History

This is maintained in de deployment configuration of de dsov environment

## Quick start

1. Clone the latest source from the repository using the command line:

   ```sh
   git clone ssh://git@git-ssh.dev.cloud.kadaster.nl:443/dsov/dsov-viewer.git
   cd dso-viewer
   ```

2. Install the packages:

   ```sh
   npm install
   ```

   > If you're on the Kadaster network; which you probably will be, you'll notice the proxy is so insanely slow (if you managed to set it up in the first place) that you'd rather not use npm install on the network. Advised is to disconnect anyconnect while installing npm dependencies. Warnings about `fsevents@` may occur and van be ignored.

3. Copy the file `src/config/config.conf.example` to `src/config/config.conf` and check with a colleague whether all settings are correct.

4. After having installed all the necessary packages, Now you are ready to start the application:

   ```sh
   npm start
   ```

## Main tasks

Task automation is based on [NPM scripts](https://docs.npmjs.com/misc/scripts).

| Tasks               | Description                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm start`         | Run development server on `http://localhost:4200/`                                                                                                      |
| `npm run start-es5` | `ng serve` doesn't support serving older ES5 for older browsers out-of-the-box so we added a script to open <http://localhost:4200> in an older browser |
| `npm run build`     | Build app for production in `dist/` folder                                                                                                              |
| `npm test`          | Run unit tests via [ng test](https://angular.io/cli/test) in watch mode                                                                                 |
| `npm run test:ci`   | Run unit tests once for continuous integration                                                                                                          |
| `npm run test:wsl`  | Run unit tests on WSL in windows chrome headless                                                                                                        |
| `npm run lint`      | Lint Typescript code                                                                                                                                    |
| `npm run prettier`  | Format typescript with Prettier                                                                                                                         |
|                     |

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.

### Code scaffolding

Run `yarn ng generate component <name>` to generate a new component. You can also use
`yarn ng generate directive|pipe|service|class|module`.

If you have installed [angular-cli](https://github.com/angular/angular-cli) globally with `npm install -g @angular/cli`,
you can also use the command `ng generate` directly.

### Additional tools

Tasks are mostly based on the `angular-cli` tool. Use `ng help` to get more help or go check out the
[Angular-CLI README](https://github.com/angular/angular-cli).

### Updating API Specs

API Specs can be updated using the scripts:
- `generate-openapi-model-presenteren` for Ozon Presenteren API
- `generate-openapi-model-verbeelden` for Ozon Verbeelden API
- `generate-openapi-model-ihr` for IHR plannen API

For a major version update of the API:
1. Make sure the input of the npm script points to the right version of the API specs model
2. Change output folder of npm script
3. Change the path in `tsconfig.json` to the new output folder
4. Remove old folder with API specs

Steps for updating API Specs:
1. Remove all files from the output folder (as the script will not clean the folder)
2. Run npm script
  - For Verbeelden: change all snake_case (e.g. line_color) variables to kebab-case ('line-color') in model output until bug is fixed: https://github.com/OpenAPITools/openapi-generator/issues/4065
3. Check if models are valid by running `npm run lint`
4. Change version number in `specification-version.ts`

## CI

[Jenkins](https://dev-svc.cs.kadaster.nl/jenkins-dsov/) is used for CI. The flow is part of the source as a jenkinsfile.

Release build:

- Start de [job](https://dev-svc.cs.kadaster.nl/jenkins-dsov/job/dsov-k8s-ci-release/) en wacht totdat de release build deployd is op de test omgeving.

### Additional tools

Tasks are mostly based on the `angular-cli` tool. Use `ng help` to get more help or go check out the
[Angular-CLI README](https://angular.io/cli).

## What's in the box

The app template is based on [HTML5](http://whatwg.org/html), [TypeScript](http://www.typescriptlang.org) and
[Sass](http://sass-lang.com).

### Tools

Development, build and quality processes are based on [angular-cli](https://angular.io/cli) and
[NPM scripts](https://docs.npmjs.com/misc/scripts), which includes:

- Unit tests using [jasmine](https://jasmine.github.io/)
- Static code analysis: [TSLint](https://github.com/palantir/tslint), [Codelyzer](https://github.com/mgechev/codelyzer),
  and [Sonar](https://dev-svc.cs.kadaster.nl/sonar/dashboard?id=nl.kadaster.dsov%3Adso-viewer)
- Typescript code formatting with [Prettier](https://prettier.io/)
- PWA with [Angular Service Worker](https://angular.io/guide/service-worker-intro)

### Libraries

- [Angular](https://angular.io)
- [DSO toolkit](https://dso-toolkit.nl/)
- [RxJS](http://reactivex.io/rxjs)
- [NgRX](https://ngrx.io/)
- [Open Layers](https://openlayers.org/)

### Coding guides

- [Angular](http://github.so.kadaster.nl/DSO/dso-viewer-documentatie/wiki)
- [TypeScript](http://github.so.kadaster.nl/DSO/dso-viewer-documentatie/wiki)
- [Sass](http://github.so.kadaster.nl/DSO/dso-viewer-documentatie/wiki)
- [Performance](http://github.so.kadaster.nl/DSO/dso-viewer-documentatie/wiki)
- [HTML](http://github.so.kadaster.nl/DSO/dso-viewer-documentatie/wiki)
- [Unit tests](http://github.so.kadaster.nl/DSO/dso-viewer-documentatie/wiki)

### See Also

- [DSO-Viewer wiki page](http://github.so.kadaster.nl/DSO/dso-viewer-documentatie/wiki)
- [Old DSO-Viewer wiki page](http://wiki.cs.kadaster.nl/wiki/index.php/DSO_Viewer_Regel_en_Kaart)
