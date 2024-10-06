const jwt = require("jsonwebtoken");
const pool = require("../db");

const generateOTP = () => {
  let a = Math.floor(Math.random() * 10) * 1000;
  let b = Math.floor(Math.random() * 10) * 100;
  let c = Math.floor(Math.random() * 10) * 10;
  let d = Math.floor(Math.random() * 10);

  return a + b + c + d;
};

module.exports = {
  send: async (req, res) => {
    const { email } = req.body;
    const userInfo = await pool.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);

    if (userInfo.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email not registered" });
    }
    const otp = generateOTP();
    await pool.query(
      "INSERT INTO otp (email, otp, otp_expiry_ts) VALUES ($1, $2, EXTRACT(EPOCH FROM NOW() + INTERVAL '10 minutes'));",
      [email, otp]
    );
    return res
      .status(200)
      .json({ success: true, message: "OTP has been sent", otp: otp });
  },
  verify: async (req, res) => {
    const { email, otp } = req.body;

    // check if email is registered
    const userInfo = await pool.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);

    if (userInfo.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email not registered" });
    }

    const userotp = await pool.query(
      "SELECT * FROM otp WHERE email = $1 ORDER BY otp_expiry_ts DESC LIMIT 1;",
      [email]
    );

    if (Math.floor(Date.now() / 1000) > userotp.rows[0].otp_expiry_ts) {
      return res
        .status(400)
        .json({ success: false, message: "Time Limit Exceeded" });
    }
    if (userotp.rows[0].otp == otp) {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: userInfo.rows[0].id,
          email: email,
          name: userInfo.rows[0].username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.status(200).json({ success: true, token: token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid OTP or email" });
    }
  },
  signupSend: async (req, res) => {
    const { email, username } = req.body;
    const emailCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1;",
      [email]
    );

    if (emailCheck.rows.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered!",
      });
    }

    const usernameCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1;",
      [username]
    );

    if (usernameCheck.rows.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "Username already taken!",
      });
    }

    const otp = generateOTP();
    await pool.query(
      "INSERT INTO otp (email, otp, otp_expiry_ts) VALUES ($1, $2, EXTRACT(EPOCH FROM NOW() + INTERVAL '10 minutes'));",
      [email, otp]
    );
    return res
      .status(200)
      .json({ success: true, message: "OTP has been sent", otp: otp });
  },
  signupVerify: async (req, res) => {
    const { email, username, otp } = req.body;

    const userotp = await pool.query(
      "SELECT * FROM otp WHERE email = $1 ORDER BY otp_expiry_ts DESC LIMIT 1;",
      [email]
    );

    if (Math.floor(Date.now() / 1000) > userotp.rows[0].otp_expiry_ts) {
      return res
        .status(400)
        .json({ success: false, message: "Time Limit Exceeded" });
    }

    const userInfo = await pool.query(
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;",
      [username, email]
    );

    if (userotp.rows[0].otp == otp) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: userInfo.rows[0].id, email: email, name: username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({ success: true, token: token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid OTP or email" });
    }
  },
};
