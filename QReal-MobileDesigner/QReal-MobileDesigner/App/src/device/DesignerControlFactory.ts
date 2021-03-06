﻿import App = require("src/Application");
import Log = require("src/util/log/Log");
import Enums = require("src/model/Enums");
import Helper = require("src/util/Helper");
import DesignerControls = require("src/model/DesignerControls");
import ControlProperty = require("src/model/ControlProperty");
import AppControlFactory = require("src/device/AppControlFactory");


class DesignerControlFactory extends AppControlFactory {

    constructor() {
        super();
        this.log = new Log("DesignerControlFactory");;
    }

    public CreateControl(property: ControlProperty.Property): JQuery {
        console.log('CreateControl', property)
        switch (property.Type) {
            case Enums.ControlType.Page:
                return this.CreatePage(<any>property);
                break;
            case Enums.ControlType.Header:
                return this.CreateHeader(<any>property);
                break;
            case Enums.ControlType.Button:
                return this.CreateButton(<any>property);
                break;
            case Enums.ControlType.Input:
                return this.CreateInput(<any>property);
                break;
            case Enums.ControlType.Label:
                return this.CreateLabel(<any>property);
                break;
            case Enums.ControlType.Image:
                return this.CreateImage(<any>property);
                break;
            case Enums.ControlType.Map:
                return this.CreateMap(<any>property);
                break;
            case Enums.ControlType.WebView:
                return this.CreateWebView(<any>property);
                break;
        }
    }

    public CreatePage(property: ControlProperty.PageProperty): JQuery {
        var $page = super.CreatePage(property);
        var $content = $page.find('div[role=main]');
        var controlManager = App.Instance.Device.ControlManager;
        $page.on('drop', event => controlManager.OnDrop(event, property.Id));
        $page.on('dragover', event => controlManager.OnDragOver(event));

        (<any>$content).sortable(
            {
                forcePlaceholderSize: true,
                containment: "document",
                cancel: '.nondraggable',
                start: function (event, ui) {
                    ui.placeholder.height(ui.item.height());
                    ui.item.startPos = ui.item.index();
                },
                stop: function (e, ui) {
                    console.log
                    var container = <DesignerControls.BaseContainer<ControlProperty.Property>>controlManager.FindById(property.Id);
                    Helper.ArrayMove(container.Childrens, ui.item.startPos, ui.item.index());
                },
                delay: 100,
                placeholder: "ui-state-highlight"
            });
        //$page.attr('class', 'sortcontainer');
        return $page;
    }

    public CreateHeader(property: ControlProperty.HeaderProperty): JQuery {
        var $header = super.CreateHeader(property);
        $header.addClass('nondraggable');

        $header.on('click', event => {
            event.preventDefault();
            App.Instance.Designer.ShowProperty(property);
        });

        return $header;
    }

    public CreateButton(property: ControlProperty.ButtonProperty): JQuery {
        var $bt = super.CreateButton(property);

        $bt.on('click', event => {
            event.preventDefault();
            this.log.Debug('bt click');
            App.Instance.Designer.ShowProperty(property);
        });
        return $bt;
    }

    public CreateInput(property: ControlProperty.InputProperty): JQuery {
        var $input = super.CreateInput(property);
        $input.find('input').textinput();
        $input.on('click', event => {
            event.preventDefault();
            App.Instance.Designer.ShowProperty(property);
        });

        return $input;
    }

    public CreateMap(property: ControlProperty.MapProperty): JQuery {
        var $map = super.CreateMap(property);
        $map.css('background-color', '#aaa');
        $map.on('click', event => {
            event.preventDefault();
            App.Instance.Designer.ShowProperty(property);
        });
        return $map;
    }

    public CreateLabel(property: ControlProperty.LabelProperty): JQuery {
        var $label = super.CreateLabel(property);
        $label.on('click', event => {
            event.preventDefault();
            App.Instance.Designer.ShowProperty(property);
        });
        return $label;
    }

    public CreateImage(property: ControlProperty.ImageProperty): JQuery {
        var $img = super.CreateImage(property);
        $img.on('click', event => {
            event.preventDefault();
            App.Instance.Designer.ShowProperty(property);
        });
        return $img;
    }

    public CreateWebView(property: ControlProperty.WebViewProperty): JQuery {
        var $webView = $("<div>");
        $webView.attr('id', property.Id);
        $webView.css({
            'width': property.Width,
            'height': property.Height,
            'display': 'block',
            'margin-left': 'auto',
            'margin-right': 'auto',
            'border': '1px solid gray'
        });
        var $label = $('<div>');
        $label.css({
            'text-align': 'center',
            'margin-top': '10px'
        })
        $label.clone().text('WebView').appendTo($webView);
        $label.clone().text('Url:' + property.Url).appendTo($webView);

        $webView.bind('click', event => {
            event.preventDefault();
            App.Instance.Designer.ShowProperty(property);
        });

        return $webView;
    }
}

export = DesignerControlFactory;