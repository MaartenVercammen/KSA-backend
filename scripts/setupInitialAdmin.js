/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
require('dotenv').config();
const readline = require('readline');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const options = require('knex-stringcase')({
  client: process.env.DB_DRIVER,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
});
const knex = require('knex')(options);

async function prompt(question, providedPromptOptions) {
  return new Promise((resolve) => {
    const input = process.stdin;
    const output = process.stdout;

    const promptOptions = {
      hidden: false,
      colored: true,
      ...providedPromptOptions,
    };

    let trimmedQuestion = `${question.trim()} `;
    if (promptOptions.colored) {
      trimmedQuestion = `\x1b[36m${trimmedQuestion}\x1b[0m`;
    }

    if (promptOptions.hidden) {
      const onDataHandler = (charBuff) => {
        const char = `${charBuff}`;
        switch (char) {
          case '\n':
          case '\r':
          case '\u0004':
            input.removeListener('data', onDataHandler);
            break;
          default:
            output.clearLine(0);
            readline.cursorTo(output, 0);
            output.write(trimmedQuestion);
            break;
        }
      };
      input.on('data', onDataHandler);
    }

    const rl = readline.createInterface({ input, output });

    rl.question(trimmedQuestion, (answer) => {
      if (promptOptions.hidden) rl.history = rl.history.slice(1);
      rl.close();
      resolve(answer);
    });
  });
}

async function collectInput() {
  console.log('\x1b[35m[INFO]\x1b[0m Please provide following data:');
  const firstName = await prompt('First name:');
  const lastName = await prompt('Last name:');
  const email = await prompt('Email:');
  let password = await prompt('Password:', { hidden: true });
  let confirmPassword = await prompt('Confirm password:', { hidden: true });

  let attempts = 1;
  while (password !== confirmPassword && attempts !== 3) {
    console.warn('\x1b[33mSorry, please try again...\x1b[0m');
    password = await prompt('Password:', { hidden: true, colored: true });
    confirmPassword = await prompt('Confirm password:', { hidden: true, colored: true });
    attempts += 1;
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords don\'t match, sorry!');
  }

  return {
    firstName,
    lastName,
    password,
    email,
  };
}

async function createUser(user) {
  await knex('users').insert({
    ...user,
    id: uuid(),
    password: bcrypt.hashSync(user.password, Number.parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)),
    role: 'ADMIN',
  });
  console.log('\x1b[1m\x1b[32m[SUCCESS] User created!\x1b[0m');
}

async function checkTableContent() {
  console.log('\x1b[35m[INFO]\x1b[0m Checking whether an admin already exists...');
  const result = await knex('users').select('*');
  if (result.length !== 0) {
    throw new Error('Found users in database, can\'t run script!');
  }
  console.log('\x1b[32m[OK]\x1b[0m No users found!');
}

async function main() {
  try {
    console.log('\x1b[36m\x1b[1mThis script will create an initial admin user in the database\x1b[0m');
    await checkTableContent();
    const user = await collectInput();
    await createUser(user);
  } catch (err) {
    console.error(`\x1b[1m\x1b[31m${err}\x1b[0m`);
    process.exit(-1);
  }
}

main().then(() => process.exit(0));
