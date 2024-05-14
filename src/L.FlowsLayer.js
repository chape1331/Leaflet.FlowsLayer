/**
 * class L.FlowLayer()
 * 
 * (extends L.GeoJSON)
 * 
 * <DESCRIPTION>
 * 
 */

L.FlowsLayer = L.GeoJSON.extend({
    options: {
        data: null,
        attributes: {},
        style: {},
    },

    // variables for plugin scope
    _defaultAttributes: {
        id: "id",
        value: "value"
    },
    _defaultStyle: {
        color: "#1f78b4",
        // colorNull: "lightGray" -> if provided null values are shown.
        colorSelected: "#e31a1c",
        weight: 2,
        sizeFactor: 1,
        opacity: 1.0,        
    },
    _selectedIds: [],

    // functions
    onAdd: function(map) {
        L.GeoJSON.prototype.onAdd.call(this, map);
        this.setStyle();
    },

    setStyle: function () {
        this._validateAttributes();
        this._validateStyles();
        let layers = this._layers;
        let attributes = this.options.attributes;
        let style = this.options.style;
        for (let key in layers){
            let layer = layers[key];
            let id = layer.feature.properties[attributes.id]; 
            
            let value = null;
            if (this.options.data == null) value = layer.feature.properties[attributes.value];            
            else value = this.options.data[id][attributes.value];

            let weight = value * style.sizeFactor;
            let styleCopy = Object.assign({}, style);
            styleCopy.weight = weight;
            var index = this._selectedIds.indexOf(id);
            if (index != -1) {
                layer.bringToFront();
                index = index % style.colorSelected.length;
                styleCopy.color = style.colorSelected[index];
            }

            layer.setStyle(styleCopy);
        }
    },

    _validateAttributes: function() {
        let attributes = this.options.attributes;
        if (attributes == null | attributes == undefined) attributes = Object.assign({}, this._defaultAttributes);
        else {
            for (key in this._defaultAttributes){
                if (!(key in attributes)) attributes[key] = this._defaultAttributes[key];
            }
        }
    },

    _validateStyles: function() {
        let style = this.options.style;
        if (typeof(style.colorSelected) == "string") style.colorSelected = [style.colorSelected]

        if (style == null | style == undefined) style = Object.assign({}, this._defaultStyle);
        else {
            for (key in this._defaultStyle){
                if (!(key in style)) style[key] = this._defaultStyle[key];
            }
        }
    },

    updateData: function(data) {
        this.options.data = data;
        this.setStyle();
    },

    updateStyle: function(style){
        this.options.style = style;
        this.setStyle();
    },

    updateAttributes: function(attributes){
        this.options.attributes = attributes;
        this.setStyle();
    },

    selectFeature: function(id, clear=false) {
        if (clear) this.clearSelection();
        if (this._selectedIds.indexOf(id) == -1) {this._selectedIds.push(id)};

        this.setStyle();
    },

    unselectFeature: function(id) {
        const index = this._selectedIds.indexOf(id);
        if (index == -1) this._selectedIds.splice(index, 1);

        this.setStyle();
    },

    clearSelection: function() {
        delete(this._selectedIds);
        this._selectedIds = [];

        this.setStyle();
    },

    getSelected: function() {
        let selection = {};
        let style = this.options.style;

        for (i in this._selectedIds) {
            let item = this._selectedIds[i];
            let index = this._selectedIds.indexOf(item);
            index = index % style.colorSelected.length;
            selection[item] = style.colorSelected[index]; 
        }

        return selection;
    },
});

L.flowsLayer = function (geojson, options) {
    return new L.FlowsLayer(geojson, options);
}

module.exports = L.flowsLayer;