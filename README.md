
# Task Management Telegram Bot

A simple task management bot for Telegram built using [Telegraf](https://telegraf.js.org/) and [Firebase Firestore](https://firebase.google.com/docs/firestore) as the backend database. The bot allows users to add, mark, delete, and list tasks directly from Telegram.

## Try the Bot

You can try the bot using the following Telegram link: [Task Management Bot](https://t.me/TaskifyMasterbot)

## Features

- **Add Tasks**: Create new tasks to keep track of your to-do list.
- **Mark Tasks as Done**: Mark tasks as completed.
- **Delete Tasks**: Remove tasks from your list.
- **List Tasks**: View all tasks, along with their status (Pending/Done).

## Commands

- `/start`: Show a welcome message and a list of available commands.
- `/addtask [task description]`: Add a new task.
- `/markdone`: List all pending tasks with an option to mark them as done.
- `/deletetask`: List all tasks with an option to delete them.
- `/listtasks`: Display all tasks along with their status (✅ Done or ❌ Pending).

## Tech Stack

- **Telegraf**: A framework for building Telegram bots.
- **Firebase Firestore**: A NoSQL cloud database to store users' tasks.
- **dotenv**: For managing environment variables.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [npm](https://www.npmjs.com/get-npm)
- A [Firebase project](https://firebase.google.com/) with Firestore enabled.
- A [Telegram Bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot) and its bot token.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/PrashanthEmmadi1430/task-management-bot.git
   cd task-management-bot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   BOT_TOKEN=your-telegram-bot-token
   FIREBASE_API_KEY=your-firebase-api-key
   FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   FIREBASE_APP_ID=your-firebase-app-id
   ```

   > You can find these Firebase credentials in your Firebase console under Project Settings.

4. Initialize Firebase Firestore:

   - Go to the [Firebase Console](https://console.firebase.google.com/), select your project, and enable Firestore under the **Database** section.
## Contributions

Feel free to contribute by submitting issues or pull requests. If you have suggestions for improvements, please let us know!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact [prashanthemmadi6@gmail.com](prashanthemmadi6@gmail.com).
