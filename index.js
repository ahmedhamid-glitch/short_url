const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const staticRoute = require("./routes/staticRouter.js");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");

const { connectToMongoDB } = require("./connect.js");
const { URL } = require("./models/url.js");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth.js");
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short_url").then(() => {
  console.log("MongoDB Connected");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId }, // Correct field name
      {
        $push: {
          visitHistory: { timestamp: Date.now() },
        },
      },
      {
        new: true,
      }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectURL);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
