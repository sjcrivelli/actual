# ESM/CJS Coherency Report (Browser)

## Files Using CJS Exports in `packages/desktop-client`

### 1. `src/sync-events.js`
**CJS Usage:**
```js
exports.listenForSyncEvent = listenForSyncEvent;
```
**Minimal ESM Rewrite:**
```js
export { listenForSyncEvent };
```

---

### 2. `src/users/usersSlice.js`
**CJS Usage:**
```js
exports.loadUserData = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.signOut = exports.loggedIn = exports.getUserData = void 0;
exports.getUserData = ...;
exports.loggedIn = ...;
exports.signOut = ...;
exports.name = ...;
exports.reducer = ...;
exports.getInitialState = ...;
exports.actions = ...;
exports.loadUserData = ...;
```
**Minimal ESM Rewrite:**
```js
export const getUserData = ...;
export const loggedIn = ...;
export const signOut = ...;
export const name = usersSlice.name;
export const reducer = usersSlice.reducer;
export const getInitialState = usersSlice.getInitialState;
export const actions = { ...usersSlice.actions, getUserData, loggedIn, signOut };
export const loadUserData = actions.loadUserData;
```

---

### 3. `src/tags/tagsSlice.js`
**CJS Usage:**
```js
exports.markTagsDirty = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.findTags = exports.updateTag = exports.deleteAllTags = exports.deleteTag = exports.createTag = exports.reloadTags = exports.getTags = void 0;
exports.getTags = ...;
exports.reloadTags = ...;
exports.createTag = ...;
exports.deleteTag = ...;
exports.deleteAllTags = ...;
exports.updateTag = ...;
exports.findTags = ...;
exports.name = ...;
exports.reducer = ...;
exports.getInitialState = ...;
exports.actions = ...;
exports.markTagsDirty = ...;
```
**Minimal ESM Rewrite:**
```js
export const getTags = ...;
export const reloadTags = ...;
export const createTag = ...;
export const deleteTag = ...;
export const deleteAllTags = ...;
export const updateTag = ...;
export const findTags = ...;
export const name = tagSlice.name;
export const reducer = tagSlice.reducer;
export const getInitialState = tagSlice.getInitialState;
export const actions = { ...tagSlice.actions, getTags, reloadTags, createTag, deleteTag, deleteAllTags, updateTag, findTags };
export const markTagsDirty = tagSlice.actions.markTagsDirty;
```

---

## Exact Diffs (for ESM conversion)

### `src/sync-events.js`
```diff
-exports.listenForSyncEvent = listenForSyncEvent;
+export { listenForSyncEvent };
```

### `src/users/usersSlice.js`
```diff
-exports.loadUserData = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.signOut = exports.loggedIn = exports.getUserData = void 0;
-exports.getUserData = ...;
-exports.loggedIn = ...;
-exports.signOut = ...;
-exports.name = ...;
-exports.reducer = ...;
-exports.getInitialState = ...;
-exports.actions = ...;
-exports.loadUserData = ...;
+export const getUserData = ...;
+export const loggedIn = ...;
+export const signOut = ...;
+export const name = usersSlice.name;
+export const reducer = usersSlice.reducer;
+export const getInitialState = usersSlice.getInitialState;
+export const actions = { ...usersSlice.actions, getUserData, loggedIn, signOut };
+export const loadUserData = actions.loadUserData;
```

### `src/tags/tagsSlice.js`
```diff
-exports.markTagsDirty = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.findTags = exports.updateTag = exports.deleteAllTags = exports.deleteTag = exports.createTag = exports.reloadTags = exports.getTags = void 0;
-exports.getTags = ...;
-exports.reloadTags = ...;
-exports.createTag = ...;
-exports.deleteTag = ...;
-exports.deleteAllTags = ...;
-exports.updateTag = ...;
-exports.findTags = ...;
-exports.name = ...;
-exports.reducer = ...;
-exports.getInitialState = ...;
-exports.actions = ...;
-exports.markTagsDirty = ...;
+export const getTags = ...;
+export const reloadTags = ...;
+export const createTag = ...;
+export const deleteTag = ...;
+export const deleteAllTags = ...;
+export const updateTag = ...;
+export const findTags = ...;
+export const name = tagSlice.name;
+export const reducer = tagSlice.reducer;
+export const getInitialState = tagSlice.getInitialState;
+export const actions = { ...tagSlice.actions, getTags, reloadTags, createTag, deleteTag, deleteAllTags, updateTag, findTags };
+export const markTagsDirty = tagSlice.actions.markTagsDirty;
```

---

## Node-only API Check

No Node-only APIs (e.g., `fs`, `path`, `process`, etc.) are referenced in these files.
