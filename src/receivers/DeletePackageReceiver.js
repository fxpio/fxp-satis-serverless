/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Logger from 'winston/lib/winston/logger';
import QueueReceiver from '../queues/QueueReceiver';
import PackageManager from '../composer/packages/PackageManager';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class DeletePackageReceiver extends QueueReceiver
{
    /**
     * Constructor.
     *
     * @param {PackageManager} packageManager The package manager
     * @param {MessageQueue}   queue          The message queue
     * @param {Logger}         logger         The logger
     */
    constructor(packageManager, queue, logger) {
        super();
        this.packageManager = packageManager;
        this.queue = queue;
        this.logger = logger;
    }

    /**
     * @inheritDoc
     */
    supports(message) {
        return message && 'delete-package' === message.type;
    }

    /**
     * @inheritDoc
     */
    async execute(message) {
        let pack = await this.packageManager.findPackage(message.packageName, message.version);

        if (pack) {
            this.logger.log('info', `[Delete Package Receiver] Deleting of package version "${version}" has started for "${message.packageName}"`);
            await this.packageManager.delete(pack);
            await this.queue.send({
                type: 'build-package-versions-cache',
                packageName: message.packageName
            }, 1);
        }
    }
}