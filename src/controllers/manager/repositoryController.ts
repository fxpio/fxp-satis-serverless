/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Joi from 'joi';
import {RepositoryManager} from '../../composer/repositories/RepositoryManager';
import {Logger} from '../../loggers/Logger';
import {validateForm} from '../../utils/validation';
import {Request, Response} from 'express';

/**
 * Enable the repository.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function enableRepository(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        url: Joi.string().required(),
    });

    let repoManager = req.app.get('repository-manager') as RepositoryManager;
    let url = req.body.url;
    let type = req.body.type;
    let repo = await repoManager.register(url, type, res);
    (req.app.get('logger') as Logger).log('info', `[API Rest] Registration of the repository "${url}"`);

    res.json({
        message: `The "${repo.getType()}" repository with the URL "${repo.getUrl()}" were enabled successfully`,
        url: repo.getUrl(),
        type: repo.getType()
    });
}

/**
 * Disable the repository.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function disableRepository(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        url: Joi.string().required(),
    });

    let repoManager = req.app.get('repository-manager') as RepositoryManager;
    let url = await repoManager.unregister(req.body.url, res);
    (req.app.get('logger') as Logger).log('info', `[API Rest] Unregistration of the repository "${url}"`);

    res.json({
        message: `The repository with the URL "${url}" were disabled successfully`,
        url: url
    });
}
