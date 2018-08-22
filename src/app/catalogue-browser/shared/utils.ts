import { DatasetDetail } from './models/dataset-detail.model';
import { Spatial } from './models/spatial.model';
export default class Utils {

    static parsePackageResults(results: any[]) {
        return results.map(item => { //console.log(item) 
            let id: string = item['id'];
            let datasetName : string = item['name'];
            let title : string = item['title'];
            let notes : string = item['notes'];
            
            let contact: string; // extras - {key: "Contact", value: "Instituto Hidrográfico (IH)"}
            let email: string;   // extras - {key: "Contact Email", value: "mail@hidrografico.pt"}
            let creationTime: Date; // extras - {key: "CreationTime", value: "2018-02-23T00:00:00.000000Z"}
            let startTime: Date;
            let stopTime: Date;
            let topicCategory : string; // extras - {key: "Topic Category", value: "oceans"}
            let spatialData : Spatial;
            item['extras'].map(extra => {
                  if(extra.key==="Contact") {
                    contact = extra.value;
                  } 
                  if(extra.key==="Contact Email") {
                    email = extra.value;
                  }
                  if(extra.key==="CreationTime") {
                    creationTime = extra.value;
                  }
                  if(extra.key==="StartTime") {
                    startTime = extra.value;
                  }
                  if(extra.key==="StopTime") {
                    stopTime = extra.value;
                  }
                  if(extra.key==="Topic Category") {
                    topicCategory = extra.value;
                  }
                  if(extra.key==="spatial") {
                    spatialData = this.getSpatialObject(JSON.parse(extra.value));
                  }
            });
            
            let groups : string[];  // groups - title or display_name
            groups = item['groups'].map(g => {return g.display_name});
            let tags : string[] // tags - name
            tags = item['tags'].map(t => {return t.display_name});
            
            return new DatasetDetail(id, datasetName, title, notes, contact, email, creationTime, startTime, stopTime, topicCategory, groups, tags, spatialData);
        });
    }
    
    private static getSpatialObject(spatial : any) : Spatial {
    return new Spatial(spatial['type'], spatial['coordinates']);
    }
}
