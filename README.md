# How to run

Make sure you install node and git first, then run the following

```
git clone https://github.com/AzizTw/Kmaps-solver-app
cd Kmaps-solver-app
npm install
```

Then run `node app.js` to start the server which you can access at <http://localhost:3000>

# Project structure

```
.
├── README.md		# this file
├── app.js		# The server. It basically routes urls
├── kmap		# the backend. We basically don't need to touch it anymore
│   ├── demo.js		# test driving the backend.
│   └── kamp.js		# list of functions that solve a Kmap
├── package.json	# ignore this
├── public		# the frontend. We mostly need to work on this
│   ├── main.js		# the frontend javascript
│   └── style.css	# the styles
└── views		# here we store the html files.
    └── calc.html	# this is the calculator mode. It's basically done. We'll add practice mode later
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
- [ ] Labelling the K-Map (somewhat finished)
