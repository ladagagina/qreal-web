﻿define(["require", "exports", "src/Application", "src/util/log/Log", "src/model/Enums", "src/model/ControlProperty", "src/model/DesignerControls", "src/device/DesignerControlFactory", "src/device/AppControlFactory"], function(require, exports, App, Log, Enums, ControlProperty, DesignerControls, DesignerControlFactory, AppControlFactory) {
    var ControlManager = (function () {
        function ControlManager() {
            this.log = new Log("ControlManager");
            this.idIndex = 1;
            this.app = new DesignerControls.BaseContainer(new ControlProperty.Property(0 /* App */, "AppName"));
            this.log.Debug("constructor");
            this.controlFactory = new DesignerControlFactory();
            this.appControlFactory = new AppControlFactory();
        }
        ControlManager.prototype.Init = function () {
            this.log.Debug("Init");
        };

        /*** Pages ***/
        ControlManager.prototype.CreatePage = function (pageId) {
            this.log.Debug("CreatePage: " + pageId);
            if (this.ContainsId(pageId)) {
                this.log.Warn("Page id alredy exists");

                //TODO: show notification
                alert('Id already exists');
                return false;
            }

            var page = this.controlFactory.CreatePage(new ControlProperty.PageProperty(pageId));
            this.app.Childrens.push(page);
            $('body').append(page.Element);
            this.SelectPage(pageId);
            return true;
        };

        ControlManager.prototype.SelectPage = function (pageId) {
            this.log.Debug("SelectPage: " + pageId);
            $.mobile.changePage('#' + pageId);
        };

        /*** Controls ***/
        ControlManager.prototype.CreateControl = function (controlId) {
            this.log.Debug("CreateControl: " + controlId);
            switch (controlId) {
                case "Button":
                    return this.CreateButton();
                case "Input":
                    return this.CreateInput();
                case "Header":
                    break;
            }
        };

        ControlManager.prototype.CreateButton = function () {
            var property = new ControlProperty.ButtonProperty(this.GetNewId('button'));
            return this.controlFactory.CreateButton(property);
        };

        ControlManager.prototype.CreateInput = function () {
            var property = new ControlProperty.InputProperty(this.GetNewId('input'));
            return this.controlFactory.CreateInput(property);
        };

        /* Id */
        ControlManager.prototype.GetNewId = function (prefix) {
            if (typeof prefix === "undefined") { prefix = 'id'; }
            var id = prefix + this.idIndex++;
            if (this.ContainsId(id)) {
                this.log.Warn('id: ' + id + ' already exists');
                id = prefix + this.idIndex++;
            }
            return id;
        };

        ControlManager.prototype.ContainsId = function (id) {
            return this.FindById(id) != null;
        };

        /*** Changing Property ***/
        ControlManager.prototype.ChangeProperty = function (propertyId, propertyType, controlType, newValue) {
            this.log.Debug("OnChangeProperty, propertyId: " + propertyId + " propertyType: " + propertyType + " controlType: " + controlType + " value: " + newValue);
            if (propertyType == 0 /* Id */) {
                if (this.ContainsId(newValue)) {
                    //TODO: show notification
                    alert('Id already exists');
                    return;
                }
            }

            switch (controlType) {
                case 3 /* Button */:
                    this.ChangeButtonProperty(propertyId, propertyType, newValue);
                    break;
                case 4 /* Input */:
                    this.ChangeInputProperty(propertyId, propertyType, newValue);
                    break;
                case 1 /* Page */:
                    this.ChangePageProperty(propertyId, propertyType, newValue);
                    break;
            }
        };

        ControlManager.prototype.ChangePageProperty = function (propertyId, propertyType, newValue) {
            this.log.Debug('ChangePageProperty');
            var page = this.FindById(propertyId);
            switch (propertyType) {
                case 7 /* Header */:
                    if (newValue == 'yes') {
                        var header = App.Instance.Device.ControlManager.CreateControl('Header');
                        page.Element.prepend(header.Element);
                        page.Element.trigger('pagecreate');
                    } else {
                        page.Element.find('div[data-role="header"]').remove();
                    }
                    break;
            }
        };

        ControlManager.prototype.ChangeButtonProperty = function (propertyId, propertyType, newValue) {
            var button = this.FindById(propertyId);
            switch (propertyType) {
                case 0 /* Id */:
                    button.Properties.Id = newValue;
                    button.Element.attr('id', newValue);
                    break;
                case 1 /* Text */:
                    this.log.Debug("Enums.PropertyType.Text:", button.Element);
                    button.Element.find('.ui-btn-text').text(newValue);
                    break;
                case 2 /* Inline */:
                    var cond = newValue == "true";
                    button.Element.buttonMarkup({ inline: cond });
                    break;
                case 3 /* Corners */:
                    var cond = newValue == "true";
                    button.Element.buttonMarkup({ corners: cond });
                    break;
                case 4 /* Mini */:
                    var cond = newValue == "true";
                    button.Element.buttonMarkup({ mini: cond });
                    break;
                case 5 /* Theme */:
                    button.Element.buttonMarkup({ theme: newValue });
                    break;
            }
        };

        ControlManager.prototype.ChangeInputProperty = function (propertyId, propertyType, newValue) {
            var input = this.FindById(propertyId);
            switch (propertyType) {
                case 0 /* Id */:
                    input.Properties.Id = newValue;
                    input.Element.find('input').attr('id', newValue);
                    break;
                case 6 /* Title */:
                    input.Element.find('label').text(newValue);
                    break;
                case 4 /* Mini */:
                    var cond = newValue == "true";

                    break;
                case 5 /* Theme */:
                    break;
            }
        };

        ControlManager.prototype.GenerateAppHtml = function () {
        };

        ControlManager.prototype.FindById = function (id) {
            this.log.Debug("FindById: " + id);
            return this.FindInContainer(id, this.app);
        };

        ControlManager.prototype.FindInContainer = function (id, control) {
            if (control.Properties.Id === id) {
                return control;
            }
            if (control instanceof DesignerControls.BaseContainer) {
                var childrens = control.Childrens;
                for (var i in childrens) {
                    var res = this.FindInContainer(id, childrens[i]);
                    if (res) {
                        return res;
                    }
                }
            }
            return null;
        };
        return ControlManager;
    })();

    
    return ControlManager;
});
//# sourceMappingURL=ControlManager.js.map
