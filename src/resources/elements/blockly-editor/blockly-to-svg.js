

export class BlocklyToSvg {

    constructor() {

        this.DOMURL = self.URL || self.webkitURL || self;

    }

    svg(){
        this.canvas = Blockly.mainWorkspace.svgBlockCanvas_.cloneNode(true);
        if (this.canvaschildren[0] === undefined) throw "Couldn't find Blockly this.canvas"
    
        this.canvasremoveAttribute("transform");
    
        var css = '<defs><style type="text/css" xmlns="http://www.w3.org/1999/xhtml"><![CDATA[' + Blockly.Css.CONTENT.join('') + ']]></style></defs>';
        var bbox = document.getElementsByClassName("blocklyBlockCanvas")[0].getBBox();
        var content = new XMLSerializer().serializeToString(canvas);
    
        xml = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'
            + bbox.width + '" height="' + bbox.height + '" viewBox=" ' + bbox.x + ' ' + bbox.y + ' ' + bbox.width + ' ' + bbox.height + '">' +
            css + '">' + content + '</svg>';    
    
        return new Blob([xml], { type: 'image/svg+xml;base64' });
    }

    download(url, filename){
        let element = document.createElement('a')
        element.href = url
        element.download = filename;
        element.click();
        var DOMURL = self.URL || self.webkitURL || self;
        DOMURL.revokeObjectURL(element.href)
    }

    exportSVG() {
        var DOMURL = self.URL || self.webkitURL || self;
        this.download(DOMURL.createObjectURL(svg()),'blocks.svg');
    }

    exportPNG(){
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            this.canvaswidth = 800;
            this.canvasheight = 600;
            this.canvasgetContext("2d").drawImage(img, 0, 0);
            download(this.canvastoDataURL("image/png"),'blocks.png');
        };
        img.src = DOMURL.createObjectURL(svg());
    }

}