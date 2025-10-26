# Code Citations

## License: MIT
https://github.com/actualbudget/actual/tree/316da144e19ac74a1874c76384157f0869e16fd2/packages/desktop-client/src/browser-preload.browser.js

```
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey) {
    // Cmd/Ctrl+o
    if (e.key === 'o') {
      e.preventDefault();
      window.__actionsForMenu.closeBudget
```

