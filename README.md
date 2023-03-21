# Fastjobs Utils (fse-utils)

An Utility Library containing configs , utility functions and helpers under fastjobs umbrella

## Version 1.1.0

- Added RabbitMq Config

## How to use Library <br></br>

> ### Step 1 : Authentication (optional if you are already authenticated)

- Create a github access token (PAT) for your github account, with package (```read``` permission atleast) permission.

- Open Terminal and login to github npm registry

```bash
$ npm login --scope=@fastjobsio --auth-type=legacy --registry=https://npm.pkg.github.com

> Username: USERNAME
> Password: TOKEN
```
where ``` username ``` is the github user name and ``` password ``` is your github access token
<br></br>
> ### Step 2 : Setup Organization Package Registry

- Add a ``` .npmrc ``` file to your project in your project root directory with the following content .
<br></br>
```
@fastjobsio:registry=https://npm.pkg.github.com
```

> ### Step 3 : Install Packages using npm install.

- You are all set to use packages under fastjobs organization 

- You can normally install packages like : 
```
npm install @fastjobsio/fastjobs-utils
```
or via package.json

```
"@fastjobsio/fastjobs-utils": "^1.1.0"
```