const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Serve static files (like index.html) from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.db_host,
  user: process.env.db_user,
  database: process.env.db_name,
});
// For the root URL, send the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// For the uservoting URL, render the uservoting.ejs file with candidates data
app.get("/uservoting", (req, res) => {
  const faceid = req.query.faceid;
  const query = "SELECT * FROM candidates";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching candidates:", err);
      res.status(500).send("Error fetching candidates");
      return;
    }
    res.render("uservoting", { candidates: results, faceid: faceid });
  });
});

// For the donevoting URL, render the donevoting.ejs file with candidates data
app.get("/donevoting", (req, res) => {
  const query = "SELECT name, votes FROM candidates";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching candidates:", err);
      res.status(500).send("Error fetching candidates");
      return;
    }
    res.render("donevoting", { candidates: results });
  });
});

// For the login URL, send the login.html file
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// For the choose URL, send the choose.html file
app.get("/choose", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "choose.html"));
});

// For the choose URL, send the candidateadding.ejs file
app.get("/candidateadding", (req, res) => {
  const query = "SELECT * FROM candidates";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching candidates:", err);
      res.status(500).send("Error fetching candidates");
      return;
    }
    res.render("candidateadding", { candidates: result });
  });
});

// Handle the POST request to vote for a candidate
app.post("/vote", (req, res) => {
  const candidateId = req.body.candidateId;
  const faceID = req.body.voterId;
  console.log("candidateId", candidateId);
  console.log("Voter ID: ", faceID);
  if (!candidateId) {
    res.status(400).send("Invalid candidate ID");
    return;
  }

  const query = "UPDATE candidates SET votes = votes + 1 WHERE id = ?";
  db.query(query, [candidateId], (err, result) => {
    if (err) {
      console.error("Error updating votes:", err);
      res.status(500).send("Error updating votes");
      return;
    }
    db.query(
      "UPDATE voters SET voted = TRUE WHERE faceid = ?",
      [faceID],
      (err, result) => {
        if (err) {
          console.error("Error updating votes:", err);
          res.status(500).send("Error updating votes");
          return;
        }
      }
    );
    res.redirect("/donevoting");
  });
});

// For the choose URL, send the voteradding.html file

app.get("/voteradding", (req, res) => {
  res.render("voteradding");
});

// For the choose URL, send the userroll.html file
app.get("/userroll", (req, res) => {
  res.render("userroll");
});

// Handle the POST request to add a candidate
app.post("/addcandidate", (req, res) => {
  const candidateName = req.body.candidateName;
  console.log("Candidate Name:", candidateName);
  // Insert candidate into the database
  const query = "INSERT INTO candidates (name,votes) VALUES (?,?)";
  db.query(query, [candidateName, 0], (err, result) => {
    if (err) {
      console.error("Error inserting candidate:", err);
      res.status(500).send("Error adding candidate");
      return;
    }

    res.redirect("/candidateadding");
  });
});

// Handle the POST request to delete a candidate
app.post("/deletecandidate", (req, res) => {
  const candidateId = req.body.candidateId;
  const query = "DELETE FROM candidates WHERE id = ?";
  db.query(query, [candidateId], (err, result) => {
    if (err) {
      console.error("Error deleting candidate:", err);
      res.status(500).send("Error deleting candidate");
      return;
    }
    res.redirect("/candidateadding");
  });
});

// Handle the POST request to reset the candidate ID
app.post("/resetcandidateid", (req, res) => {
  const deleteQuery = "DELETE FROM candidates";
  db.query(deleteQuery, (err, result) => {
    if (err) {
      console.error("Error deleting candidates:", err);
      res.status(500).send("Error deleting candidates");
      return;
    }
    const resetQuery = "ALTER TABLE candidates AUTO_INCREMENT = 1";
    db.query(resetQuery, (err, result) => {
      if (err) {
        console.error("Error resetting candidate ID:", err);
        res.status(500).send("Error resetting candidate ID");
        return;
      }
      res.redirect("/candidateadding");
    });
  });
});

// Handle the POST request to add a voter
app.post("/addvoter", upload.none(), (req, res) => {
  const { faceid, facedescriptor } = req.body;

  // Check for duplicate faceid
  const checkQuery = "SELECT * FROM voters WHERE faceid = ?";
  db.query(checkQuery, [faceid], (err, results) => {
    if (err) {
      console.error("Error checking for duplicate faceid:", err);
      res.status(500).send("Error checking for duplicate faceid");
      return;
    }
    if (results.length > 0) {
      res.status(400).send("Voter with this face ID already exists");
      return;
    }

    // Insert voter into the database
    const insertQuery =
      "INSERT INTO voters (faceid, facedescriptor) VALUES (?, ?)";
    db.query(insertQuery, [faceid, facedescriptor], (err, result) => {
      if (err) {
        console.error("Error inserting voter:", err);
        res.status(500).send("Error adding voter");
        return;
      }
      console.log(`Voter with face ID ${faceid} added successfully!`);
      res.redirect("/voteradding");
    });
  });
});

// Handle the GET request to fetch face descriptor
app.get("/getfacedescriptor", (req, res) => {
  const rollNumber = req.query.rollNumber;

  // Check if the voter has already voted
  const checkQuery = "SELECT voted FROM voters WHERE faceid = ?";
  db.query(checkQuery, [rollNumber], (err, results) => {
    if (err) {
      console.error("Error checking voter status:", err);
      res.status(500).json({ error: "Error checking voter status" });
      return;
    }
    if (results.length === 0 || results[0].voted) {
      res
        .status(500)
        .json({ error: "Voter has already voted or does not exist" });
      return;
    }
    const query = "SELECT facedescriptor FROM voters WHERE faceid = ?";
    db.query(query, [rollNumber], (err, results) => {
      if (err) {
        console.error("Error fetching face descriptor:", err);
        res.status(500).json({ error: "Error fetching face descriptor" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "No voter found with this roll number" });
        return;
      }
      res.json({ facedescriptor: JSON.parse(results[0].facedescriptor) });
    });
  });
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
