The index file should work as is.
You might need to replace `//extjs` URL though.

## Repeating problems
Initially created for the `Ext.menu.Menu` problems (with a card with a list of documents).

To repeat and debug other problems:
1. Add card to test and replace it in `Molnet.view.Viewport`.
2. Add controller on `Molnet.Application` (and probably remove `IndexController`).
3. Mock API requests as in the `IndexStore` or as in the `SessionController`.
4. Add required Less/CSS.
5. Change settings in the `_mockSettings` function.
