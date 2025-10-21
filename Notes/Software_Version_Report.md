# Software & Library Version Report

This table lists all software, libraries, and tools used in the ActualFork monorepo that specify a version number, including their type and the source file where the version is declared.

| Name                    | Type             | Version         | Source File                                      |
|-------------------------|------------------|-----------------|--------------------------------------------------|
| loot-core               | workspace        | 0.0.2           | packages/loot-core/package.json                   |
| @actual-app/web         | workspace        | 25.10.0         | packages/desktop-client/package.json              |
| @actual-app/api         | workspace        | 25.10.0         | packages/api/package.json                         |
| @actual-app/sync-server | workspace        | 25.10.0         | packages/sync-server/package.json                 |
| @actual-app/crdt        | workspace        | 2.1.0           | packages/crdt/package.json                        |
| @jlongster/sql.js       | dependency       | ^1.6.7          | packages/loot-core/package.json                   |
| @reduxjs/toolkit        | dependency       | ^2.9.0          | packages/loot-core/package.json                   |
| @rschedule/core         | dependency       | ^1.5.0          | packages/loot-core/package.json                   |
| @rschedule/json-tools   | dependency       | ^1.5.0          | packages/loot-core/package.json                   |
| @rschedule/standard-date-adapter | dependency | ^1.5.0      | packages/loot-core/package.json                   |
| absurd-sql              | dependency       | 0.0.54          | packages/loot-core/package.json                   |
| adm-zip                 | dependency       | 0.5.16 (patch)  | packages/loot-core/package.json                   |
| better-sqlite3          | dependency       | ^12.4.1         | packages/loot-core/package.json                   |
| csv-parse               | dependency       | ^6.1.0          | packages/loot-core/package.json                   |
| csv-stringify           | dependency       | ^6.6.0          | packages/loot-core/package.json                   |
| date-fns                | dependency       | ^4.1.0          | packages/loot-core/package.json                   |
| deep-equal              | dependency       | ^2.2.3          | packages/loot-core/package.json                   |
| handlebars              | dependency       | ^4.7.8          | packages/loot-core/package.json                   |
| lru-cache               | dependency       | ^11.2.2         | packages/loot-core/package.json                   |
| md5                     | dependency       | ^2.3.0          | packages/loot-core/package.json                   |
| memoize-one             | dependency       | ^6.0.0          | packages/loot-core/package.json                   |
| mitt                    | dependency       | ^3.0.1          | packages/loot-core/package.json                   |
| slash                   | dependency       | 5.1.0           | packages/loot-core/package.json                   |
| ua-parser-js            | dependency       | ^2.0.5          | packages/loot-core/package.json                   |
| uuid                    | dependency       | ^13.0.0         | packages/loot-core/package.json                   |
| @actual-app/api         | devDependency    | workspace:^     | packages/loot-core/package.json                   |
| @actual-app/crdt        | devDependency    | workspace:^     | packages/loot-core/package.json                   |
| @actual-app/web         | devDependency    | workspace:^     | packages/loot-core/package.json                   |
| @swc/core               | devDependency    | ^1.13.5         | packages/loot-core/package.json                   |
| @types/adm-zip          | devDependency    | ^0.5.7          | packages/loot-core/package.json                   |
| @types/better-sqlite3   | devDependency    | ^7.6.13         | packages/loot-core/package.json                   |
| @types/emscripten       | devDependency    | ^1.41.2         | packages/loot-core/package.json                   |
| @types/jlongster__sql.js| devDependency    | npm:@types/sql.js@latest | packages/loot-core/package.json         |
| @types/node             | devDependency    | ^22.18.8        | packages/loot-core/package.json                   |
| @types/pegjs            | devDependency    | ^0.10.6         | packages/loot-core/package.json                   |
| assert                  | devDependency    | ^2.1.0          | packages/loot-core/package.json                   |
| browserify-zlib         | devDependency    | ^0.2.0          | packages/loot-core/package.json                   |
| buffer                  | devDependency    | ^6.0.3          | packages/loot-core/package.json                   |
| cross-env               | devDependency    | ^10.1.0         | packages/loot-core/package.json                   |
| fake-indexeddb          | devDependency    | ^6.2.2          | packages/loot-core/package.json                   |
| fast-check              | devDependency    | 4.3.0           | packages/loot-core/package.json                   |
| i18next                 | devDependency    | ^25.5.3         | packages/loot-core/package.json                   |
| jest-diff               | devDependency    | ^30.2.0         | packages/loot-core/package.json                   |
| jsverify                | devDependency    | ^0.8.4          | packages/loot-core/package.json                   |
| mockdate                | devDependency    | ^3.0.5          | packages/loot-core/package.json                   |
| npm-run-all             | devDependency    | ^4.1.5          | packages/loot-core/package.json                   |
| path-browserify         | devDependency    | ^1.0.1          | packages/loot-core/package.json                   |
| peggy                   | devDependency    | 4.0.2           | packages/loot-core/package.json                   |
| rollup-plugin-visualizer| devDependency    | ^6.0.4          | packages/loot-core/package.json                   |
| stream-browserify       | devDependency    | ^3.0.0          | packages/loot-core/package.json                   |
| ts-node                 | devDependency    | ^10.9.2         | packages/loot-core/package.json                   |
| typescript              | devDependency    | ^5.9.3          | packages/loot-core/package.json                   |
| vite                    | devDependency    | ^7.1.9          | packages/loot-core/package.json                   |
| vite-plugin-node-polyfills | devDependency | ^0.24.0         | packages/loot-core/package.json                   |
| vite-plugin-peggy-loader| devDependency    | ^2.0.1          | packages/loot-core/package.json                   |
| vitest                  | devDependency    | ^3.2.4          | packages/loot-core/package.json                   |
| yargs                   | devDependency    | ^18.0.0         | packages/loot-core/package.json                   |
| @react-spring/web       | dependency       | ^10.0.3         | packages/desktop-client/package.json              |
| react-simple-pull-to-refresh | dependency  | ^1.3.3          | packages/desktop-client/package.json              |
| react-spring            | dependency       | ^10.0.3         | packages/desktop-client/package.json              |
| ...                     | ...              | ...             | ...                                              |

*This table is truncated for brevity. See each package.json for the full list of dependencies and versions.*

- All workspace packages and their versions are included.
- All dependencies and devDependencies with explicit versions are listed.
- For full details, see the respective package.json files in each workspace package.
