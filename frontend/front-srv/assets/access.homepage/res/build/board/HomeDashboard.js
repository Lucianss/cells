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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ConfigLogo = require('./ConfigLogo');

var _ConfigLogo2 = _interopRequireDefault(_ConfigLogo);

var _materialUi = require('material-ui');

var _WelcomeTour = require('./WelcomeTour');

var _WelcomeTour2 = _interopRequireDefault(_WelcomeTour);

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _HomeSearchForm = require('./HomeSearchForm');

var _HomeSearchForm2 = _interopRequireDefault(_HomeSearchForm);

var _recentActivityStreams = require('../recent/ActivityStreams');

var _recentActivityStreams2 = _interopRequireDefault(_recentActivityStreams);

var _Pydio$requireLib = _pydio2['default'].requireLib('workspaces');

var MasterLayout = _Pydio$requireLib.MasterLayout;

var AltDashboard = (function (_React$Component) {
    _inherits(AltDashboard, _React$Component);

    function AltDashboard(props) {
        _classCallCheck(this, AltDashboard);

        _get(Object.getPrototypeOf(AltDashboard.prototype), 'constructor', this).call(this, props);
        this.state = { unreadStatus: 0, drawerOpen: true };
        //setTimeout(()=>{this.setState({drawerOpen: false})}, 2000);
    }

    _createClass(AltDashboard, [{
        key: 'openDrawer',
        value: function openDrawer(event) {
            event.stopPropagation();
            this.setState({ drawerOpen: true });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var _props = this.props;
            var pydio = _props.pydio;
            var muiTheme = _props.muiTheme;
            var drawerOpen = this.state.drawerOpen;

            var appBarColor = new _materialUi.Color(muiTheme.appBar.color);
            var guiPrefs = pydio.user ? pydio.user.getPreference('gui_preferences', true) : [];
            var wTourEnabled = pydio.getPluginConfigs('gui.ajax').get('ENABLE_WELCOME_TOUR');

            var styles = {
                appBarStyle: {
                    zIndex: 1,
                    backgroundColor: appBarColor.alpha(.6).toString(),
                    height: 100
                },
                buttonsStyle: {
                    color: muiTheme.appBar.textColor
                },
                iconButtonsStyle: {
                    color: appBarColor.darken(0.4).toString()
                },
                wsListsContainerStyle: {
                    position: 'absolute',
                    zIndex: 10,
                    top: 108,
                    bottom: 0,
                    right: 0,
                    left: 260,
                    display: 'flex',
                    flexDirection: 'column'
                }
            };

            var mainClasses = ['vertical_layout', 'vertical_fit', 'react-fs-template', 'user-dashboard-template'];

            var tutorialComponent = undefined;
            if (wTourEnabled && !guiPrefs['WelcomeComponent.Pydio8.TourGuide.Welcome']) {
                tutorialComponent = _react2['default'].createElement(_WelcomeTour2['default'], { ref: 'welcome', pydio: pydio });
            }

            var leftPanelProps = {
                style: { backgroundColor: 'transparent' },
                userWidgetProps: {
                    hideNotifications: false,
                    style: {
                        backgroundColor: appBarColor.darken(.2).alpha(.7).toString()
                    }
                }
            };
            // Not used - to be used for toggling left menu
            var drawerIcon = _react2['default'].createElement(
                'span',
                { className: 'drawer-button', style: { position: 'absolute' } },
                _react2['default'].createElement(_materialUi.IconButton, {
                    iconStyle: { color: null, display: 'none' },
                    iconClassName: 'mdi mdi-menu',
                    onTouchTap: this.openDrawer.bind(this) })
            );

            return _react2['default'].createElement(
                MasterLayout,
                {
                    pydio: pydio,
                    classes: mainClasses,
                    tutorialComponent: tutorialComponent,
                    leftPanelProps: leftPanelProps,
                    drawerOpen: drawerOpen,
                    onCloseDrawerRequested: function () {
                        _this.setState({ drawerOpen: true });
                    }
                },
                _react2['default'].createElement(
                    _materialUi.Paper,
                    { zDepth: 1, style: _extends({}, styles.appBarStyle), rounded: false },
                    _react2['default'].createElement(
                        'div',
                        { id: 'workspace_toolbar', style: { display: "flex", justifyContent: "space-between" } },
                        _react2['default'].createElement('span', { style: { flex: 1 } }),
                        _react2['default'].createElement(
                            'div',
                            { style: { textAlign: 'center', width: 250 } },
                            _react2['default'].createElement(_ConfigLogo2['default'], {
                                className: 'home-top-logo',
                                pydio: this.props.pydio,
                                pluginName: 'gui.ajax',
                                pluginParameter: 'CUSTOM_DASH_LOGO'
                            })
                        )
                    )
                ),
                _react2['default'].createElement(
                    'div',
                    { style: { backgroundColor: 'rgba(255,255,255,1)' }, className: 'vertical_fit user-dashboard-main' },
                    _react2['default'].createElement(
                        _HomeSearchForm2['default'],
                        _extends({ zDepth: 0 }, this.props, { style: styles.wsListsContainerStyle }),
                        _react2['default'].createElement(
                            'div',
                            { style: { flex: 1, overflowY: 'scroll' }, id: 'history-block' },
                            _react2['default'].createElement(_recentActivityStreams2['default'], _extends({}, this.props, {
                                emptyStateProps: { style: { backgroundColor: 'white' } }
                            }))
                        )
                    )
                )
            );
        }
    }]);

    return AltDashboard;
})(_react2['default'].Component);

exports['default'] = AltDashboard = MaterialUI.Style.muiThemeable()(AltDashboard);

exports['default'] = AltDashboard;
module.exports = exports['default'];
