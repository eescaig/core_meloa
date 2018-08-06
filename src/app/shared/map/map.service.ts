import { Subject } from 'rxjs/index';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  
  private map: any;

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
createMap(mapContainer: string) {
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
            maxBoundsViscosity: 1.0,
        }).setView([36, -9], 2);
    }
}

addBasemap() {
    esri.basemapLayer('Oceans', {
        maxZoom: 10
    }).addTo(this.map);
    esri.basemapLayer('Imagery', {
        minZoom: 11,
    }).addTo(this.map);
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
private _addWMSLayerToMapLayers(wmsServer: string, wmsOptions: any) {
    const layer = L.tileLayer.wms(wmsServer, wmsOptions).addTo(this.map);
    layer.bringToFront();

    /* if (!this.hasGroup(wmsOptions.layers)) {
        this.addLayerGroup(wmsOptions.layers, 'feature');
    }; */

    const requestedGroup = this.layerGroups.get(wmsOptions.layers);
    requestedGroup.addLayer(layer);

    return layer;
}


/**
 * Adds a WMS layer, requested to the specified WMS server.
 */
addWMSLayerToMapLayers(wmsServer: string, layer: String) {
    return this._addWMSLayerToMapLayers(wmsServer, {
        layers: layer,
        format: 'image/png',
        transparent: true
    });
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
