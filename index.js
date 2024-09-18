// Import dependencies
const { Telegraf, Markup } = require('telegraf');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where, getDoc } = require('firebase/firestore');
require('dotenv').config();
const express = require("express");

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Telegram Bot
const bot = new Telegraf(process.env.BOT_TOKEN);


const app = express();
const PORT =  8080; 
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});



// /start command to show welcome message and commands
bot.start((ctx) => {
  ctx.reply(
    `Welcome to Task Management Bot! 📝
Here are the commands you can use:
- /addtask [task description] - Add a new task
- /markdone - Mark a task as done
- /deletetask - Delete a task
- /listtasks - List all your tasks`
  );
});

// Command to add a task
bot.command('addtask', async (ctx) => {
  const userId = ctx.from.id;
  const taskText = ctx.message.text.replace('/addtask ', '').trim();

  if (!taskText || taskText === '/addtask') {
    ctx.reply('Please provide a valid task description after /addtask.');
    return;
  }

  try {
    const userTasksCollection = collection(db, 'users', userId.toString(), 'tasks');

    // Check if the task already exists
    const existingTasksQuery = query(userTasksCollection, where('task', '==', taskText));
    const existingTasksSnapshot = await getDocs(existingTasksQuery);

    if (!existingTasksSnapshot.empty) {
      ctx.reply('A task with this name already exists. Please give another task.');
      return;
    }

    await addDoc(userTasksCollection, {
      task: taskText,
      done: false,
      createdAt: new Date(),
    });

    ctx.reply(`Task added: "${taskText}"`);
  } catch (error) {
    console.error('Error adding task: ', error);
    ctx.reply('An error occurred while adding the task.');
  }
});

// Command to list tasks and mark them as done with inline buttons
bot.command('markdone', async (ctx) => {
  const userId = ctx.from.id;

  try {
    const userTasksCollection = collection(db, 'users', userId.toString(), 'tasks');
    const tasksSnapshot = await getDocs(query(userTasksCollection));

    if (tasksSnapshot.empty) {
      ctx.reply('You have no tasks.');
      return;
    }

    // Filter out tasks that are already marked as done
    const pendingTasks = tasksSnapshot.docs.filter((doc) => !doc.data().done);

    if (pendingTasks.length === 0) {
      ctx.reply('All tasks are already done! ✅');
      return;
    }

    const taskButtons = pendingTasks.map((doc) =>
      Markup.button.callback(doc.data().task, `done_${doc.id}`)
    );

    // Send the list of tasks with buttons
    ctx.reply('Select a task to mark as done:', Markup.inlineKeyboard(taskButtons, { columns: 1 }));
  } catch (error) {
    console.error('Error retrieving tasks: ', error);
    ctx.reply('An error occurred while retrieving your tasks.');
  }
});

// Handle task completion with inline button clicks
bot.action(/done_(.+)/, async (ctx) => {
  const taskId = ctx.match[1];
  const userId = ctx.from.id;

  try {
    const taskDocRef = doc(db, 'users', userId.toString(), 'tasks', taskId);
    const taskDoc = await getDoc(taskDocRef);
    const taskData = taskDoc.data();

    if (!taskData) {
      ctx.reply('Task not found.');
      return;
    }

    await updateDoc(taskDocRef, { done: true });

    ctx.reply(`Task marked as done: "${taskData.task}" ✅`);
  } catch (error) {
    console.error('Error marking task as done: ', error);
    ctx.reply('An error occurred while marking the task as done.');
  }
});

// Command to list tasks and delete them with inline buttons
bot.command('deletetask', async (ctx) => {
  const userId = ctx.from.id;

  try {
    const userTasksCollection = collection(db, 'users', userId.toString(), 'tasks');
    const tasksSnapshot = await getDocs(query(userTasksCollection));

    if (tasksSnapshot.empty) {
      ctx.reply('You have no tasks.');
      return;
    }

    const taskButtons = tasksSnapshot.docs.map((doc) =>
      Markup.button.callback(doc.data().task, `delete_${doc.id}`)
    );

    // Send the list of tasks with buttons
    ctx.reply('Select a task to delete:', Markup.inlineKeyboard(taskButtons, { columns: 1 }));
  } catch (error) {
    console.error('Error retrieving tasks: ', error);
    ctx.reply('An error occurred while retrieving your tasks.');
  }
});

// Handle task deletion with inline button clicks
bot.action(/delete_(.+)/, async (ctx) => {
  const taskId = ctx.match[1];
  const userId = ctx.from.id;

  try {
    const taskDocRef = doc(db, 'users', userId.toString(), 'tasks', taskId);
    const taskDoc = await getDoc(taskDocRef);
    const taskData = taskDoc.data();

    if (!taskData) {
      ctx.reply('Task not found.');
      return;
    }

    await deleteDoc(taskDocRef);

    ctx.reply(`Task deleted: "${taskData.task}" 🗑️`);
  } catch (error) {
    console.error('Error deleting task: ', error);
    ctx.reply('An error occurred while deleting the task.');
  }
});

// Command to list all tasks without IDs
bot.command('listtasks', async (ctx) => {
  const userId = ctx.from.id;

  try {
    const userTasksCollection = collection(db, 'users', userId.toString(), 'tasks');
    const tasksSnapshot = await getDocs(query(userTasksCollection));

    if (tasksSnapshot.empty) {
      ctx.reply('You have no tasks.');
      return;
    }

    const taskList = tasksSnapshot.docs
      .map((doc) => `${doc.data().task} - ${doc.data().done ? '✅ Done' : '❌ Pending'}`)
      .join('\n');

    ctx.reply('Here are your tasks:\n' + taskList);
  } catch (error) {
    console.error('Error retrieving tasks: ', error);
    ctx.reply('An error occurred while retrieving your tasks.');
  }
});

// Handle undefined commands
bot.on('text', (ctx) => {
  const command = ctx.message.text.split(' ')[0];
  const knownCommands = ['/start', '/addtask', '/markdone', '/deletetask', '/listtasks'];

  if (!knownCommands.includes(command)) {
    ctx.reply(
      `Unknown command! Here are the commands you can use:
- /addtask [task description] - Add a new task
- /markdone - Mark a task as done
- /deletetask - Delete a task
- /listtasks - List all your tasks`
    );
  }
});

// Start the bot
bot.launch();

// Graceful shutdown on exit
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
