module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'release-village-dev',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  entities: ['./**/*.entity.{ts,js}']
}
