# Orchestrate Cloner (not published yet)

_Description: This module is made to create an duplication of an app on [Orchestrate.io][]

### Project Setup - To use this cli you need a couple of things.

1. run:
        `git clone git@github.com:BEZEI2K/orchestrate-clone.git; cd orchestrate-clone; npm link`
2. An account on [Orchestrate.io][].
3. Have [node.js] installed.
4. Have a live app
5. Once you have located your live app. Click the export data button.
6. While you wait for the email from Orchestrate watch this funny animal video of cats in water https://www.youtube.com/watch?v=TVvcdQFFYhk.
7. You should have an email for your exported data.
8. run this inside of the terminal:
      `orchesclone ofile=path/to/exported/data devkey=dev-app-api-key`
9. Your collections and objects are created along with your graphs and events!
10. Now you have a live app and a dev app in orchestrate.


## Getting Credentials

Don't know where to get your `devkey`? Follow along:

### Orchestrate.io
1. [Sign up](https://dashboard.orchestrate.io/sessions/login) for Orchestrate.io
2. Create an application.
3. See that value under `API Keys`? That's your `devkey`.
4. `echo 'you did it' | say`

[Orchestrate.io]: http://orchestrate.io/
[node.js]: http://nodejs.org/
