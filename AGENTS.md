# Guidelines for Codex Agents

This repository is a Homebridge plugin written in TypeScript.  It exposes a thermostat
and fan accessory that communicate with Windmill AC units using the Blynk based
API.  Source files live under `src/` and compile to JavaScript in `dist/`.

## Development workflow

* Install dependencies with `npm install` if needed.
* Run `npm run lint` to check style rules before committing.
* Run `npm run build` to compile TypeScript.  The output in `dist/` is ignored
  by git and should not be committed.
* During development you can run `npm run watch` which builds the project and
  starts Homebridge with hot reload via nodemon.

## Notes on the Homebridge API

The code relies on Homebridge 1.3+ and imports types from the `homebridge`
package.  At runtime the Homebridge API is provided via the `api` object passed
to the exported initializer in `src/accessory.ts`.  Avoid `require()` calls to
`homebridge` in normal code—use the `api.hap` reference instead as demonstrated
in the source.

## Dependencies

* `node-fetch` v2 is used for HTTP requests.  Upgrading to v3 would require
  converting the codebase to ES modules, so keep v2 unless intentionally
  migrating the project.
* `@types/node` and other dev dependencies provide typings and linting support.

## Programmatic checks

Codex agents should run the following commands after making changes:

```bash
npm run lint
npm run build
```

Both commands must succeed.  There are currently no automated tests.

## Keeping this guide up to date

If you discover new build steps or dependencies while working on the project,
please update this `AGENTS.md` file so future contributors have the latest
instructions.
