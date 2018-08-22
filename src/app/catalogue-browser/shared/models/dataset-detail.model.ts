import { Spatial } from './spatial.model';
export class DatasetDetail {

    constructor(
        public id: string,
        public datasetName: string,
        public title: string,
        public notes: string,
        public contact: string,
        public email: string,
        public creationTime: Date,
        public startTime: Date,
        public stopTime: Date,
        public topicCategory: string,
        public groups: string[],
        public tags: string[],
        public spatial: Spatial
    ) { }
}
