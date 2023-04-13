# RiffEdu Plugin Starter Template

This repository started with a shallow clone from [Mattermost Plugin Starter Template](https://github.com/mattermost/mattermost-plugin-starter-template),
commit [121997e7](https://github.com/mattermost/mattermost-plugin-starter-template/commit/121997e77a4e55978711845875a21c0316d70931).

The following changes were then made to the starter webapp:

- Added some standard package.json properties such as name, version, author, etc.
- remove all test related code and packages.  
  This was done because it is a lot of overhead for testing which hasn't been used by the current RiffEdu
  plugins.  They should get tests written and a framework put in place, but exactly what that is should
  be determined at that time.
- change package versions from exact to caret prefix.  
  It is my belief that it is better keep dependencies as up-to-date as is possible. The package.json
  should reflect the actual versions the developer used, and they should update using
  `npm update --save` while developement is ongoing.
- updated all packages to the latest version that could be used, and replaced
  deprecated packages with the new maintained packages.
- removed experimental sync w/ starter support (I expect syncing will be a manual process when desired)
- added the webpack ts-loader to handle typescript transpilation and adjusted configuration files accordingly
- removed most babel plugins which aren't needed any longer
- changes the eslint config from json to yml because I find it much more readable
- replaced the Mattermost GitHub actions (ci & cd) with the Riff actions (ci & release)
- added pull request and issue templates


## Issues
### @mattermost/webapp package
In order to install the webapp dependency `"@mattermost/webapp": "github:mattermost/mattermost-webapp#v6.3.10"`
the `--openssl-legacy-proivder` option must be exported in the `NODE_OPTIONS` env variable.
This is not ideal (see https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported)
but I suspect is caused by a nested use of npm.

It is being handled by a change to the `webapp/node_modules` target in the `Makefile`.

### @mattermost/types
`@mattermost/types@6.7.0-0` "specifies" typescript `v4` as a peer dependency and we have upgraded to `v5` which otherwise works fine.

However this causes a peer dependency conflict and npm won't install.

This has been handled by adding an `overrides` section in `package.json` to specify that `@mattermost/types`
should use the same version of typescript as the plugin is installing. See the
[overrides](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#overrides) documentation.

---
**_Below is the original Mattermost README for their plugin starter template that this one is derived from_**

---
# Plugin Starter Template [![CircleCI branch](https://img.shields.io/circleci/project/github/mattermost/mattermost-plugin-starter-template/master.svg)](https://circleci.com/gh/mattermost/mattermost-plugin-starter-template)

This plugin serves as a starting point for writing a Mattermost plugin. Feel free to base your own plugin off this repository.

To learn more about plugins, see [our plugin documentation](https://developers.mattermost.com/extend/plugins/).

This template requires node v16 and npm v8. You can download and install nvm to manage your node versions by following the instructions [here](https://github.com/nvm-sh/nvm). Once you've setup the project simply run `nvm i` within the root folder to use the suggested version of node.

## Getting Started
Use GitHub's template feature to make a copy of this repository by clicking the "Use this template" button.

Alternatively shallow clone the repository matching your plugin name:
```
git clone --depth 1 https://github.com/mattermost/mattermost-plugin-starter-template com.example.my-plugin
```

Note that this project uses [Go modules](https://github.com/golang/go/wiki/Modules). Be sure to locate the project outside of `$GOPATH`.

Edit the following files:
1. `plugin.json` with your `id`, `name`, and `description`:
```
{
    "id": "com.example.my-plugin",
    "name": "My Plugin",
    "description": "A plugin to enhance Mattermost."
}
```

2. `go.mod` with your Go module path, following the `<hosting-site>/<repository>/<module>` convention:
```
module github.com/example/my-plugin
```

3. `.golangci.yml` with your Go module path:
```yml
linters-settings:
  # [...]
  goimports:
    local-prefixes: github.com/example/my-plugin
```

Build your plugin:
```
make
```

This will produce a single plugin file (with support for multiple architectures) for upload to your Mattermost server:

```
dist/com.example.my-plugin.tar.gz
```

## Development

To avoid having to manually install your plugin, build and deploy your plugin using one of the following options. In order for the below options to work, you must first enable plugin uploads via your config.json or API and restart Mattermost.

```json
    "PluginSettings" : {
        ...
        "EnableUploads" : true
    }
```

### Deploying with Local Mode

If your Mattermost server is running locally, you can enable [local mode](https://docs.mattermost.com/administration/mmctl-cli-tool.html#local-mode) to streamline deploying your plugin. Edit your server configuration as follows:

```json
{
    "ServiceSettings": {
        ...
        "EnableLocalMode": true,
        "LocalModeSocketLocation": "/var/tmp/mattermost_local.socket"
    },
}
```

and then deploy your plugin:
```
make deploy
```

You may also customize the Unix socket path:
```
export MM_LOCALSOCKETPATH=/var/tmp/alternate_local.socket
make deploy
```

If developing a plugin with a webapp, watch for changes and deploy those automatically:
```
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_TOKEN=j44acwd8obn78cdcx7koid4jkr
make watch
```

### Deploying with credentials

Alternatively, you can authenticate with the server's API with credentials:
```
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_USERNAME=admin
export MM_ADMIN_PASSWORD=password
make deploy
```

or with a [personal access token](https://docs.mattermost.com/developer/personal-access-tokens.html):
```
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_TOKEN=j44acwd8obn78cdcx7koid4jkr
make deploy
```

## Q&A

### How do I make a server-only or web app-only plugin?

Simply delete the `server` or `webapp` folders and remove the corresponding sections from `plugin.json`. The build scripts will skip the missing portions automatically.

### How do I include assets in the plugin bundle?

Place them into the `assets` directory. To use an asset at runtime, build the path to your asset and open as a regular file:

```go
bundlePath, err := p.API.GetBundlePath()
if err != nil {
    return errors.Wrap(err, "failed to get bundle path")
}

profileImage, err := ioutil.ReadFile(filepath.Join(bundlePath, "assets", "profile_image.png"))
if err != nil {
    return errors.Wrap(err, "failed to read profile image")
}

if appErr := p.API.SetProfileImage(userID, profileImage); appErr != nil {
    return errors.Wrap(err, "failed to set profile image")
}
```

### How do I build the plugin with unminified JavaScript?
Setting the `MM_DEBUG` environment variable will invoke the debug builds. The simplist way to do this is to simply include this variable in your calls to `make` (e.g. `make dist MM_DEBUG=1`).
