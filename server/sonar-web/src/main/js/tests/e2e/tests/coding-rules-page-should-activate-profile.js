/*
 * SonarQube, open source software quality management tool.
 * Copyright (C) 2008-2014 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * SonarQube is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * SonarQube is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
/* global casper:false */

var lib = require('../lib');

lib.initMessages();
lib.changeWorkingDirectory('coding-rules-page-should-activate-profile');
lib.configureCasper();


casper.test.begin('coding-rules-page-should-activate-profile', 5, function (test) {
  casper
      .start(lib.buildUrl('coding-rules'), function () {
        lib.setDefaultViewport();

        lib.mockRequest('/api/l10n/index', '{}');
        lib.mockRequestFromFile('/api/rules/app', 'app.json');
        lib.mockRequestFromFile('/api/rules/search', 'search.json');
        this.showMock = lib.mockRequestFromFile('/api/rules/show', 'show.json');
        lib.mockRequest('/api/qualityprofiles/activate_rule', '{}');
        lib.mockRequest('/api/issues/search', '{}');
      })

      .then(function () {
        casper.waitForSelector('.coding-rule.selected', function () {
          casper.click('.coding-rule.selected .js-rule');
        });
      })

      .then(function () {
        casper.waitForSelector('.coding-rules-detail-header');
      })

      .then(function () {
        test.assertDoesntExist('.coding-rules-detail-quality-profile-name');
        test.assertExist('#coding-rules-quality-profile-activate');
        casper.click('#coding-rules-quality-profile-activate');
        casper.waitForSelector('.modal');
      })

      .then(function () {
        lib.clearRequestMock(this.showMock);
        lib.mockRequestFromFile('/api/rules/show', 'show-with-profile.json');
        casper.click('#coding-rules-quality-profile-activation-activate');
        casper.waitForSelector('.coding-rules-detail-quality-profile-name');
      })

      .then(function () {
        test.assertExists('.coding-rules-detail-quality-profile-name');
        test.assertExists('.coding-rules-detail-quality-profile-severity');
        test.assertExists('.coding-rules-detail-quality-profile-deactivate');
      })

      .run(function () {
        test.done();
      });
});
