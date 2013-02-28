var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "emulator/model/ui/Control"], function(require, exports, __mControl__) {
    var mControl = __mControl__;

    
    var TextView = (function (_super) {
        __extends(TextView, _super);
        function TextView(tag, $control) {
            if (typeof $control === "undefined") { $control = $("<label></label>"); }
                _super.call(this, tag, $control);
            this.$Control.text(tag.Text);
        }
        TextView.prototype.create = function () {
        };
        return TextView;
    })(mControl.Control);
    exports.TextView = TextView;    
})
