const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const commands = [
  {
    command: 'start',
    description: 'Start the game'
  },
  {
    command: 'highscores',
    description: 'View the leaderboard'
  },
  {
    command: 'help',
    description: 'Show help information'
  }
];

// Register commands with Telegram
fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyCommands`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ commands })
})
.then(response => response.json())
.then(data => console.log('Commands registered:', data))
.catch(error => console.error('Error registering commands:', error)); 
