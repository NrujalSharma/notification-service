import * as mysql from 'mysql2/promise';

let connectionPool: mysql.Pool;

export async function getConnectionPool() {
    if (!connectionPool) {
        connectionPool = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'notification_service',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return connectionPool;
}
