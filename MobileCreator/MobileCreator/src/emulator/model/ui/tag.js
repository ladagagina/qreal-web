define(["require", "exports"], function(require, exports) {
    var ControlTag = (function () {
        function ControlTag() {
        }
        Object.defineProperty(ControlTag.prototype, "Id", {
            get: function () {
                return this.id;
            },
            set: function (value) {
                this.id = value;
            },
            enumerable: true,
            configurable: true
        });
        return ControlTag;
    })();
    exports.ControlTag = ControlTag;    
})
