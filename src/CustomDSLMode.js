import 'brace/mode/java';

export class CustomHighlightRules extends window.ace.acequire("ace/mode/text_highlight_rules").TextHighlightRules {
    constructor() {
        super();
        this.$rules = {
            "start": [{
                token: "comment",
                regex: "//.*$"
            }, {
                token: "string",
                regex: '".*?"'
            }, {
                token: "constant.numeric",
                regex: /(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/
            }, {
                token: "function.support",
                regex: "circle|rectangle|ellipse|line |path"
            }, {
                token: "constant.language.escape",
                regex: "draw|to|from|at|move"
            }
            ],

        };
    }
}

export default class CustomDSLMode extends window.ace.acequire('ace/mode/java').Mode {
    constructor() {
        super();
        this.HighlightRules = CustomHighlightRules;
    }
}