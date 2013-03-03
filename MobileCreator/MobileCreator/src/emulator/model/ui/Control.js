define(["require", "exports", "emulator/model/attributes/ControlTag"], function(require, exports, __mControlTag__) {
    var mControlTag = __mControlTag__;

    var Control = (function () {
        function Control(tag, $control) {
            this.$Control = $control;
            this.Tag = tag;
            this.$Control.attr('id', tag.Id);
        }
        Object.defineProperty(Control.prototype, "$Control", {
            get: function () {
                return this.$control;
            },
            set: function (value) {
                this.$control = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "Tag", {
            get: function () {
                return this.tag;
            },
            set: function (value) {
                this.tag = value;
            },
            enumerable: true,
            configurable: true
        });
        Control.prototype.create = function () {
            this.setDimensions();
        };
        Control.prototype.setDimensions = function () {
            switch(this.Tag.Width) {
                case mControlTag.ControlTag.WrapContent:
                    break;
                case mControlTag.ControlTag.MatchParrent:
                    this.$Control.css("width", "inherit");
                    break;
                default:
                    this.$Control.css("width", this.Tag.Width + "px");
                    break;
            }
            switch(this.Tag.Height) {
                case mControlTag.ControlTag.WrapContent:
                    break;
                case mControlTag.ControlTag.MatchParrent:
                    this.$Control.css("height", "inherit");
                    break;
                default:
                    this.$Control.css("height", this.Tag.Height + "px");
                    break;
            }
        };
        return Control;
    })();
    exports.Control = Control;    
})
