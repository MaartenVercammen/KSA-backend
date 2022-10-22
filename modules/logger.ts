const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

let logDir = process.env.LOG_DIR || 'logs';
if (logDir.charAt(0) === '~') {
  logDir = path.join(process.env.HOME, logDir.slice(1));
}

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const prettyPrint = ({
  label, level, message, timestamp,
}) => `${timestamp} [${label}] ${level}: ${message}`;

const errorLog = path.join(logDir, process.env.ERROR_LOG_FILE || 'error.log');
const level = process.env.LOG_LEVEL || 'error';

module.exports = (className = 'global') => {
  const logger = createLogger({
    format: format.combine(
      format.label({ label: className }),
      format.splat(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    ),
    transports: [
      new transports.File({
        filename: errorLog,
        level: 'error',
        format: format.combine(
          format.printf(prettyPrint),
          format.splat(),
        ),
      }),
    ],
  });

  // When not in production, log to console as well
  if ((process.env.NODE_ENV || 'production') === 'development') {
    logger.add(new transports.Console({
      level,
      format: format.combine(
        format.colorize(),
        format.printf(prettyPrint),
      ),
    }));
  }

  if (level !== 'error') {
    const combinedLog = path.join(logDir, process.env.COMBINED_LOG_FILE || 'combined.log');
    logger.add(new transports.File({
      filename: combinedLog,
      level,
      format: format.combine(
        format.printf(prettyPrint),
      ),
    }));
  }

  return logger;
};
