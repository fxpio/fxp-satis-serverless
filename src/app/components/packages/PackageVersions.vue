<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <search-list
            :headers="headers"
            :fetch-request="fetchDataRequest"
            :wall-empty-message="false"
            :disable-first-loading="true"
    >
        <template v-slot:header="{total}">
            <v-subheader :class="$classes('mt-4 mb-4 primary--text', 'text--lighten-3')">
                <lottie width="48px" :options="{animationData: iconData}"></lottie>
                {{ $t('views.packages.title') }}
                <v-fade-transition mode="out-in">
                    <v-chip small outlined class="ml-2" v-if="null !== total">
                        {{ total }}
                    </v-chip>
                </v-fade-transition>
            </v-subheader>
        </template>

        <template v-slot:data-table.item.version="{item}">
            <v-chip :color="item.version.startsWith('dev-') ? 'secondary' : 'success'"
                    small
            >
                {{ item.version }}
                <span v-if="item && item.composer && item.composer.extra && item.composer.extra['branch-alias'] && item.composer.extra['branch-alias'][item.version]">
                    <span class="ml-1 mr-1">/</span>
                    <span>{{ item.composer.extra['branch-alias'][item.version] }}</span>
                </span>
            </v-chip>
        </template>

        <template v-slot:data-table.item.reference="{item}">
            <v-tooltip top>
                <template v-slot:activator="{on}">
                    <v-chip small v-on="on">
                        {{ getReference(item, true) }}
                    </v-chip>
                </template>
                <span>{{ getReference(item) }}</span>
            </v-tooltip>
        </template>

        <template v-slot:data-table.item.time="{item}">
            {{ $fdt(item.composer.time) }}
        </template>

        <template v-slot:data-table.item.actions="{item}">
            <div class="v-data-table-actions">
                <package-viewer
                        v-model="item.composer"
                        depressed
                        rounded
                        ripple
                        small
                >
                </package-viewer>

                <refresh-package-action
                        :url="repository.url"
                        :version="item.version"
                        color="accent"
                        depressed
                        rounded
                        ripple
                        small
                >
                </refresh-package-action>

                <delete-action
                        :title="$t('views.packages.version') + ' ' + item.version"
                        :data="item.composer"
                        outlined
                        rounded
                        ripple
                        small
                        :delete-call="deleteVersion"
                        @deleted="onVersionDeleted"
                >
                </delete-action>
            </div>
        </template>
    </search-list>
</template>

<script lang="ts">
    import {Component, Model, Vue} from 'vue-property-decorator';
    import {Canceler} from '@app/api/Canceler';
    import {Packages} from '@app/api/services/Packages';
    import {CodeRepository} from '@app/api/models/responses/CodeRepository';
    import {Package} from '@app/api/models/responses/Package';
    import RefreshPackageAction from '@app/components/packages/RefreshPackageAction.vue';
    import DeleteAction from '@app/components/DeleteAction.vue';
    import {PackageDeleteRequest} from '@app/api/models/requests/PackageDeleteRequest';
    import {PackageDeleteResponse} from '@app/api/models/responses/PackageDeleteResponse';
    import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';
    import PackageViewer from '@app/components/packages/PackageViewer.vue';
    import SearchList from '@app/components/SearchList.vue';
    import {FetchRequestDataEvent} from '@app/events/requests/FetchRequestDataEvent';
    import {ListResponse} from '@app/api/models/responses/ListResponse';
    import {PackageVersion} from '@app/api/models/responses/PackageVersion';
    import iconData from '@app/assets/animations/packageIcon.json';
    import Lottie from '@app/components/Lottie.vue';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {Lottie, SearchList, PackageViewer, DeleteAction, RefreshPackageAction},
    })
    export default class PackageVersions extends Vue {
        @Model()
        public repository: CodeRepository;

        public get headers(): object[] {
            return [
                {   text: this.$i18n.t('views.packages.version'),
                    value: 'version',
                },
                {   text: this.$i18n.t('views.packages.reference'),
                    value: 'reference',
                },
                {   text: this.$i18n.t('views.packages.time'),
                    value: 'time',
                },
                {   value: 'actions',
                },
            ];
        }

        public get iconData(): object {
            return  iconData;
        }

        public getReference(item: PackageVersion, short: boolean = false): string {
            let ref = item.version;

            if (item.composer && item.composer.dist) {
                ref = item.composer.dist.reference;
            } else if (item.composer && item.composer.source) {
                ref = item.composer.source.reference;
            }

            if (short && ref && ref !== item.version) {
                ref = ref.substring(0, 8);
            }

            return ref;
        }

        public async fetchDataRequest(event: FetchRequestDataEvent): Promise<ListResponse<PackageVersion>> {
            if (!this.repository.packageName) {
                return Promise.resolve({
                    results: [],
                    lastId: null,
                    count: 0,
                    total: 0,
                } as ListResponse<PackageVersion>);
            }

            return await this.$api.get<Packages>(Packages)
                .list(this.repository.packageName as string,
                    {lastId: event.lastId, search: event.search}, event.canceler) as ListResponse<PackageVersion>;
        }

        public async deleteVersion(composerPackage: Package, canceler: Canceler): Promise<PackageDeleteResponse> {
            const data = {
                url: this.repository ? this.repository.url : undefined,
                version: composerPackage.version,
            } as PackageDeleteRequest;

            return this.$api.get<Packages>(Packages).delete(data, canceler);
        }

        public async onVersionDeleted(res: PackageDeleteResponse) {
            this.$snackbar.snack(new SnackbarMessage(res.message, 'success'));
        }
    }
</script>
