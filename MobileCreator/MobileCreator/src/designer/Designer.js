define(["require", "exports", "utils/log/Log", "designer/preferences/ElementPreferences", "designer/preferences/LinearLayoutPreferences", "designer/widgets/LinearLayout", "designer/Form", "designer/widgets/WidgetTypes"], function(require, exports, __mLog__, __mElementPreferences__, __mLinearLayoutPreferences__, __mLinearLayout__, __mForm__, __mWidgetTypes__) {
    var mLog = __mLog__;

    var mElementPreferences = __mElementPreferences__;

    var mLinearLayoutPreferences = __mLinearLayoutPreferences__;

    var mLinearLayout = __mLinearLayout__;

    
    
    
    
    
    
    
    
    var mForm = __mForm__;

    var mWidgetTypes = __mWidgetTypes__;

    
    var Designer = (function () {
        function Designer() {
            this.logger = new mLog.Logger("Designer");
        }
        Designer.id = 0;
        Designer.instance = new Designer();
        Designer.forms = [];
        Designer.formNames = [];
        Designer.formsDomElement = $("#form");
        Designer.prototype.exportButtonsToXML = function () {
            var xml = "";
            for(var i = 0; i < Designer.forms.length; i++) {
                var form = Designer.forms[i];
                var baseLayout = form.Content[0];
                for(var j = 0; j < baseLayout.Children.length; j++) {
                    var control = baseLayout.Children[j];
                    if(control.Preferences.WidgetType == mWidgetTypes.WidgetTypes.Button) {
                        var codeBlock = (control).CodeBlock;
                        xml += "<action control-id='" + (control).Preferences.ButtonId + "'>\n";
                        xml += codeBlock.toXML();
                        xml += "</action>\n";
                    }
                }
            }
            return xml;
        };
        Designer.prototype.addForm = function (formName) {
            $("#propertiesEditor").empty();
            Designer.activeForm.hide();
            Designer.activeForm = new mForm.Form(formName, Designer.formsDomElement);
            Designer.forms.push(Designer.activeForm);
            var layoputPreferences = new mLinearLayoutPreferences.LinearLayoutPreferences();
            layoputPreferences.Orientation = mLinearLayoutPreferences.LinearLayoutPreferences.Vertical;
            layoputPreferences.Background = "#ffffff";
            layoputPreferences.Height = mElementPreferences.ElementPreferences.FillParent;
            layoputPreferences.Id = Designer.id;
            Designer.id++;
            layoputPreferences.Width = mElementPreferences.ElementPreferences.FillParent;
            var layout = new mLinearLayout.LinearLayout(layoputPreferences);
            Designer.activeForm.addElement(layout);
            $("#formNameField").val(Designer.activeForm.FormName);
            Designer.formNames.push(formName);
            Designer.activeForm.show();
            this.updateFormsSelect();
            this.updateTriggersSelect();
            this.updateFormHeader();
            this.saveModel();
        };
        Designer.prototype.saveModel = function () {
            this.logger.log("saving");
            var xml = this.getXML();
            this.logger.log("to localhost");
            var _this = this;
            $.ajax("http://localhost:12345/", {
                type: "POST",
                contentType: "text/XML",
                processData: false,
                data: xml,
                success: function (data) {
                    _this.logger.log("saved");
                }
            });
        };
        Designer.prototype.sendXml = function () {
            this.logger.log("sendXml");
            var xml = this.getXML();
            this.logger.log(xml);
            this.logger.log("to localhost");
            var _this = this;
            $.ajax("http://localhost:12345/", {
                type: "POST",
                contentType: "text/XML",
                processData: false,
                data: xml,
                success: function (data) {
                    _this.logger.log("response");
                    window.location.assign("http://localhost:51987/patients.xap");
                }
            });
        };
        Designer.prototype.getXML = function () {
            var xml = "<application name='patients'>\n";
            xml += "<logic>\n";
            xml += this.exportButtonsToXML();
            for(var i = 0; i < Designer.forms.length; i++) {
                for(var j = 0; j < Designer.forms[i].Triggers.length; j++) {
                    xml += Designer.forms[i].Triggers[j].toXML();
                }
            }
            xml += "</logic>\n";
            xml += "<forms>\n";
            for(var i = 0; i < Designer.forms.length; i++) {
                xml += Designer.forms[i].toXML();
            }
            xml += "</forms>\n";
            xml += "</application>\n";
            return xml;
        };
        Designer.prototype.updateFormsSelect = function () {
            var select = $("#formsSelect");
            select.empty();
            for(var i = 0; i < Designer.forms.length; i++) {
                var currentName = Designer.forms[i].FormName;
                var newOption = $("<option value=\"" + currentName + "\">" + currentName + "</option>");
                if(currentName == Designer.activeForm.FormName) {
                    newOption.attr("selected", "selected");
                }
                select.append(newOption);
            }
            select.selectmenu("refresh", true);
        };
        Designer.prototype.updateTriggersSelect = function () {
            var _this = this;
            var select = $("#triggersSelect");
            select.empty();
            for(var i = 0; i < Designer.activeForm.Triggers.length; i++) {
                var currentName = Designer.activeForm.Triggers[i].TriggerName;
                var newOption = $("<option value=\"" + currentName + "\">" + currentName + "</option>");
                select.append(newOption);
            }
            select.selectmenu("refresh", true);
            select.change(function () {
                var trigger = null;
                for(var i = 0; i < Designer.activeForm.Triggers.length; i++) {
                    if(select.val() == Designer.activeForm.Triggers[i].TriggerName) {
                        trigger = Designer.activeForm.Triggers[i];
                        break;
                    }
                }
                trigger.show($("#triggerDiv"));
            });
            Designer.activeForm.Triggers[0].show($("#triggerDiv"));
        };
        Designer.prototype.updateFormHeader = function () {
            var div = $("#formHeader");
            div.empty();
            var header = $("<h2 align='center'>" + Designer.activeForm.FormName + "<h2>");
            div.append(header);
        };
        Designer.prototype.changeActiveForm = function (formName) {
            $("#propertiesEditor").empty();
            Designer.activeForm.hide();
            for(var i = 0; i < Designer.forms.length; i++) {
                if(Designer.forms[i].FormName == formName) {
                    Designer.activeForm = Designer.forms[i];
                    Designer.activeForm.show();
                    break;
                }
            }
            $("#formNameField").val(Designer.activeForm.FormName);
            this.updateFormsSelect();
            this.updateTriggersSelect();
            this.updateFormHeader();
        };
        Designer.prototype.initDesigner = function () {
            var _this = this;
            this.logger.log("Init designer");
            var parentDiv = $("#menu");
            var designerMenuDiv = document.createElement("ul");
            $(designerMenuDiv).attr("data-role", "listview");
            $(designerMenuDiv).attr("data-inset", "true");
            $(designerMenuDiv).attr("data-divider-theme", "d");
            var formsSelector = $("<div></div>");
            formsSelector.css("padding", "16px");
            var controlsDiv = document.createElement("ul");
            $(controlsDiv).attr("data-role", "listview");
            $(controlsDiv).attr("data-inset", "true");
            $(controlsDiv).attr("data-divider-theme", "d");
            var propertiesParentDiv = $("#properties");
            var propertiesDiv = document.createElement("ul");
            $(propertiesDiv).attr("data-role", "listview");
            $(propertiesDiv).attr("data-inset", "true");
            $(propertiesDiv).attr("data-divider-theme", "d");
            var formTriggersDiv = document.createElement("ul");
            $(formTriggersDiv).attr("data-role", "listview");
            $(formTriggersDiv).attr("data-inset", "true");
            $(formTriggersDiv).attr("data-divider-theme", "d");
            var sendXMLButton = $("#sendXMLButton");
            $(sendXMLButton).click(function () {
                _this.sendXml();
            });
            var formsTreeHeader = document.createElement("li");
            $(formsTreeHeader).attr("data-role", "list-divider");
            $(formsTreeHeader).text("Forms");
            $(designerMenuDiv).append($(formsTreeHeader));
            var formsSelect = $("<select id=\"formsSelect\"></select>");
            $(formsSelector).append($(formsSelect));
            formsSelect.selectmenu();
            formsSelect.change(function () {
                _this.changeActiveForm(formsSelect.val());
            });
            var addFormButton = $("<a id=\"addFormButton\" data-theme='a' data-role=\"button\" draggable=\"false\">New form</a>");
            $(formsSelector).append($(addFormButton));
            addFormButton.button();
            $(addFormButton).click(function () {
                _this.addForm("New form");
            });
            var formNameLabel = $("<label for='formNameField' >Form name: </label>");
            formNameLabel.css("font-weight", "bold");
            var formNameField = $("<input type = 'text' name = 'formNameField' id = 'formNameField' value = '' >");
            $(formsSelector).append($(formNameLabel));
            $(formsSelector).append($(formNameField));
            $(formNameField).change(function () {
                var newVal = $(formNameField).val();
                var index = Designer.formNames.indexOf(Designer.activeForm.FormName);
                Designer.formNames[index] = newVal;
                Designer.activeForm.FormName = newVal;
                Designer.activeForm.updateTriggers();
                _this.updateFormsSelect();
                _this.updateFormHeader();
                _this.saveModel();
            });
            formNameField.textinput();
            $(designerMenuDiv).append($(formsSelector));
            var elementsPalleteHeader = document.createElement("li");
            $(elementsPalleteHeader).css("margin-top", "20px");
            $(elementsPalleteHeader).attr("data-role", "list-divider");
            $(elementsPalleteHeader).text("Widgets");
            $(controlsDiv).append($(elementsPalleteHeader));
            var elementsPalleteContainer = document.createElement("li");
            $(controlsDiv).append($(elementsPalleteContainer));
            var elementsPallete = document.createElement("div");
            $(elementsPalleteContainer).append($(elementsPallete));
            var buttonElement = $("<a id=\"button\" data-role=\"button\" draggable=\"true\">Button</a>");
            $(elementsPallete).append(buttonElement);
            buttonElement.button();
            var textViewElement = $("<a id=\"textView\" data-role=\"button\" draggable=\"true\">TextView</a>");
            $(elementsPallete).append(textViewElement);
            textViewElement.button();
            var imageViewElement = $("<a id=\"imageView\" data-role=\"button\" draggable=\"true\">ImageView</a>");
            $(elementsPallete).append(imageViewElement);
            imageViewElement.button();
            var webViewElement = $("<a id=\"webView\" data-role=\"button\" draggable=\"true\">WebView</a>");
            $(elementsPallete).append(webViewElement);
            webViewElement.button();
            var editTextElement = $("<a id=\"editText\" data-role=\"button\" draggable=\"true\">EditText</a>");
            $(elementsPallete).append(editTextElement);
            editTextElement.button();
            var mapElement = $("<a id=\"map\" data-role=\"button\" draggable=\"true\">Map</a>");
            $(elementsPallete).append(mapElement);
            mapElement.button();
            var propertiesEditorHeader = document.createElement("li");
            $(propertiesEditorHeader).attr("data-role", "list-divider");
            $(propertiesEditorHeader).text("Properties");
            $(propertiesDiv).append($(propertiesEditorHeader));
            var propertiesEditorContainer = document.createElement("li");
            $(propertiesDiv).append($(propertiesEditorContainer));
            var propertiesEditorDiv = document.createElement("div");
            propertiesEditorDiv.id = "propertiesEditor";
            $(propertiesEditorContainer).append($(propertiesEditorDiv));
            var formTriggersHeader = document.createElement("li");
            $(formTriggersHeader).attr("data-role", "list-divider");
            $(formTriggersHeader).text("Form triggers");
            $(formTriggersDiv).append($(formTriggersHeader));
            var triggerSelectDiv = $("<div></div>");
            $(triggerSelectDiv).css("padding-left", "16px");
            $(triggerSelectDiv).css("padding-right", "16px");
            var triggersSelect = $("<select id=\"triggersSelect\"></select>");
            triggersSelect.change(function () {
            });
            $(triggerSelectDiv).append($(triggersSelect));
            $(formTriggersDiv).append($(triggerSelectDiv));
            triggersSelect.selectmenu();
            var triggerDiv = document.createElement("div");
            $(triggerDiv).css("padding", "16px");
            triggerDiv.id = "triggerDiv";
            $(formTriggersDiv).append($(triggerDiv));
            $(parentDiv).prepend($(controlsDiv));
            $(parentDiv).prepend($(designerMenuDiv));
            $(propertiesParentDiv).prepend($(propertiesDiv));
            $(propertiesParentDiv).append($(formTriggersDiv));
            $(designerMenuDiv).listview();
            $(propertiesDiv).listview();
            $(controlsDiv).css("margin-top", "40px");
            $(controlsDiv).listview();
            $(formTriggersDiv).css("margin-top", "40px");
            $(formTriggersDiv).listview();
            document.getElementById("button").ondragstart = function (ev) {
                ev.dataTransfer.setData("WidgetType", mWidgetTypes.WidgetTypes.Button.toString());
                ev.dataTransfer.setData("IsNew", "yes");
            };
            document.getElementById("textView").ondragstart = function (ev) {
                ev.dataTransfer.setData("WidgetType", mWidgetTypes.WidgetTypes.TextView.toString());
                ev.dataTransfer.setData("IsNew", "yes");
            };
            document.getElementById("imageView").ondragstart = function (ev) {
                ev.dataTransfer.setData("WidgetType", mWidgetTypes.WidgetTypes.ImageView.toString());
                ev.dataTransfer.setData("IsNew", "yes");
            };
            document.getElementById("webView").ondragstart = function (ev) {
                ev.dataTransfer.setData("WidgetType", mWidgetTypes.WidgetTypes.WebView.toString());
                ev.dataTransfer.setData("IsNew", "yes");
            };
            document.getElementById("editText").ondragstart = function (ev) {
                ev.dataTransfer.setData("WidgetType", mWidgetTypes.WidgetTypes.EditText.toString());
                ev.dataTransfer.setData("IsNew", "yes");
            };
            document.getElementById("map").ondragstart = function (ev) {
                ev.dataTransfer.setData("WidgetType", mWidgetTypes.WidgetTypes.Map.toString());
                ev.dataTransfer.setData("IsNew", "yes");
            };
            Designer.activeForm = new mForm.Form("main", Designer.formsDomElement);
            Designer.forms.push(Designer.activeForm);
            Designer.formNames.push("main");
            var layoputPreferences = new mLinearLayoutPreferences.LinearLayoutPreferences();
            layoputPreferences.Orientation = mLinearLayoutPreferences.LinearLayoutPreferences.Vertical;
            layoputPreferences.Background = "#ffffff";
            layoputPreferences.Height = mElementPreferences.ElementPreferences.FillParent;
            layoputPreferences.Id = Designer.id;
            Designer.id++;
            layoputPreferences.Width = mElementPreferences.ElementPreferences.FillParent;
            var layout = new mLinearLayout.LinearLayout(layoputPreferences);
            Designer.activeForm.addElement(layout);
            Designer.activeForm.show();
            this.changeActiveForm("main");
            this.saveModel();
        };
        return Designer;
    })();
    exports.Designer = Designer;    
})
//@ sourceMappingURL=Designer.js.map
