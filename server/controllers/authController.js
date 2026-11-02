const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { refreshTokens, users } = require("../utils");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.authenticateUser = async (req, res) => {
  const { username, password } = req.body;
  // Check if user with username exists
  let user = users.find((user) => user.name === username);
  if (user) {
    // Check if the password if valid
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const jwtUser = { name: username };
      const accessToken = generateAccessToken(jwtUser);
      const refreshToken = jwt.sign(jwtUser, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      return res.json({ accessToken: accessToken, refreshToken: refreshToken });
    }
  }
  res.status(404).json({
    errors: [
      {
        msg: "Invalid Credentials",
      },
    ],
  });
};

exports.signupUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate if the user doesnt already exist;
  let user = users.find((user) => {
    return user.name === username;
  });

  if (user) {
    return res.status(422).json({
      errors: [
        {
          msg: "This user already exists",
        },
      ],
    });
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the password into the db
  users.push({
    name: username,
    password: hashedPassword,
  });

  res.json({ result: "Signup is successful" });
};

exports.generateNewToken = (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
};

exports.invalidateRefreshToken = (req, res) => {
  const indexToRemove = refreshTokens.indexOf(String(req.body.token));
  if (indexToRemove !== -1) {
    refreshTokens.splice(indexToRemove, 1);
  }
  res.sendStatus(204);
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "45s" });
}
