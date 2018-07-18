/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _pydioUtilXml = require('pydio/util/xml');

var _pydioUtilXml2 = _interopRequireDefault(_pydioUtilXml);

var _pydioUtilLang = require('pydio/util/lang');

var _pydioUtilLang2 = _interopRequireDefault(_pydioUtilLang);

/**
 * Editor for a given plugin. By default, displays documentation in a left column panel,
 * and plugin parameters as form cards on the right.
 * May take additionalPanes to be appended to the form cards.
 */
var PluginEditor = _react2['default'].createClass({
    displayName: 'PluginEditor',

    mixins: [AdminComponents.MessagesConsumerMixin],

    propTypes: {
        pluginId: _react2['default'].PropTypes.string.isRequired,
        close: _react2['default'].PropTypes.func,
        style: _react2['default'].PropTypes.string,
        className: _react2['default'].PropTypes.string,
        additionalPanes: _react2['default'].PropTypes.shape({
            top: _react2['default'].PropTypes.array,
            bottom: _react2['default'].PropTypes.array
        }),
        docAsAdditionalPane: _react2['default'].PropTypes.bool,
        additionalDescription: _react2['default'].PropTypes.string,
        registerCloseCallback: _react2['default'].PropTypes.func,
        onBeforeSave: _react2['default'].PropTypes.func,
        onAfterSave: _react2['default'].PropTypes.func,
        onRevert: _react2['default'].PropTypes.func,
        onDirtyChange: _react2['default'].PropTypes.func
    },

    loadPluginData: function loadPluginData(plugId) {
        var _this = this;

        var loader = _Loader2['default'].getInstance(this.props.pydio);
        Promise.all([loader.loadPlugins(), loader.loadPluginConfigs(plugId)]).then(function (result) {
            var xml = result[0];
            var values = result[1];

            var xmlData = _pydioUtilXml2['default'].XPathSelectSingleNode(xml, '/plugins/*[@id="' + plugId + '"]');
            console.log(xmlData);
            var params = PydioForm.Manager.parseParameters(xmlData, "server_settings/global_param");

            var documentation = _pydioUtilXml2['default'].XPathSelectSingleNode(xmlData, "//plugin_doc");
            var enabledAlways = false;
            var label = xmlData.getAttribute("label");
            var description = xmlData.getAttribute("description");
            try {
                enabledAlways = xmlData.getAttribute("enabled") === 'always';
            } catch (e) {}
            _this.setState({
                loaded: true,
                parameters: params,
                values: values,
                originalValues: _pydioUtilLang2['default'].deepCopy(values),
                documentation: documentation,
                enabledAlways: enabledAlways,
                dirty: false,
                label: label,
                description: description
            });

            if (_this.props.registerCloseCallback) {
                _this.props.registerCloseCallback(function () {
                    if (_this.state && _this.state.dirty && !confirm(_this.context.getMessage('19', 'role_editor'))) {
                        return false;
                    }
                });
            }
        });
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (nextProps.pluginId !== this.props.pluginId) {
            this.loadPluginData(nextProps.pluginId);
            this.setState({ values: {} });
        }
    },

    getInitialState: function getInitialState() {

        this.loadPluginData(this.props.pluginId);

        return {
            loaded: false,
            parameters: [],
            values: {},
            documentation: '',
            dirty: false,
            label: '',
            docOpen: false
        };
    },

    externalSetDirty: function externalSetDirty() {
        this.setState({ dirty: true });
    },

    onChange: function onChange(formValues, dirty) {
        this.setState({ dirty: dirty, values: formValues });
        if (this.props.onDirtyChange) {
            this.props.onDirtyChange(dirty, formValues);
        }
    },

    save: function save() {
        var _this2 = this;

        _Loader2['default'].getInstance(this.props.pydio).savePluginConfigs(this.props.pluginId, this.state.values, function (newValues) {
            _this2.setState({ dirty: false });
            if (_this2.props.onAfterSave) {
                _this2.props.onAfterSave(newValues);
            }
        });
    },

    revert: function revert() {
        this.setState({ dirty: false, values: this.state.originalValues });
        if (this.props.onRevert) {
            this.props.onRevert(this.state.originalValues);
        }
    },

    parameterHasHelper: function parameterHasHelper(paramName, testPluginId) {
        paramName = paramName.split('/').pop();
        var h = PydioForm.Manager.hasHelper(this.props.pluginId, paramName);
        if (!h && testPluginId) {
            h = PydioForm.Manager.hasHelper(testPluginId, paramName);
        }
        return h;
    },

    showHelper: function showHelper(helperData, testPluginId) {
        if (helperData) {
            var plugId = this.props.pluginId;
            if (testPluginId && !PydioForm.Manager.hasHelper(plugId, helperData['name'])) {
                helperData['pluginId'] = testPluginId;
            } else {
                helperData['pluginId'] = plugId;
            }
            helperData['updateCallback'] = this.helperUpdateValues.bind(this);
        }
        this.setState({ helperData: helperData });
    },

    closeHelper: function closeHelper() {
        this.setState({ helperData: null });
    },

    /**
     * External helper can pass a full set of values and update them
     * @param newValues
     */
    helperUpdateValues: function helperUpdateValues(newValues) {
        this.onChange(newValues, true);
    },

    toggleDocPane: function toggleDocPane() {
        this.setState({ docOpen: !this.state.docOpen });
    },

    monitorMainPaneScrolling: function monitorMainPaneScrolling(event) {
        if (event.target.className.indexOf('pydio-form-panel') === -1) {
            return;
        }
        var scroll = event.target.scrollTop;
        var newState = scroll > 5;
        var currentScrolledState = this.state && this.state.mainPaneScrolled;
        if (newState !== currentScrolledState) {
            this.setState({ mainPaneScrolled: newState });
        }
    },

    render: function render() {

        var addPanes = { top: [], bottom: [] };
        if (this.props.additionalPanes) {
            addPanes.top = this.props.additionalPanes.top.slice();
            addPanes.bottom = this.props.additionalPanes.bottom.slice();
        }
        var closeButton = undefined;
        if (this.props.closeEditor) {
            closeButton = _react2['default'].createElement(_materialUi.RaisedButton, { label: this.context.getMessage('86', ''), onTouchTap: this.props.closeEditor });
        }

        var doc = this.state.documentation;
        if (doc && this.props.docAsAdditionalPane) {
            doc = doc.firstChild.nodeValue.replace('<p><ul', '<ul').replace('</ul></p>', '</ul>').replace('<p></p>', '');
            doc = doc.replace('<img src="', '<img style="width:90%;" src="plugins/' + this.props.pluginId + '/');
            var readDoc = function readDoc() {
                return { __html: doc };
            };
            var docPane = _react2['default'].createElement(
                'div',
                { className: "plugin-doc" + (this.state.docOpen ? ' plugin-doc-open' : '') },
                _react2['default'].createElement(
                    'h3',
                    null,
                    'Documentation'
                ),
                _react2['default'].createElement('div', { className: 'plugin-doc-pane', dangerouslySetInnerHTML: readDoc() })
            );
            addPanes.top.push(docPane);
        }

        var scrollingClassName = '';
        if (this.state && this.state.mainPaneScrolled) {
            scrollingClassName = ' main-pane-scrolled';
        }
        var actions = [];
        actions.push(_react2['default'].createElement(_materialUi.FlatButton, { secondary: true, disabled: !this.state.dirty, label: this.context.getMessage('plugins.6'), onTouchTap: this.revert }));
        actions.push(_react2['default'].createElement(_materialUi.FlatButton, { secondary: true, disabled: !this.state.dirty, label: this.context.getMessage('plugins.5'), onTouchTap: this.save }));
        actions.push(closeButton);

        var icon = undefined;
        // Building  a form
        return _react2['default'].createElement(
            'div',
            { className: (this.props.className ? this.props.className + " " : "") + "main-layout-nav-to-stack vertical-layout plugin-board" + scrollingClassName, style: this.props.style },
            _react2['default'].createElement(AdminComponents.Header, { title: this.state.label, actions: actions, scrolling: this.state && this.state.mainPaneScrolled, icon: icon }),
            _react2['default'].createElement(PydioForm.FormPanel, {
                ref: 'formPanel',
                className: 'row-flex',
                parameters: this.state.parameters,
                values: this.state.values,
                onChange: this.onChange,
                disabled: false,
                additionalPanes: addPanes,
                tabs: this.props.tabs,
                setHelperData: this.showHelper,
                checkHasHelper: this.parameterHasHelper,
                onScrollCallback: this.monitorMainPaneScrolling
            }),
            _react2['default'].createElement(PydioForm.PydioHelper, {
                helperData: this.state ? this.state.helperData : null,
                close: this.closeHelper
            })
        );
    }
});

exports['default'] = PluginEditor;
module.exports = exports['default'];