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

var lib = require('../lib'),
    testName = lib.testName('Source Viewer');

lib.initMessages();
lib.changeWorkingDirectory('source-viewer-should-open-in-new-window');
lib.configureCasper();


casper.test.begin(testName('source-viewer-should-open-in-new-window-with-line'), function (test) {
  casper
      .start(lib.buildUrl('source-viewer'), function () {
        lib.setDefaultViewport();

        lib.mockRequest('/api/l10n/index', '{}');
        lib.mockRequestFromFile('/api/components/app', 'api-components-app.json');
        lib.mockRequestFromFile('/api/sources/lines', 'api-sources-lines.json');
        lib.mockRequestFromFile('/api/issues/search', 'api-issues-search.json');
      })

      .then(function () {
        casper.waitForSelector('.source-line');
      })

      .then(function () {
        casper.click('.source-line-number[data-line-number="6"]');
        casper.waitForSelector('.bubble-popup');
      })

      .then(function () {
        casper.click('.js-actions');
        casper.waitForSelector('.js-new-window', function () {
          casper.click('.js-new-window');
        });
      })

      .then(function () {
        casper.withPopup(/Simplest\.java/, function () {
          this.test.assertUrlMatch('test:fake-project-for-tests:src/main/java/foo/Simplest.java');
          this.test.assertUrlMatch('line=6');
        });
      })

      .run(function () {
        test.done();
      });
});
