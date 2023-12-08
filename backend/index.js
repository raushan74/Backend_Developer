//const express = require('express')

import express from "express";

const app = express();

// app.get('/',(req, res) =>{
//     res.send('server is ready');
// });

// get a list of 5 jokes
app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "The Mathematician's Dilemma",
      content:
        "Why was the equal sign so humble? Because he knew he wasn't less than or greater than anyone else.",
    },
    {
      id: 2,
      title: "Coffee Time",
      content:
        "Why don't coffee beans ever get into arguments? Because they know how to espresso themselves and don't want to be filtered out of the conversation.",
    },
    {
      id: 3,
      title: "Light Bulb Moment",
      content:
        "How many software engineers does it take to change a light bulb? None, that's a hardware issue.",
    },
    {
      id: 4,
      title: "Fishy Business",
      content: "What do you call a fish wearing a crown? A kingfish!",
    },
    {
      id: 5,
      title: "The Generous Barber",
      content:
        "Why did the barber win an award? Because he knew how to make every cut count!",
    },
  ];
  res.send(jokes);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
