/*
*  Copyright (C) 1998-2023 by Northwoods Software Corporation. All Rights Reserved.
*/
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../release/go.js", "./ResizeMultipleTool.js"], factory);
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
    var ResizeMultipleTool_js_1 = require("./ResizeMultipleTool.js");
    function init() {
        if (window.goSamples)
            window.goSamples(); // init for these samples -- you don't need to call this
        var $ = go.GraphObject.make; // for conciseness in defining templates
        var myDiagram = $(go.Diagram, 'myDiagramDiv', // create a Diagram for the DIV HTML element
        {
            resizingTool: new ResizeMultipleTool_js_1.ResizeMultipleTool(),
            'undoManager.isEnabled': true // enable undo & redo
        });
        // define a simple Node template
        myDiagram.nodeTemplate =
            $(go.Node, 'Auto', // the Shape will go around the TextBlock
            { resizable: true }, new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
            // save the modified size in the model node data
            new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify), $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 },
            // Shape.fill is bound to Node.data.color
            new go.Binding('fill', 'color')), $(go.TextBlock, { margin: 8 }, // some room around the text
            // TextBlock.text is bound to Node.data.key
            new go.Binding('text', 'key')));
        // but use the default Link template, by not setting Diagram.linkTemplate
        // create the model data that will be represented by Nodes and Links
        myDiagram.model = new go.GraphLinksModel([
            { key: 'Alpha', color: 'lightblue' },
            { key: 'Beta', color: 'orange' },
            { key: 'Gamma', color: 'lightgreen' },
            { key: 'Delta', color: 'pink' }
        ], [
            { from: 'Alpha', to: 'Beta' },
            { from: 'Alpha', to: 'Gamma' },
            { from: 'Beta', to: 'Beta' },
            { from: 'Gamma', to: 'Delta' },
            { from: 'Delta', to: 'Alpha' }
        ]);
    }
    exports.init = init;
});
