# How to run

Make sure you install node and git first, then run the following

```
git clone https://github.com/AzizTw/Kmaps-solver-app
cd Kmaps-solver-app
npm install
```

Essential things we still did not implement:

- [ ] Taking input from minterms separated by commas
    - Don't forget about input validation
    - Make sure you reuse getSolution() from public/main.js

- [ ] Practice mode
    - Show A non-interactive Kmap
    - Get the solution and store it, but don't display it!
    - Ask the user to enter the solution
    - See if the users's solution matches

- [ ] Database with kmaps (maybe with ranging difficulties)
    - Inital idea: A K-map is an entyt containing the following:
        - Id (key)
        - Number of variables:
        - Difficulty:
        - A json string containing:
            - Array containing the minterms
            - Array containing the dont_cares
    - We'll later link this with practice mode.

- [x] nxn (finished)
- [ ] Labelling the K-Map
