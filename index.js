const express = require("express");
const data = require("./rules.json");
const { writeFile } = require("fs");

const path = "./rules.json";

const app = express();
app.use(express.json());
app.listen(8080, () => {
  console.log("Golder rules server is runing ");
});

// ------------
// Routes
// ------------

app.get("/rules", (_, res) => {
  res.status(200).send(data);
});

app.get("/rules/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const desiredItem = data[data.findIndex((item) => item.id === id)];
  if (desiredItem) {
    res.status(200).send(desiredItem);
  } else {
    res.status(404).send("not found");
  }
});

app.post("/rules/new-rule", (req, res) => {
  const lastRule = data[data.length - 1];
  const id = lastRule.id + 1;

  if (!req.body.title) {
    res.status(400).send("Rule must have a title");
  } else {
    const newData = [
      ...data,
      {
        id: req.body.id || id,
        title: req.body.title,
        description: req.body.description || "",
        likes: req.body.likes || 0,
        dislikes: req.body.dislikes || 0,
        tags: req.body.tags || [],
      },
    ];

    writeFile(path, JSON.stringify(newData), (error) => {
      if (error) {
        console.log("An error has occurred ", error);
        return;
      }
      console.log("New Rule successfully added to json");
    });
    return res.status(201).send(newData);
  }
});

app.put("/rules/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (!req.body.title) {
    res.status(400).send("Rule must have a title");
  } else {
    const existingPorductKey = data.findIndex((item) => item.id === id);

    if (existingPorductKey !== -1) {
      data[existingPorductKey] = {
        id: req.body.id || id,
        title: req.body.title,
        description: req.body.description || "",
        likes: req.body.likes || 0,
        dislikes: req.body.dislikes || 0,
        tags: req.body.tags || [],
      };
      writeFile(path, JSON.stringify(data), (error) => {
        if (error) {
          console.log("An error has occurred ", error);
          return;
        }
        console.log(`Rule ${id} updated successfully`);
      });
      return res.status(201).send(data);
    } else {
      const newData = [
        ...data,
        {
          id,
          title: req.body.title,
          description: req.body.description || "",
          likes: req.body.likes || 0,
          dislikes: req.body.dislikes || 0,
          tags: req.body.tags || [],
        },
      ];
      writeFile(path, JSON.stringify(newData), (error) => {
        if (error) {
          console.log("An error has occurred ", error);
          return;
        }
        console.log(`Rule ${id} created successfully`);
      });
      return res.status(201).send(newData);
    }
  }
});

app.patch("/rules/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  const existingPorductKey = data.findIndex((item) => item.id === id);

  if (existingPorductKey !== -1) {
    data[existingPorductKey] = {
      id: req.body.id || data[existingPorductKey].id,
      title: req.body.title || data[existingPorductKey].title,
      description: req.body.description || data[existingPorductKey].description,
      likes: req.body.likes || data[existingPorductKey].likes,
      dislikes: req.body.dislikes || data[existingPorductKey].dislikes,
      tags: req.body.tags || data[existingPorductKey].tags,
    };
    writeFile(path, JSON.stringify(data), (error) => {
      if (error) {
        console.log("An error has occurred ", error);
        return;
      }
      console.log(`Rule ${id} updated successfully`);
    });
    return res.status(200).send(data);
  } else {
    return res.status(404).send(`Error: no rule found`);
  }
});

app.delete("/rules/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const ruleToRemoveKey = data.findIndex((item) => item.id === id);

  if (ruleToRemoveKey !== -1) {
    data.splice(ruleToRemoveKey, 1);
    writeFile(path, JSON.stringify(data), (error) => {
      if (error) {
        console.log("An error has occurred ", error);
        return;
      }
      console.log(`Rule ${id} deleted successfully`);
    });
    return res.status(200).send(data);
  } else {
    return res.status(404).send(`Error: no rule found`);
  }
});
