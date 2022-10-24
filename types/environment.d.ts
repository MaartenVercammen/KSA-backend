declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
      SERVER_PORT: number
      BCRYPT_SALT_ROUNDS: number,
      MY_SECRET: string
      PUBLIC_PATH: string
      ORIGIN: string
      LOG_LEVEL: string
      LOG_DIR: string
      HOME: string
      COMBINED_LOG_FILE: string
      ERROR_LOG_FILE: string
      DB_DRIVER: string
      DB_HOST: string
      DB_PORT: number
      DB_USER: string
      DB_PASSWORD: string
      DB_NAME: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
