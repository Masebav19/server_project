const fs = require('fs');
const { performance } = require('perf_hooks');
const os = require('os');
const DiskUsage = require('pidusage');
const logger = require("../utils/logger");

function measureAndLogCSV(func, functionName) {
    return async function(...args) {
        const startUsageMemory = process.memoryUsage().rss;
        const startUsageNetwork = os.networkInterfaces();
        const startTimestamp = performance.now();
        const csvFilePath = 'test.csv'

        const result = await func.apply(this, args);

        const endTimestamp = performance.now();

        await DiskUsage(process.pid, (err, stats) => {
            if (err) {
                logger.error(`Error al obtener el uso de CPU: ${err}`);
                return;
            }
            logger.info(`Function ${functionName} CPU usage: ${stats.cpu.toFixed(4)}%`);
                    // Log to CSV
            const csvData = `${functionName},${stats.cpu.toFixed(4)},${memoryUsageStart},${memoryUsageEnd},${memoryUsageDiff.toFixed(4)},${elapsedTime}\n`;
            fs.appendFile(csvFilePath, csvData, (err) => {
                if (err) {
                    logger.error(`Error al escribir en el archivo CSV: ${err}`);
                } else {
                    logger.info(`Datos registrados en el archivo CSV: ${csvFilePath}`);
                }
            });
        });

        const endUsageMemory = process.memoryUsage().rss;
        const endUsageNetwork = os.networkInterfaces();

        const memoryUsageStart = startUsageMemory / (1024 * 1024); // Convertir bytes a MB
        const memoryUsageEnd = endUsageMemory / (1024 * 1024); // Convertir bytes a MB
        const memoryUsageDiff = memoryUsageEnd - memoryUsageStart;
        const elapsedTime = endTimestamp - startTimestamp;

        logger.info(`Function ${functionName} Memory usage at start: ${memoryUsageStart} MB`);
        logger.info(`Function ${functionName} Memory usage at end: ${memoryUsageEnd} MB`);
        logger.info(`Function ${functionName} Memory usage difference: ${memoryUsageDiff.toFixed(2)} MB`);
        logger.info(`Function ${functionName} Elapsed time: ${elapsedTime} milliseconds`);
        logger.info(`Function ${functionName} Network usage: ${JSON.stringify(calculateNetworkUsage(startUsageNetwork, endUsageNetwork))}`);

        return result;
    };
}

function calculateNetworkUsage(startUsageNetwork, endUsageNetwork) {
    const usage = {};

    for (const interfaceName in endUsageNetwork) {
        if (startUsageNetwork.hasOwnProperty(interfaceName)) {
            const startInterface = startUsageNetwork[interfaceName];
            const endInterface = endUsageNetwork[interfaceName];
            const usageDetails = {};

            for (let i = 0; i < startInterface.length; i++) {
                const startAddress = startInterface[i];
                const endAddress = endInterface[i];

                if (startAddress && endAddress) {
                    usageDetails[startAddress.address] = {
                        received: endAddress.bytesReceived - startAddress.bytesReceived,
                        transmitted: endAddress.bytesTransmitted - startAddress.bytesTransmitted
                    };
                }
            }

            usage[interfaceName] = usageDetails;
        }
    }

    return usage;
}

module.exports = measureAndLogCSV;
