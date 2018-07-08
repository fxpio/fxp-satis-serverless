/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {generateToken} from '../../utils/token';

/**
 * Create the github token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function createGithubToken(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');
    let token = req.body.token ? req.body.token : generateToken(40);

    await storage.put('github-token', token);

    res.json({
        message: `The token "${token}" for Github Webhooks was created successfully`,
        token: token
    });
}

/**
 * Delete the github token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function deleteGithubToken(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');

    await storage.delete('github-token' + '/');

    res.json({
        message: `The token for Github Webhooks was deleted successfully`
    });
}

/**
 * Show the github token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showGithubToken(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');

    let token = await storage.get('github-token');
    let message = token ? `The token for Github Webhooks is "${token}"` : `The token for Github Webhooks is not generated`;

    res.json({
        message: message,
        token: token
    });
}
