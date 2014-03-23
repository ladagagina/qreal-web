﻿define(["require", "exports", "src/Application", "src/util/log/Log", "src/model/controls/DesignerControls"], function(require, exports, App, Log, DesignerControls) {
    var DesignerControlFactory = (function () {
        function DesignerControlFactory() {
            this.log = new Log("DesignerControlFactory");
        }
        DesignerControlFactory.prototype.CreatePage = function (id) {
            var page = new DesignerControls.Page(id);
            var $page = $('<div></div>');
            $page.data('role', 'page');
            $page.attr('id', id);

            $page.on('drop', function (event) {
                return page.OnDrop(event);
            });
            $page.on('dragover', function (event) {
                return page.OnDragOver(event);
            });
            page.Element = $page;
            return page;
        };

        DesignerControlFactory.prototype.CreateButton = function (id) {
            var _this = this;
            var button = new DesignerControls.Button(id);
            var $bt = $('<a href="#"></a>');

            $bt.data('role', 'button');
            $bt.attr('id', button.Properties.Id);
            $bt.text(button.Properties.Text);

            $bt.on('click', function (event) {
                _this.log.Debug('bt click');
                App.Instance.Designer.ShowProperty(button.Properties);
            });

            button.Element = $bt.button();
            this.log.Debug("button:", button.Element);
            return button;
        };

        DesignerControlFactory.prototype.CreateInput = function (id) {
            var _this = this;
            var input = new DesignerControls.Input(id);

            var $container = $("<div data-role='fieldcontain'></div>");
            var $label = $("<label></label>");
            $label.text(input.Properties.Title);
            $label.attr('for', input.Properties.Id);

            var $input = $('<input />');
            $input.attr('type', 'text');
            $input.attr('id', input.Properties.Id);
            $input.attr('name', input.Properties.Name);

            $container.append($label);
            $container.append($input);

            $container.on('click', function (event) {
                _this.log.Debug('input click');
                App.Instance.Designer.ShowProperty(input.Properties);
            });

            this.log.Debug('input: ', $container);
            $container.find('input').textinput();
            input.Element = $container;
            return input;
        };

        DesignerControlFactory.prototype.CreateHeader = function (id) {
            var header = new DesignerControls.Header(id);
            var $container = $("<div data-role='header'></div>");
            $container.append($("<h1>Page Title</h1> "));
            header.Element = $container;
            return header;
        };
        return DesignerControlFactory;
    })();

    
    return DesignerControlFactory;
});
//# sourceMappingURL=DesignerControlFactory.js.map