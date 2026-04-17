OKRA: Zero-Trust Identity Vault for AI Agents



Problem Statement



As AI agents become increasingly autonomous, they require access to sensitive APIs and financial accounts. Currently, users are forced to hand over their primary API keys to these agents, creating a massive security vulnerability. There is an urgent need for a zero-trust delegation layer specifically designed for AI agents.



Solution Overview



OKRA is a centralized identity and token vault built for AI agents. Instead of giving an agent actual credentials, the user generates a "Leased Identity Token." This token is granted highly specific, immutable scopes.



The platform also includes OKRA Core Intelligence, an integrated AI analyst that continuously monitors the vault telemetry and can answer user queries regarding current agent expenditures, API scopes, and security logs.



Setup Instructions



npm install



Create a .env file in the root directory (already provided in the setup files) and ensure your Gemini API key is present:

VITE\_GEMINI\_API\_KEY=your\_key\_here



npm run dev



Security Note



The .env file containing your API key has been explicitly added to the .gitignore file. Always ensure API keys are never pushed to public source control repositories like GitHub.

