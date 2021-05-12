module.exports = {
    apps: [
        {
            name: "zilwatch",
            script: "bin/www",
            watch: false,
            // Remember to run 'npm run uglifyjs' before running any of these pm2 scripts.
            env: {
                "PORT": 3000,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 3001,
                "NODE_ENV": "production",
            }
        }
    ]
}
