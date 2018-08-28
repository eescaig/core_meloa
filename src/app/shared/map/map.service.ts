import { Subject } from 'rxjs/index';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import 'leaflet-editable';

export class MapService {
  
  public map: any;

  private boundingBoxChangedSource = new Subject<any>();
  public boundingBoxChanged$ = this.boundingBoxChangedSource.asObservable();

  private layerGroups = new Map<string, any>();
  private mapLayers = new Map<string, any>();
  private drawingChangedSource = new Subject<[boolean, string]>();
  drawingChanged$ = this.drawingChangedSource.asObservable();
  
  constructor() { }
  
  /**
   * Creates the map object in the specified map container ID.
   * It also creates basic drawing events and marker groups.
   */
createMap(mapContainer: string) : any {
    const maxBounds = L.latLngBounds(
        L.latLng(-90, -180), // Southwest
        L.latLng(90, 180)  // Northeast
    );

    if (typeof (this.map) === 'undefined') {
        this.map = L.map(mapContainer, {
            editable: true,
            minZoom: 2,
            zoomControl: false,
            maxBounds: maxBounds,
            maxBoundsViscosity: 1.0
        }).setView([36, -9], 2);

        L.control.zoom({
            position:'topright'
        }).addTo(this.map);
        console.log("Creando Map Component!!!! ");
        console.log(this.map);

        /* var tooltip = L.tooltip({
                        direction: 'left'
                      });
        tooltip.setLatLng(new L.LatLng(48.8583736, 2.2922926));
        tooltip.addTo(this.map); */
    }

    return this.map;
}

getMap() {
    let exportMap : any;
    if (typeof (this.map) !== 'undefined') {
        exportMap = this.map;
    }
    else {
        exportMap = this.createMap('map');
    }
    return exportMap;
}

addBasemap(basemap : string) {
    if(basemap=='oceans') {
        esri.basemapLayer('Oceans', {
            maxZoom: 10
        }).addTo(this.map);
    }
    else {
        esri.basemapLayer('Imagery', {
            maxZoom: 10,
        }).addTo(this.map);
    }
}

/**
 * Adds a new group layer to the map
 * Accepts one group type: GeoJSON
 */
addLayerGroup(id: string, groupType: string) {
    if (groupType === 'geoJSON') {
        if (!this.hasGroup(id)) {
            const geoJSONGroup = L.geoJSON().addTo(this.map);
            this.layerGroups.set(id, geoJSONGroup);
        }
    } else if (groupType === 'feature') {
        if (!this.hasGroup(id)) {
            const featureGroup = L.featureGroup().addTo(this.map);
            this.layerGroups.set(id, featureGroup);
        }
    }
}

/**
 * Checks if the map service already has a group with given ID
 */
private hasGroup(groupId: string) {
    if (this.layerGroups.get(groupId) !== undefined) {
        return true;
    }
    return false;
}

/**
 * Adds data to a GeoJSON feature
 */
private addDataToGeoJSON(layer: any, groupId: string) {
    if (!this.hasGroup(groupId)) {
        this.addLayerGroup(groupId, 'geoJSON');
    }
    const requestedGroup = this.layerGroups.get(groupId);

    const newLayer = requestedGroup.addData(layer);

    return newLayer;
}

/**
 * Adds a geometry object to a GeoJSON group with a given ID
 */
addGeometryToGeoJSONGroup(geometryId: string, geometryObject: any,
    groupId: string, onClick?: () => void) {
    this.addDataToGeoJSON({
        type: 'Feature',
        properties: {
            layerId: geometryId
        },
        geometry: geometryObject
    }, groupId).on('click', onClick);
}

/**
 * Adds a generic layer to the map, with no layer group
 */
addLayerToMapLayers(layerId: string, layerObject: any) {
    this.mapLayers.set(layerId, layerObject);
}

/**
 * Adds a WMS layer, requested to the specified WMS server.
 */
private _addWMSLayerToMapLayers(wmsServer: string, wmsOptions: any, aMap: any) {
    console.log(this.map + " url: " + wmsServer + " options " + JSON.stringify(wmsOptions) + " Mi mapa "+ aMap);
    if (typeof (this.map) === 'undefined') {
        this.map = aMap;
    }
    const layer = L.tileLayer.wms(wmsServer, wmsOptions).addTo(this.map);
    console.log(layer);
    layer.bringToFront();

    if (!this.hasGroup(wmsOptions.layers)) {
        this.addLayerGroup(wmsOptions.layers, 'feature');
    };

    const requestedGroup = this.layerGroups.get(wmsOptions.layers);
    requestedGroup.addLayer(layer);

    return layer;
}


/**
 * Adds a WMS layer, requested to the specified WMS server.
 */
addWMSLayerToMapLayers(wmsServer: string, layer: String, aMap: any) {
    return this._addWMSLayerToMapLayers(wmsServer, {
            layers: layer,
            format: 'image/png',
            transparent: true
            },
            aMap);
}

/**
 * Sets the style for a given group
 */
setGroupColor(groupId: string, color: string) {
    if (this.hasGroup(groupId)) {
        this.layerGroups.get(groupId).setStyle({
            color: color
        });
    }
}

/**
 * Removes a specific layer from the map.
 * @param layer The layer to remove
 */
removeLeafletLayerFromMap(layer: any) {
    this.map.removeLayer(layer);
}

/**
 * Removes a layer with a given ID
 * If a groupId is given, the layer is removed from that group
 */
removeLayerFromMap(layerId: string, groupId?: string) {
    if (groupId !== undefined) {
        this.removeLayerFromGroup(layerId, groupId);
    } else if (this.mapLayers.get(layerId) !== undefined) {
        this.map.removeLayer(this.mapLayers.get(layerId));
    }
}

/**
 * Removes a layer from a specific group.
 * This does not remove the layer from the map. For this it is recommended to use the removeLayerFromMap method.
 */
removeLayerFromGroup(layerId: string, groupId: string) {
    this.layerGroups.get(groupId).eachLayer(lyr => {
        if (lyr.feature.properties.layerId === layerId) {
            this.layerGroups.get(groupId).removeLayer(lyr);
        }
    });
}

/**
 * Clears all layers from a given group
 */
clearGroup(groupId: string) {
    if (this.hasGroup(groupId)) {
        this.layerGroups.get(groupId).clearLayers();
    }
}

/**
 * Adds a rectangle polygon to the map with given coordinates.
 */
addPolygonLayer(layerId: string, coordinates: any, isEditable?: boolean, color?: string) {
    this.removeLayerFromMap(layerId);
    const polygonLayer = L.polygon(coordinates, {
        color: color || 'red'
    }).addTo(this.map);
    this.mapLayers.set(layerId, polygonLayer);
    if (isEditable === undefined || isEditable === true) {
        polygonLayer.enableEdit();
    }
}

/**
 * Adds a rectangle polygon to the map with given coordinates.
 */
addRectangleLayer(layerId: string, coordinates: any, isEditable?: boolean, color?: string) {
    this.removeLayerFromMap(layerId);
    const rectangleLayer = L.rectangle(coordinates, {
        color: color || 'red'
    }).addTo(this.map);
    this.mapLayers.set(layerId, rectangleLayer);
    if (isEditable === undefined || isEditable === true) {
        rectangleLayer.enableEdit();
    }
}

addPointLayer(layerId: string, coordinates: number[], color: string) {
    /* const point = L.point(coordinates)
    this.map.panBy(point);
    this.mapLayers.set(layerId, point); */
    console.log("Desde addPointLayer " + this.map);
    var point = L.circleMarker(coordinates, {
                                    radius : 4,
                                    fillColor : color,
                                    color : "#000",
                                    weight : 1,
                                    opacity : 1,
                                    fillOpacity : 0.8
                                }).addTo(this.map);
    
    var popup = L.popup().setContent('<p>Coordinates: ' + coordinates + '<br />Velocity.</p>');
    point.bindPopup(popup);
    point.on('click', function(e) {
        
    });

    this.mapLayers.set(layerId, point);
}

addPolylineLayer(layerId: string, coordinates: number[][], colorLine: string) {
    var polyline = L.polyline(coordinates, {color : colorLine,
                                            weight: 3,
                                            opacity: 0.5,
                                            smoothFactor: 1}).addTo(this.map);
    this.mapLayers.set(layerId, polyline);
}

addPopUp() {

}

/**
 * Zooms to the bounds of a group given by its ID
 */
zoomToGroupBounds(groupId: string) {
    this.zoomToBounds(this.layerGroups.get(groupId).getBounds());
}

/**
 * Zooms to the given bounds
 */
zoomToBounds(bounds: any) {
    this.map.fitBounds(bounds);
}

/**
 * Allows user to draw a rectangular box on the map.
 * It is also possible to define the color of the box dynamically. If not specified,
 * the default color of #4caf50 shall be given
 */
drawBox(boxColor?: string) {
    if (boxColor === undefined) {
        boxColor = '#4caf50';
    }
    this.map.editTools.startRectangle(undefined, {
        color: boxColor
    });
}

/**
 * Allows user to draw a polygon on the map.
 * It is also possible to define the color of the box dynamically. If not specified,
 * the default color of #4caf50 shall be given
 */
drawPolygon(polygonColor?: string) {
    this.updateTooltip(true);
    if (polygonColor === undefined) {
        polygonColor = '#4caf50';
    }
    this.map.editTools.startPolygon(undefined, {
        color: polygonColor
    });
}

/**
 * Updates the Polygon Tooltip status
 */
updateTooltip(newValue: boolean, tooltipText?: string) {
    this.drawingChangedSource.next([newValue, tooltipText]);
}

/**
 * Add an event for when a drawing is made
 */
addDrawEvent(eventIdentifier: string, callbackFunction: any) {
    this.map.off(eventIdentifier, undefined);
    this.map.on(eventIdentifier, callbackFunction);
}

/**
 * Resets the drawing
 */
commitDrawing() {
    this.map.editTools.commitDrawing();
}

/**
 * Removes all layers from the map
 */
clearMap() {
    this.layerGroups.clear(); // Clear all available layer groups

    this.mapLayers.forEach((k, val) => {
        this.map.removeLayer(val);
    });
}


}
