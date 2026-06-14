# OTClient modules

Um module geralmente tem:

- `.otmod`: manifesto.
- `.lua`: logica.
- `.otui`: interface.

Sempre destrua widgets em `terminate()` e remova callbacks criados com `connect`.
