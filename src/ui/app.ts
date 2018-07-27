/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import './styles/app.styl';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'babel-polyfill';
import './class-component-hooks';
import App from './components/App';
import Vue from 'vue';
import Meta from 'vue-meta';
import VeeValidate, {Validator} from 'vee-validate';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import VuexI18n from 'vuex-i18n';
import AppContext from './utils/AppContext';
import translationEn from './translations/en';
import translationFr from './translations/fr';
import veeValidateFr from 'vee-validate/dist/locale/fr';
import './components/Loading';
import {apiAddAuthInterceptor, apiAddAuthRedirectInterceptor, apiAddLocaleInterceptor, createApiClient} from './api';
import {routerAddLocaleGuard, createRouter, routerAddAuthGuard} from './router';
import {createStore} from './store';

/**
 *  Create the app.
 *
 * @param {object} context
 * @return {Vue}
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createApp(context: AppContext): Vue {
    let apiClient = createApiClient(context.apiBaseUrl);
    let router = createRouter();
    let store = createStore(router, apiClient);

    routerAddLocaleGuard(router, store);
    routerAddAuthGuard(router, store);
    apiAddLocaleInterceptor(apiClient, store);
    apiAddAuthInterceptor(apiClient, store);
    apiAddAuthRedirectInterceptor(apiClient, store);
    Validator.localize('fr', veeValidateFr);

    Vue.use(Meta);
    Vue.use(VueAxios, apiClient);
    Vue.use(VeeValidate);
    Vue.use(VuexI18n.plugin, store, {
        onTranslationNotFound: function(locale: string, key: string): void {
            console.warn(`vuex-i18n :: Key '${key}' not found for locale '${locale}'`);
        }
    });
    Vue.use(Vuetify, {
        theme: {
            primary: "#546E7A",
            secondary: "#78909C",
            accent: "#1E88E5",
            error: "#f44336",
            warning: "#F9A825",
            info: "#4FC3F7",
            success: "#4caf50"
        }
    });

    Vue.i18n.fallback('en');
    Vue.i18n.set('en');
    Vue.i18n.add('en', translationEn);
    Vue.i18n.add('fr', translationFr);

    return new Vue({
        router,
        store,
        render: h => h(App)
    });
}
