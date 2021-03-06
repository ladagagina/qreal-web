/// <reference path="../../../lib/jquery.d.ts" />
/// <reference path="../../../lib/jquerymobile.d.ts" />
import mElement = module("designer/widgets/Element");
import mElementPreferences = module("designer/preferences/ElementPreferences")
import mEditTextPreferences = module("designer/preferences/EditTextPreferences")
import mDesigner = module("designer/Designer")

export class EditText extends mElement.Element {
    private preferences: mEditTextPreferences.EditTextPreferences;
    get Preferences() {
        return this.preferences;
    }
    set Preferences(preferences: mEditTextPreferences.EditTextPreferences) {
        this.preferences = preferences;
    }
    constructor(preferences: mEditTextPreferences.EditTextPreferences);
    constructor(preferences: mEditTextPreferences.EditTextPreferences, domElement: JQuery);
    constructor(preferences: mEditTextPreferences.EditTextPreferences, domElement?: JQuery = $("<div></div>")) {
        super(domElement);
        this.Preferences = preferences;
        this.init();
    }
    public init() {
        this.DomElement.empty();
        var text = $("<input type = 'text' name = '" + this.Preferences.EditTextId + "' id = '" + this.Preferences.EditTextId  + "' value = '" + this.Preferences.Text + "' >");
        text.text(this.preferences.Text);
        this.DomElement.css("font-size", this.preferences.TextSize + "px");
        this.DomElement.css("margin-top", this.preferences.LayoutMarginTop + "px");
        this.DomElement.css("padding", this.preferences.Padding + "px");
        this.DomElement.css("text-align", "center");
        this.DomElement.append(text);
        this.applyHeight();
        this.applyWidth();
        //this.DomElement.css("width", "auto");
        var _this = this;
        text.change(function () {
            _this.Preferences.Text = text.val();
            mDesigner.Designer.instance.saveModel();
        });
        this.DomElement.click(function () {
            _this.fillPropertiesEditor($("#propertiesEditor"));
        });
        text.textinput();
    }

    private fillPropertiesEditor(editorLayer: JQuery) {
        editorLayer.empty();
        var _this = this;
        var idLabel = $("<label for='text-id' > Id: </label>");
        var idField = $("<input type = 'text' name = 'text-id' id = 'text-id' value = '" + this.Preferences.EditTextId + "' >");
        editorLayer.append(idLabel);
        editorLayer.append(idField);
        idField.change(function () {
            _this.preferences.EditTextId = idField.val();
            mDesigner.Designer.instance.saveModel();
        });
        idField.textinput();
        var textLabel = $("<label for='text-text' > Text: </label>");
        var textField = $("<input type = 'text' name = 'text-text' id = 'text-text' value = '" + this.Preferences.Text + "' >");
        editorLayer.append(textLabel);
        editorLayer.append(textField);
        textField.change(function () {
            _this.preferences.Text = textField.val();
            mDesigner.Designer.instance.saveModel();
            _this.init();
        });
        textField.textinput();
        var marginTopLabel = $("<label for='text-margin-top' > Top margin: </label>");
        var marginTopField = $("<input type = 'number' name = 'text-margin-top' id = 'text-margin-top' value = '" + this.Preferences.LayoutMarginTop + "' >");
        editorLayer.append(marginTopLabel);
        editorLayer.append(marginTopField);
        marginTopField.change(function () {
            _this.preferences.LayoutMarginTop = marginTopField.val();
            _this.init();
            mDesigner.Designer.instance.saveModel();
        });
        marginTopField.textinput();
        /*
        var sizeLabel = $("<label for='text-size' > Font size: </label>");
        var sizeField = $("<input type = 'number' name = 'text-size' id = 'text-size' value = '" + this.Preferences.TextSize + "' >");
        editorLayer.append(sizeLabel);
        editorLayer.append(sizeField);
        sizeField.change(function () {
            _this.preferences.TextSize = sizeField.val();
            _this.init();
        });
        sizeField.textinput();
        /*
        WAIT FOR BETTER TIMES!
        var paddingLabel = $("<label for='text-padding' > Padding: </label>");
        var paddingField = $("<input type = 'number' name = 'text-padding' id = 'text-padding' value = '" + this.Preferences.Padding + "' >");
        editorLayer.append(paddingLabel);
        editorLayer.append(paddingField);
        paddingField.change(function () {
            _this.preferences.Padding = paddingField.val();
            _this.init();
        });
        paddingField.textinput();*/
    }

    public toXML() {
        var xmlString = "";
        xmlString += "<EditText \n";
        if (this.preferences.Width == mElementPreferences.ElementPreferences.FillParent) {
            xmlString += "layout_width=\"fill_parent\" ";
        } else if (this.preferences.Width == mElementPreferences.ElementPreferences.WrapContent) {
            xmlString += "layout_width=\"wrap_content\" ";
        } else {
            xmlString += "layout_width=\"" + this.preferences.Width + "px\" ";
        }
        if (this.preferences.Height == mElementPreferences.ElementPreferences.FillParent) {
            xmlString += "layout_height=\"fill_parent\" ";
        } else if (this.preferences.Height == mElementPreferences.ElementPreferences.WrapContent) {
            xmlString += "layout_height=\"wrap_content\" ";
        } else {
            xmlString += "layout_height=\"" + this.preferences.Width + "px\" ";
        }
        xmlString += "layout_marginTop=\"" + this.preferences.LayoutMarginTop + "px\" ";
        xmlString += "id=\"" + this.preferences.EditTextId + "\" ";
        xmlString += "padding=\"" + this.preferences.Padding + "px\" ";
        xmlString += "text=\"" + this.preferences.Text + "px\" />\n";
        //xmlString += "textSize=\"" + this.preferences.TextSize + "px\" />\n";
        return xmlString;
    }
}