/*
*  Copyright (C) 1998-2023 by Northwoods Software Corporation. All Rights Reserved.
*/
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../release/go.js", "./ColumnResizingTool.js", "./RowResizingTool.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.init = void 0;
    /*
    * This is an extension and not part of the main GoJS library.
    * Note that the API for this class may change with any version, even point releases.
    * If you intend to use an extension in production, you should copy the code to your own source directory.
    * Extensions can be found in the GoJS kit under the extensions or extensionsJSM folders.
    * See the Extensions intro page (https://gojs.net/latest/intro/extensions.html) for more information.
    */
    var go = require("../release/go.js");
    var ColumnResizingTool_js_1 = require("./ColumnResizingTool.js");
    var RowResizingTool_js_1 = require("./RowResizingTool.js");
    function init() {
        if (window.goSamples)
            window.goSamples(); // init for these samples -- you don't need to call this
        var $ = go.GraphObject.make; // for conciseness in defining templates
        var myDiagram = $(go.Diagram, 'myDiagramDiv', {
            validCycle: go.Diagram.CycleNotDirected,
            'undoManager.isEnabled': true
        });
        myDiagram.toolManager.mouseDownTools.add(new RowResizingTool_js_1.RowResizingTool());
        myDiagram.toolManager.mouseDownTools.add(new ColumnResizingTool_js_1.ColumnResizingTool());
        // This template is a Panel that is used to represent each item in a Panel.itemArray.
        // The Panel is data bound to the item object.
        var fieldTemplate = $(go.Panel, 'TableRow', // this Panel is a row in the containing Table
        new go.Binding('portId', 'name'), // this Panel is a "port"
        {
            background: 'transparent',
            fromSpot: go.Spot.Right,
            toSpot: go.Spot.Left,
            // allow drawing links from or to this port:
            fromLinkable: true, toLinkable: true
        }, $(go.Shape, {
            column: 0,
            width: 12, height: 12, margin: 4,
            // but disallow drawing links from or to this shape:
            fromLinkable: false, toLinkable: false
        }, new go.Binding('figure', 'figure'), new go.Binding('fill', 'color')), $(go.TextBlock, {
            column: 1,
            margin: new go.Margin(0, 2),
            stretch: go.GraphObject.Horizontal,
            font: 'bold 13px sans-serif',
            wrap: go.TextBlock.None,
            overflow: go.TextBlock.OverflowEllipsis,
            // and disallow drawing links from or to this text:
            fromLinkable: false, toLinkable: false
        }, new go.Binding('text', 'name')), $(go.TextBlock, {
            column: 2,
            margin: new go.Margin(0, 2),
            stretch: go.GraphObject.Horizontal,
            font: '13px sans-serif',
            maxLines: 3,
            overflow: go.TextBlock.OverflowEllipsis,
            editable: true
        }, new go.Binding('text', 'info').makeTwoWay()));
        // Return initialization for a RowColumnDefinition, specifying a particular column
        // and adding a Binding of RowColumnDefinition.width to the IDX'th number in the data.widths Array
        function makeWidthBinding(idx) {
            // These two conversion functions are closed over the IDX variable.
            // This source-to-target conversion extracts a number from the Array at the given index.
            function getColumnWidth(arr) {
                if (Array.isArray(arr) && idx < arr.length)
                    return arr[idx];
                return NaN;
            }
            // This target-to-source conversion sets a number in the Array at the given index.
            function setColumnWidth(w, data) {
                var arr = data.widths;
                if (!arr)
                    arr = [];
                if (idx >= arr.length) {
                    for (var i = arr.length; i <= idx; i++)
                        arr[i] = NaN; // default to NaN
                }
                arr[idx] = w;
                return arr; // need to return the Array (as the value of data.widths)
            }
            return [
                { column: idx },
                new go.Binding('width', 'widths', getColumnWidth).makeTwoWay(setColumnWidth)
            ];
        }
        // This template represents a whole "record".
        myDiagram.nodeTemplate =
            $(go.Node, 'Auto', new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            // this rectangular shape surrounds the content of the node
            $(go.Shape, { fill: '#EEEEEE' }),
            // the content consists of a header and a list of items
            $(go.Panel, 'Vertical', { stretch: go.GraphObject.Horizontal, margin: 0.5 },
            // this is the header for the whole node
            $(go.Panel, 'Auto', { stretch: go.GraphObject.Horizontal }, // as wide as the whole node
            $(go.Shape, { fill: '#1570A6', strokeWidth: 0 }), $(go.TextBlock, {
                alignment: go.Spot.Center,
                margin: 3,
                stroke: 'white',
                textAlign: 'center',
                font: 'bold 12pt sans-serif'
            }, new go.Binding('text', 'key'))),
            // this Panel holds a Panel for each item object in the itemArray;
            // each item Panel is defined by the itemTemplate to be a TableRow in this Table
            $(go.Panel, 'Table', {
                name: 'TABLE', stretch: go.GraphObject.Horizontal,
                minSize: new go.Size(100, 10),
                defaultAlignment: go.Spot.Left,
                defaultStretch: go.GraphObject.Horizontal,
                defaultColumnSeparatorStroke: 'gray',
                defaultRowSeparatorStroke: 'gray',
                itemTemplate: fieldTemplate
            }, $(go.RowColumnDefinition, makeWidthBinding(0)), $(go.RowColumnDefinition, makeWidthBinding(1)), $(go.RowColumnDefinition, makeWidthBinding(2)), new go.Binding('itemArray', 'fields')) // end Table Panel of items
            ) // end Vertical Panel
            ); // end Node
        myDiagram.linkTemplate =
            $(go.Link, { relinkableFrom: true, relinkableTo: true, toShortLength: 4 }, // let user reconnect links
            $(go.Shape, { strokeWidth: 1.5 }), $(go.Shape, { toArrow: 'Standard', stroke: null }));
        myDiagram.model =
            new go.GraphLinksModel({
                linkFromPortIdProperty: 'fromPort',
                linkToPortIdProperty: 'toPort',
                nodeDataArray: [
                    {
                        key: 'Record1',
                        widths: [NaN, NaN, 60],
                        fields: [
                            { name: 'field1', info: 'first field', color: '#F7B84B', figure: 'Ellipse' },
                            { name: 'field2', info: 'the second one', color: '#F25022', figure: 'Ellipse' },
                            { name: 'fieldThree', info: '3rd', color: '#00BCF2' }
                        ],
                        loc: '0 0'
                    },
                    {
                        key: 'Record2',
                        widths: [NaN, NaN, NaN],
                        fields: [
                            { name: 'fieldA', info: '', color: '#FFB900', figure: 'Diamond' },
                            { name: 'fieldB', info: '', color: '#F25022', figure: 'Rectangle' },
                            { name: 'fieldC', info: '', color: '#7FBA00', figure: 'Diamond' },
                            { name: 'fieldD', info: 'fourth', color: '#00BCF2', figure: 'Rectangle' }
                        ],
                        loc: '250 0'
                    }
                ],
                linkDataArray: [
                    { from: 'Record1', fromPort: 'field1', to: 'Record2', toPort: 'fieldA' },
                    { from: 'Record1', fromPort: 'field2', to: 'Record2', toPort: 'fieldD' },
                    { from: 'Record1', fromPort: 'fieldThree', to: 'Record2', toPort: 'fieldB' }
                ]
            }).addChangedListener(function (e) {
                if (e.isTransactionFinished)
                    showModel();
            });
        showModel(); // show the diagram's initial model
        function showModel() {
            var elt = document.getElementById('mySavedModel');
            if (elt !== null)
                elt.textContent = myDiagram.model.toJson();
        }
        // Attach to the window for console manipulation
        window.myDiagram = myDiagram;
    }
    exports.init = init;
});
