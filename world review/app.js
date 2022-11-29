const express = require("express");
const { body } = require("express-validator");
const path = require("path");
const bcrypt = require("bcrypt");
const upload=require("./uploadConfig.js")


//db conection
const dbConnection = require("./database");

const app = express();
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --------------Upload----------------------
app.post("/uploading",function(req,res){
    upload(req,res,function(err){
        if(err){
            console.log(err);
            res.status(500).send("Upload failed");

        }
        else{
            
            res.send("Upload is succesful");
        }
        
    })
})
// ============= Other routes ===============
// ------------- GET all users --------------
// ------------- admin page--------------------
app.get("/users", function (_req, res) {
    const sql = "SELECT * FROM users";
    dbConnection.query(sql, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});

app.get("/users", function (_req, res) {
    const id = _req.params.id;
    const sql = "SELECT * FROM users WHERE id = ?";
    dbConnection.query(sql,  [id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});

// ------------- Delete a users --------------
app.delete("/users/:id", function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM users WHERE id = ?";
    dbConnection.query(sql, [id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (results.affectedRows != 1) {
            console.error('Row deleted is not 1');
            return res.status(500).send("Delete failed");
        }
        res.send("Delete succesfully");
    });
});

// ------------- Add a new users --------------
app.post("/users", function (req, res) {
    const newUsers = req.body;
    const sql = "INSERT INTO users SET ?";
    dbConnection.query(sql, newUsers, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (results.affectedRows != 1) {
            console.error('Row added is not 1');
            return res.status(500).send("Add failed");
        }
        res.send("Add succesfully");
    });
});

// ------------- Update a users --------------
app.put("/users/:id", function (req, res) {
    const id = req.params.id;
    const updateUsers = req.body;
    const sql = "UPDATE users SET ? WHERE id = ?";
    dbConnection.query(sql, [updateUsers, id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (results.affectedRows != 1) {
            console.error('Row updated is not 1');
            return res.status(500).send("Update failed");
        }
        res.send("Update succesfully");
    });
});
// --------------admin page---------------



// -----login----------------------------
app.post("/login", function (req, res) {
    // const id = req.body.id;
    const Email = req.body.Email;
    const password = req.body.password;
    // console.log(username, password);

    const sql = "SELECT id, password FROM users WHERE Email = ?";
    dbConnection.query(sql, [Email], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        else if (results.length != 1) {
            return res.status(400).send("Wrong username");

        }
        else if (Email == "first@mfu.com" && password == 1234) {
            res.send("/welcome");
        }
        bcrypt.compare(password, results[0].password, function (err, same) {
            if (err) {
                res.status(503).send("Authentication server error");
            }
            else if (same == true) {
                res.send("/home");
            }

            else {
                //wrong password
                res.status(400).send("Wrong password");
            }
        });
    });
});

// --------------logout--------------


//=============== register ==============

app.post("/register", function (req, res) {
    const newUsers = req.body;
    const password = req.body.password;
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            return res.status(500).send("Hashing error");
        };
        newUsers.password = hash;
        const sql = "INSERT INTO users SET ?";
        dbConnection.query(sql, newUsers, function (err, results) {
            if (err) {
                console.error(err);
                return res.status(500).send("Database server error");
            }
            if (results.affectedRows != 1) {
                console.error('Row added is not 1');
                return res.status(500).send("Add failed");
            }
            res.send("/login");
            
        });
    });
});

app.get("/getAll", function (_req, res) {
    const sql = "SELECT users.id AS UserId, users.firstname, users.lastname, users.Email, users.password, review.content_id AS ContentId ,review.content_name AS ContentName, review.content, review.banner, review.itzone_id AS ITzoneId, review.create_date, phone.id AS PhoneId, phone.name AS PhoneBrand, phone.img FROM users LEFT JOIN review ON users.Email = review.Email LEFT JOIN phone ON review.itzone_id = phone.id_itzone";
    dbConnection.query(sql, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});
// ============= Other routes ==============
// ------------- GET all products --------------
app.get("/ip14_promax", function (_req, res) {
    
    const sql = "SELECT * FROM ip14promax ";

    con.query(sql, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});
 

app.get("/ip14_promax/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM iphone14_promax WHERE id = ?";

    con.query(sql,[id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});



// ------------- GET phone --------------
app.get("/phone", function (_req, res) {
    
    const sql = "SELECT * FROM phone ";

    con.query(sql, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});
 

app.get("/phone/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM phone WHERE id = ?";

    con.query(sql,[id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});
 



// ------------- GET apple --------------
app.get("/apple", function (_req, res) {
    
    const sql = "SELECT * FROM apple ";

    con.query(sql, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});
 

app.get("/apple/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM ip14promax JOIN apple ON ip14promax.id_apple = apple.id AND apple.id = ?";

    con.query(sql,[id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});




// ------------- GET samsung --------------
app.get("/samsung", function (_req, res) {
    
    const sql = "SELECT * FROM samsung ";

    con.query(sql, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});
 

app.get("/samsung/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM galaxy_zflip JOIN samsung ON galaxy_zflip.id_samsung = samsung.id AND samsung.id = ?";

    con.query(sql,[id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});


// ------------- GET samsung blog --------------
app.get("/blog_sumsung", function (_req, res) {
    
    const sql = "SELECT * FROM galaxy_zflip ";

    con.query(sql, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});
 

app.get("/blog_sumsung/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM galaxy_zflip WHERE galaxy_zflip.id_samsungblock = ?";

    con.query(sql,[id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});


// ------------- GET apple blog --------------
app.get("/blog_apple", function (_req, res) {
    
    const sql = "SELECT * FROM ip14promax ";

    con.query(sql, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});
 

app.get("/blog_apple/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM ip14promax WHERE ip14promax.id_appleblock = ?";

    con.query(sql,[id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});
 
 

// ------------- GET choose blog --------------
app.post("/getDataDetail", function (req, res) {
    const topicID = req.params.topicID;
    const sql = "SELECT * FROM iphone14_promax WHERE id = ?";
    con.query(sql, [topicID], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        } else {
            res.json(results);
        }
        
    
    });
});




// ------------- Add a new product --------------
app.post("/blog_apple", function (req, res) {
    // const {name, price, amount} = req.body;
    // const newProduct = {name: name, price: price, amount: amount};
    const newblog_apple = req.body;
    const sql = "INSERT INTO ip14promax SET ?";
    con.query(sql, newProduct, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (results.affectedRows != 1) {
            console.error('Row added is not 1');
            return res.status(500).send("Add failed");
        }
        res.send("Add succesfully");
    });
});
 
// ------------- Update a product --------------
app.put("/blog_apple/:id", function (req, res) {
    const id = req.params.id;
    // const {name, price, amount} = req.body;
    // const updateProduct = {name: name, price: price, amount: amount};
    const updateblog_apple = req.body;
    const sql = "UPDATE ip14promax SET ? WHERE id = ?";
    con.query(sql, [updateblog_apple, id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (results.affectedRows != 1) {
            console.error('Row updated is not 1');
            return res.status(500).send("Update failed");
        }
        res.send("Update succesfully");
    });
});



// ---------------blogger-------------------------------
app.get("/b", function (_req, res) {
    const sql = "SELECT * FROM review";
    dbConnection.query(sql, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});

// ------------- Delete a users --------------
app.delete("/review/:id", function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM review WHERE id = ?";
    dbConnection.query(sql, [id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (results.affectedRows != 1) {
            console.error('Row deleted is not 1');
            return res.status(500).send("Delete failed");
        }
        res.send("Delete succesfully");
    });
});

// ------------- Add a new content --------------
app.post("/review", function (req, res) {
    const newUsers = req.body;
    const sql = "INSERT INTO review SET ?";
    dbConnection.query(sql, newUsers, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (results.affectedRows != 1) {
            console.error('Row added is not 1');
            return res.status(500).send("Add failed");
        }
        res.send("/review");
    });
});

// ------------- Update a content --------------
app.put("/review/:id", function (req, res) {
    const id = req.params.id;
    const updateblogger = req.body;
    const sql = "UPDATE review SET ? WHERE id = ?";
    dbConnection.query(sql, [updateblogger, id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (results.affectedRows != 1) {
            console.error('Row updated is not 1');
            return res.status(500).send("Update failed");
        }
        res.send("Update succesfully");
    });
});

// ------------upload page--------------
app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"views/upload.html"))
})
// ------------blogger page-------------
app.get("/review", function (req, res) {
    res.sendFile(path.join(__dirname, "views/blogger.html"));
});
// ------------blogger page-------------
app.get("/list", function (req, res) {
    res.sendFile(path.join(__dirname, "views/n1.html"));
});
// ------------- Welcome --------------
app.get("/welcome", function (req, res) {
    res.sendFile(path.join(__dirname, "views/welcome.html"));
});

//------------register page--------------
app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname, "views/register.html"));
})

app.get("/home", function (req, res) {
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "views/login.html"));
});
const port = 3000;
app.listen(port, function () {
    console.log("Server is ready at " + port);
});


