import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // API routes
  app.get("/api/auth/github/url", (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ error: "GITHUB_CLIENT_ID not configured" });
    }

    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    const redirectUri = `${appUrl}/auth/github/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "user:email",
    });

    const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    res.json({ url: authUrl });
  });

  app.get("/auth/github/callback", async (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("No code provided");
    }

    try {
      // Exchange code for token
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: { Accept: "application/json" },
        }
      );

      const { access_token } = tokenResponse.data;
      if (!access_token) {
        return res.status(400).send("Failed to get access token");
      }

      // Get user info
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const githubUser = userResponse.data;

      // In a real app, you'd save this to a database and create a session.
      // Here we'll just send a success message and the user data back to the client via postMessage.
      const userData = {
        id: githubUser.id.toString(),
        name: githubUser.name || githubUser.login,
        email: githubUser.email,
        avatar: githubUser.avatar_url,
      };

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  user: ${JSON.stringify(userData)} 
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("OAuth error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
